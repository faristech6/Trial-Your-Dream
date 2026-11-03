export interface BookingFee {
  amount: number;
  displayText: string;
  isFree: boolean;
  color: 'green' | 'blue';
}

/**
 * Parse price string to extract numeric value in Lakhs
 * Handles formats like: "â‚¹12-18 Lakh", "â‚¹2.5-3 Crore", "â‚¹85,000-95,000"
 */
function parsePriceToLakhs(priceString: string): number {
  if (!priceString) return 0;
  
  // Remove â‚¹ symbol and clean up
  const cleanPrice = priceString.replace(/â‚¹/g, '').trim();
  
  // Handle Crore (1 Crore = 100 Lakhs)
  if (cleanPrice.toLowerCase().includes('crore')) {
    const croreMatch = cleanPrice.match(/(\d+\.?\d*)/);
    if (croreMatch) {
      const croreValue = parseFloat(croreMatch[1]);
      // If it's a range, take the lower value
      const rangeMatch = cleanPrice.match(/(\d+\.?\d*)\s*-\s*(\d+\.?\d*)/);
      if (rangeMatch) {
        return parseFloat(rangeMatch[1]) * 100;
      }
      return croreValue * 100;
    }
  }
  
  // Handle Lakh
  if (cleanPrice.toLowerCase().includes('lakh')) {
    const lakhMatch = cleanPrice.match(/(\d+\.?\d*)/);
    if (lakhMatch) {
      const lakhValue = parseFloat(lakhMatch[1]);
      // If it's a range, take the lower value
      const rangeMatch = cleanPrice.match(/(\d+\.?\d*)\s*-\s*(\d+\.?\d*)/);
      if (rangeMatch) {
        return parseFloat(rangeMatch[1]);
      }
      return lakhValue;
    }
  }
  
  // Handle direct numbers (like â‚¹85,000-95,000)
  const numMatch = cleanPrice.match(/(\d+,?\d*)/);
  if (numMatch) {
    const numValue = parseFloat(numMatch[1].replace(/,/g, ''));
    // Convert to lakhs (1 Lakh = 100,000)
    return numValue / 100000;
  }
  
  return 0;
}

/**
 * Calculate bike booking fee based on price slab
 */
function calculateBikeBookingFee(priceInLakhs: number): BookingFee {
  if (priceInLakhs < 1.5) {
    return {
      amount: 0,
      displayText: 'FREE',
      isFree: true,
      color: 'green',
    };
  } else if (priceInLakhs >= 1.5 && priceInLakhs < 3) {
    return {
      amount: 99,
      displayText: 'â‚¹99',
      isFree: false,
      color: 'blue',
    };
  } else if (priceInLakhs >= 3 && priceInLakhs < 8) {
    return {
      amount: 299,
      displayText: 'â‚¹299',
      isFree: false,
      color: 'blue',
    };
  } else {
    return {
      amount: 599,
      displayText: 'â‚¹599',
      isFree: false,
      color: 'blue',
    };
  }
}

/**
 * Calculate car booking fee based on price slab
 */
function calculateCarBookingFee(priceInLakhs: number): BookingFee {
  if (priceInLakhs < 6) {
    return {
      amount: 0,
      displayText: 'FREE',
      isFree: true,
      color: 'green',
    };
  } else if (priceInLakhs >= 6 && priceInLakhs < 15) {
    return {
      amount: 299,
      displayText: 'â‚¹299',
      isFree: false,
      color: 'blue',
    };
  } else if (priceInLakhs >= 15 && priceInLakhs < 50) {
    return {
      amount: 699,
      displayText: 'â‚¹699',
      isFree: false,
      color: 'blue',
    };
  } else {
    return {
      amount: 1499,
      displayText: 'â‚¹1,499',
      isFree: false,
      color: 'blue',
    };
  }
}

/**
 * Get booking fee for a vehicle based on its category and price
 */
export function getBookingFee(category: 'car' | 'bike', priceString: string): BookingFee {
  const priceInLakhs = parsePriceToLakhs(priceString);
  
  if (category === 'bike') {
    return calculateBikeBookingFee(priceInLakhs);
  } else {
    return calculateCarBookingFee(priceInLakhs);
  }
}

/**
 * Format booking fee for display
 */
export function formatBookingFee(fee: BookingFee): string {
  if (fee.isFree) {
    return 'FREE Booking â€“ No Convenience Charge';
  }
  return `Booking Fee: ${fee.displayText}`;
}

/**
 * Get booking fee note text
 */
export function getBookingFeeNote(): string {
  return 'Booking fee is a convenience charge for priority slot confirmation and may be adjusted upon purchase.';
}
