export interface Dealer {
  id: string;
  name: string;
  brand: string;
  brandId: string;
  address: string;
  area: string;
  city: string;
  phone: string;
  email: string;
  workingHours: string;
  services: string[];
  coordinates: {
    lat: number;
    lng: number;
  };
}

export const dealers: Dealer[] = [
  // Toyota Dealers
  {
    id: 'toyota-anna-nagar',
    name: 'Toyota Showroom - Anna Nagar',
    brand: 'Toyota',
    brandId: 'toyota',
    address: 'No. 123, 2nd Avenue, Anna Nagar East',
    area: 'Anna Nagar',
    city: 'Chennai',
    phone: '+91 44 2626 0000',
    email: 'sales.annanagar@toyota.com',
    workingHours: '9:00 AM - 7:00 PM (Mon-Sat)',
    services: ['Sales', 'Service', 'Spare Parts', 'Test Drive'],
    coordinates: { lat: 13.0891, lng: 80.2095 }
  },
  {
    id: 'toyota-mount-road',
    name: 'Toyota Showroom - Mount Road',
    brand: 'Toyota',
    brandId: 'toyota',
    address: 'No. 456, Anna Salai, Teynampet',
    area: 'Mount Road',
    city: 'Chennai',
    phone: '+91 44 2432 0000',
    email: 'sales.mountroad@toyota.com',
    workingHours: '9:00 AM - 7:00 PM (Mon-Sat)',
    services: ['Sales', 'Service', 'Spare Parts', 'Test Drive'],
    coordinates: { lat: 13.0418, lng: 80.2344 }
  },
  {
    id: 'toyota-omr',
    name: 'Toyota Showroom - OMR',
    brand: 'Toyota',
    brandId: 'toyota',
    address: 'No. 789, Rajiv Gandhi Salai, Sholinganallur',
    area: 'OMR',
    city: 'Chennai',
    phone: '+91 44 2450 0000',
    email: 'sales.omr@toyota.com',
    workingHours: '9:00 AM - 7:00 PM (Mon-Sat)',
    services: ['Sales', 'Service', 'Spare Parts', 'Test Drive'],
    coordinates: { lat: 12.9010, lng: 80.2279 }
  },

  // Honda Dealers
  {
    id: 'honda-adyar',
    name: 'Honda Cars - Adyar',
    brand: 'Honda',
    brandId: 'honda',
    address: 'No. 101, Lattice Bridge Road, Adyar',
    area: 'Adyar',
    city: 'Chennai',
    phone: '+91 44 2445 0000',
    email: 'sales.adyar@honda.com',
    workingHours: '9:00 AM - 7:00 PM (Mon-Sat)',
    services: ['Sales', 'Service', 'Spare Parts', 'Test Drive'],
    coordinates: { lat: 13.0012, lng: 80.2565 }
  },
  {
    id: 'honda-ambattur',
    name: 'Honda Cars - Ambattur',
    brand: 'Honda',
    brandId: 'honda',
    address: 'No. 202, Ambattur Industrial Estate',
    area: 'Ambattur',
    city: 'Chennai',
    phone: '+91 44 2625 0000',
    email: 'sales.ambattur@honda.com',
    workingHours: '9:00 AM - 7:00 PM (Mon-Sat)',
    services: ['Sales', 'Service', 'Spare Parts', 'Test Drive'],
    coordinates: { lat: 13.1143, lng: 80.1548 }
  },
  {
    id: 'honda-bikes-anna-nagar',
    name: 'Honda Bikes - Anna Nagar',
    brand: 'Honda',
    brandId: 'honda',
    address: 'No. 303, 3rd Avenue, Anna Nagar',
    area: 'Anna Nagar',
    city: 'Chennai',
    phone: '+91 44 2620 0000',
    email: 'bikes.annanagar@honda.com',
    workingHours: '9:00 AM - 7:00 PM (Mon-Sat)',
    services: ['Sales', 'Service', 'Spare Parts', 'Test Ride'],
    coordinates: { lat: 13.0850, lng: 80.2100 }
  },

  // Yamaha Dealers
  {
    id: 'yamaha-t-nagar',
    name: 'Yamaha Showroom - T Nagar',
    brand: 'Yamaha',
    brandId: 'yamaha',
    address: 'No. 404, North Usman Road, T Nagar',
    area: 'T Nagar',
    city: 'Chennai',
    phone: '+91 44 2815 0000',
    email: 'sales.tnagar@yamaha.com',
    workingHours: '9:00 AM - 7:00 PM (Mon-Sat)',
    services: ['Sales', 'Service', 'Spare Parts', 'Test Ride'],
    coordinates: { lat: 13.0418, lng: 80.2341 }
  },
  {
    id: 'yamaha-velachery',
    name: 'Yamaha Showroom - Velachery',
    brand: 'Yamaha',
    brandId: 'yamaha',
    address: 'No. 505, Velachery Main Road, Velachery',
    area: 'Velachery',
    city: 'Chennai',
    phone: '+91 44 2253 0000',
    email: 'sales.velachery@yamaha.com',
    workingHours: '9:00 AM - 7:00 PM (Mon-Sat)',
    services: ['Sales', 'Service', 'Spare Parts', 'Test Ride'],
    coordinates: { lat: 12.9815, lng: 80.2180 }
  },
  {
    id: 'yamaha-porur',
    name: 'Yamaha Showroom - Porur',
    brand: 'Yamaha',
    brandId: 'yamaha',
    address: 'No. 606, Mount Poonamallee Road, Porur',
    area: 'Porur',
    city: 'Chennai',
    phone: '+91 44 2476 0000',
    email: 'sales.porur@yamaha.com',
    workingHours: '9:00 AM - 7:00 PM (Mon-Sat)',
    services: ['Sales', 'Service', 'Spare Parts', 'Test Ride'],
    coordinates: { lat: 13.0382, lng: 80.1565 }
  },

  // Royal Enfield Dealers
  {
    id: 're-egmore',
    name: 'Royal Enfield - Egmore',
    brand: 'Royal Enfield',
    brandId: 'royal-enfield',
    address: 'No. 707, Pantheon Road, Egmore',
    area: 'Egmore',
    city: 'Chennai',
    phone: '+91 44 2819 0000',
    email: 'sales.egmore@royalenfield.com',
    workingHours: '9:00 AM - 7:00 PM (Mon-Sat)',
    services: ['Sales', 'Service', 'Spare Parts', 'Test Ride', 'Gear Store'],
    coordinates: { lat: 13.0827, lng: 80.2707 }
  },
  {
    id: 're-anna-nagar',
    name: 'Royal Enfield - Anna Nagar',
    brand: 'Royal Enfield',
    brandId: 'royal-enfield',
    address: 'No. 808, 2nd Avenue, Anna Nagar West',
    area: 'Anna Nagar',
    city: 'Chennai',
    phone: '+91 44 2618 0000',
    email: 'sales.annanagar@royalenfield.com',
    workingHours: '9:00 AM - 7:00 PM (Mon-Sat)',
    services: ['Sales', 'Service', 'Spare Parts', 'Test Ride', 'Gear Store'],
    coordinates: { lat: 13.0880, lng: 80.2050 }
  },
  {
    id: 're-mylapore',
    name: 'Royal Enfield - Mylapore',
    brand: 'Royal Enfield',
    brandId: 'royal-enfield',
    address: 'No. 909, Luz Church Road, Mylapore',
    area: 'Mylapore',
    city: 'Chennai',
    phone: '+91 44 2464 0000',
    email: 'sales.mylapore@royalenfield.com',
    workingHours: '9:00 AM - 7:00 PM (Mon-Sat)',
    services: ['Sales', 'Service', 'Spare Parts', 'Test Ride', 'Gear Store'],
    coordinates: { lat: 13.0368, lng: 80.2676 }
  },
  {
    id: 're-kilpauk',
    name: 'Royal Enfield - Kilpauk',
    brand: 'Royal Enfield',
    brandId: 'royal-enfield',
    address: 'No. 111, EVR Periyar Salai, Kilpauk',
    area: 'Kilpauk',
    city: 'Chennai',
    phone: '+91 44 2641 0000',
    email: 'sales.kilpauk@royalenfield.com',
    workingHours: '9:00 AM - 7:00 PM (Mon-Sat)',
    services: ['Sales', 'Service', 'Spare Parts', 'Test Ride', 'Gear Store'],
    coordinates: { lat: 13.0835, lng: 80.2450 }
  },

  // Kawasaki Dealers
  {
    id: 'kawasaki-mount-road',
    name: 'Kawasaki Showroom - Mount Road',
    brand: 'Kawasaki',
    brandId: 'kawasaki',
    address: 'No. 222, Anna Salai, Teynampet',
    area: 'Mount Road',
    city: 'Chennai',
    phone: '+91 44 2434 0000',
    email: 'sales.mountroad@kawasaki.com',
    workingHours: '9:00 AM - 7:00 PM (Mon-Sat)',
    services: ['Sales', 'Service', 'Spare Parts', 'Test Ride'],
    coordinates: { lat: 13.0400, lng: 80.2350 }
  },
  {
    id: 'kawasaki-omr',
    name: 'Kawasaki Showroom - OMR',
    brand: 'Kawasaki',
    brandId: 'kawasaki',
    address: 'No. 333, Rajiv Gandhi Salai, Navalur',
    area: 'OMR',
    city: 'Chennai',
    phone: '+91 44 2456 0000',
    email: 'sales.omr@kawasaki.com',
    workingHours: '9:00 AM - 7:00 PM (Mon-Sat)',
    services: ['Sales', 'Service', 'Spare Parts', 'Test Ride'],
    coordinates: { lat: 12.8500, lng: 80.2270 }
  },

  // BMW Motorrad Dealers
  {
    id: 'bmw-bikes-adyar',
    name: 'BMW Motorrad - Adyar',
    brand: 'BMW Motorrad',
    brandId: 'bmw',
    address: 'No. 444, Lattice Bridge Road, Adyar',
    area: 'Adyar',
    city: 'Chennai',
    phone: '+91 44 2446 0000',
    email: 'bikes.adyar@bmw.in',
    workingHours: '9:00 AM - 7:00 PM (Mon-Sat)',
    services: ['Sales', 'Service', 'Spare Parts', 'Test Ride', 'BMW Motorrad Gear'],
    coordinates: { lat: 13.0000, lng: 80.2570 }
  },
  {
    id: 'bmw-cars-mount-road',
    name: 'BMW - Mount Road',
    brand: 'BMW',
    brandId: 'bmw-cars',
    address: 'No. 555, Anna Salai, Teynampet',
    area: 'Mount Road',
    city: 'Chennai',
    phone: '+91 44 2435 0000',
    email: 'cars.mountroad@bmw.in',
    workingHours: '9:00 AM - 7:00 PM (Mon-Sat)',
    services: ['Sales', 'Service', 'Spare Parts', 'Test Drive', 'BMW Lifestyle'],
    coordinates: { lat: 13.0420, lng: 80.2330 }
  },

  // Suzuki Dealers
  {
    id: 'suzuki-nungambakkam',
    name: 'Suzuki Showroom - Nungambakkam',
    brand: 'Suzuki',
    brandId: 'suzuki',
    address: 'No. 666, College Road, Nungambakkam',
    area: 'Nungambakkam',
    city: 'Chennai',
    phone: '+91 44 2827 0000',
    email: 'sales.nungambakkam@suzuki.com',
    workingHours: '9:00 AM - 7:00 PM (Mon-Sat)',
    services: ['Sales', 'Service', 'Spare Parts', 'Test Ride'],
    coordinates: { lat: 13.0600, lng: 80.2500 }
  },
  {
    id: 'suzuki-velachery',
    name: 'Suzuki Showroom - Velachery',
    brand: 'Suzuki',
    brandId: 'suzuki',
    address: 'No. 777, Velachery Main Road, Velachery',
    area: 'Velachery',
    city: 'Chennai',
    phone: '+91 44 2254 0000',
    email: 'sales.velachery@suzuki.com',
    workingHours: '9:00 AM - 7:00 PM (Mon-Sat)',
    services: ['Sales', 'Service', 'Spare Parts', 'Test Ride'],
    coordinates: { lat: 12.9800, lng: 80.2190 }
  },

  // KTM Dealers
  {
    id: 'ktm-anna-nagar',
    name: 'KTM Showroom - Anna Nagar',
    brand: 'KTM',
    brandId: 'ktm',
    address: 'No. 888, 2nd Avenue, Anna Nagar East',
    area: 'Anna Nagar',
    city: 'Chennai',
    phone: '+91 44 2627 0000',
    email: 'sales.annanagar@ktm.com',
    workingHours: '9:00 AM - 7:00 PM (Mon-Sat)',
    services: ['Sales', 'Service', 'Spare Parts', 'Test Ride', 'KTM PowerWear'],
    coordinates: { lat: 13.0900, lng: 80.2080 }
  },
  {
    id: 'ktm-t-nagar',
    name: 'KTM Showroom - T Nagar',
    brand: 'KTM',
    brandId: 'ktm',
    address: 'No. 999, North Usman Road, T Nagar',
    area: 'T Nagar',
    city: 'Chennai',
    phone: '+91 44 2816 0000',
    email: 'sales.tnagar@ktm.com',
    workingHours: '9:00 AM - 7:00 PM (Mon-Sat)',
    services: ['Sales', 'Service', 'Spare Parts', 'Test Ride', 'KTM PowerWear'],
    coordinates: { lat: 13.0420, lng: 80.2335 }
  },

  // Triumph Dealers
  {
    id: 'triumph-adyar',
    name: 'Triumph Motorcycles - Adyar',
    brand: 'Triumph',
    brandId: 'triumph',
    address: 'No. 1111, Lattice Bridge Road, Adyar',
    area: 'Adyar',
    city: 'Chennai',
    phone: '+91 44 2447 0000',
    email: 'sales.adyar@triumphmotorcycles.in',
    workingHours: '9:00 AM - 7:00 PM (Mon-Sat)',
    services: ['Sales', 'Service', 'Spare Parts', 'Test Ride', 'Triumph Clothing'],
    coordinates: { lat: 13.0020, lng: 80.2580 }
  },

  // Aprilia Dealers
  {
    id: 'aprilia-mount-road',
    name: 'Aprilia Showroom - Mount Road',
    brand: 'Aprilia',
    brandId: 'aprilia',
    address: 'No. 1222, Anna Salai, Teynampet',
    area: 'Mount Road',
    city: 'Chennai',
    phone: '+91 44 2436 0000',
    email: 'sales.mountroad@aprilia.com',
    workingHours: '9:00 AM - 7:00 PM (Mon-Sat)',
    services: ['Sales', 'Service', 'Spare Parts', 'Test Ride'],
    coordinates: { lat: 13.0410, lng: 80.2340 }
  },

  // Harley-Davidson Dealers
  {
    id: 'hd-adyar',
    name: 'Harley-Davidson - Adyar',
    brand: 'Harley-Davidson',
    brandId: 'harley-davidson',
    address: 'No. 1333, Lattice Bridge Road, Adyar',
    area: 'Adyar',
    city: 'Chennai',
    phone: '+91 44 2448 0000',
    email: 'sales.adyar@harley-davidson.in',
    workingHours: '9:00 AM - 7:00 PM (Mon-Sat)',
    services: ['Sales', 'Service', 'Spare Parts', 'Test Ride', 'Harley-Davidson Merchandise', 'Riding Academy'],
    coordinates: { lat: 13.0030, lng: 80.2590 }
  },

  // Mahindra Dealers
  {
    id: 'mahindra-ambattur',
    name: 'Mahindra Showroom - Ambattur',
    brand: 'Mahindra',
    brandId: 'mahindra',
    address: 'No. 1444, Ambattur Industrial Estate',
    area: 'Ambattur',
    city: 'Chennai',
    phone: '+91 44 2626 0000',
    email: 'sales.ambattur@mahindra.com',
    workingHours: '9:00 AM - 7:00 PM (Mon-Sat)',
    services: ['Sales', 'Service', 'Spare Parts', 'Test Drive'],
    coordinates: { lat: 13.1150, lng: 80.1550 }
  },
  {
    id: 'mahindra-omr',
    name: 'Mahindra Showroom - OMR',
    brand: 'Mahindra',
    brandId: 'mahindra',
    address: 'No. 1555, Rajiv Gandhi Salai, Sholinganallur',
    area: 'OMR',
    city: 'Chennai',
    phone: '+91 44 2451 0000',
    email: 'sales.omr@mahindra.com',
    workingHours: '9:00 AM - 7:00 PM (Mon-Sat)',
    services: ['Sales', 'Service', 'Spare Parts', 'Test Drive'],
    coordinates: { lat: 12.9020, lng: 80.2280 }
  },
  {
    id: 'mahindra-mount-road',
    name: 'Mahindra Showroom - Mount Road',
    brand: 'Mahindra',
    brandId: 'mahindra',
    address: 'No. 1666, Anna Salai, Teynampet',
    area: 'Mount Road',
    city: 'Chennai',
    phone: '+91 44 2433 0000',
    email: 'sales.mountroad@mahindra.com',
    workingHours: '9:00 AM - 7:00 PM (Mon-Sat)',
    services: ['Sales', 'Service', 'Spare Parts', 'Test Drive'],
    coordinates: { lat: 13.0430, lng: 80.2320 }
  },

  // TVS Dealers
  {
    id: 'tvs-anna-nagar',
    name: 'TVS Showroom - Anna Nagar',
    brand: 'TVS',
    brandId: 'tvs',
    address: 'No. 1777, 2nd Avenue, Anna Nagar East',
    area: 'Anna Nagar',
    city: 'Chennai',
    phone: '+91 44 2628 0000',
    email: 'sales.annanagar@tvs.com',
    workingHours: '9:00 AM - 7:00 PM (Mon-Sat)',
    services: ['Sales', 'Service', 'Spare Parts', 'Test Ride'],
    coordinates: { lat: 13.0910, lng: 80.2070 }
  },
  {
    id: 'tvs-t-nagar',
    name: 'TVS Showroom - T Nagar',
    brand: 'TVS',
    brandId: 'tvs',
    address: 'No. 1888, North Usman Road, T Nagar',
    area: 'T Nagar',
    city: 'Chennai',
    phone: '+91 44 2817 0000',
    email: 'sales.tnagar@tvs.com',
    workingHours: '9:00 AM - 7:00 PM (Mon-Sat)',
    services: ['Sales', 'Service', 'Spare Parts', 'Test Ride'],
    coordinates: { lat: 13.0435, lng: 80.2330 }
  },
  {
    id: 'tvs-velachery',
    name: 'TVS Showroom - Velachery',
    brand: 'TVS',
    brandId: 'tvs',
    address: 'No. 1999, Velachery Main Road, Velachery',
    area: 'Velachery',
    city: 'Chennai',
    phone: '+91 44 2255 0000',
    email: 'sales.velachery@tvs.com',
    workingHours: '9:00 AM - 7:00 PM (Mon-Sat)',
    services: ['Sales', 'Service', 'Spare Parts', 'Test Ride'],
    coordinates: { lat: 12.9820, lng: 80.2170 }
  },

  // Ford Dealers
  {
    id: 'ford-anna-nagar',
    name: 'Ford Showroom - Anna Nagar',
    brand: 'Ford',
    brandId: 'ford',
    address: 'No. 2000, 2nd Avenue, Anna Nagar West',
    area: 'Anna Nagar',
    city: 'Chennai',
    phone: '+91 44 2619 0000',
    email: 'sales.annanagar@ford.com',
    workingHours: '9:00 AM - 7:00 PM (Mon-Sat)',
    services: ['Sales', 'Service', 'Spare Parts', 'Test Drive'],
    coordinates: { lat: 13.0860, lng: 80.2040 }
  },

  // Mercedes-Benz Dealers
  {
    id: 'mercedes-mount-road',
    name: 'Mercedes-Benz - Mount Road',
    brand: 'Mercedes-Benz',
    brandId: 'mercedes-benz',
    address: 'No. 2111, Anna Salai, Teynampet',
    area: 'Mount Road',
    city: 'Chennai',
    phone: '+91 44 2437 0000',
    email: 'sales.mountroad@mercedes-benz.co.in',
    workingHours: '9:00 AM - 7:00 PM (Mon-Sat)',
    services: ['Sales', 'Service', 'Spare Parts', 'Test Drive', 'Mercedes-Benz Collection'],
    coordinates: { lat: 13.0440, lng: 80.2310 }
  },
];

export const getDealersByBrand = (brandId: string): Dealer[] => {
  return dealers.filter(dealer => dealer.brandId === brandId);
};

export const getDealersByArea = (area: string): Dealer[] => {
  return dealers.filter(dealer => 
    dealer.area.toLowerCase().includes(area.toLowerCase())
  );
};

export const getAllAreas = (): string[] => {
  const areas = new Set(dealers.map(dealer => dealer.area));
  return Array.from(areas).sort();
};

export const getAllBrands = (): string[] => {
  const brandNames = new Set(dealers.map(dealer => dealer.brand));
  return Array.from(brandNames).sort();
};
