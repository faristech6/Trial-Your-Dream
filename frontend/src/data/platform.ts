import { brands, type Vehicle } from './vehicles';
import { dealers, type Dealer } from './dealers';

export type BookingStatus = 'Pending' | 'Confirmed' | 'Completed' | 'Cancelled' | 'No Show';

export interface PlatformVehicle extends Vehicle {
  brandId: string;
  brandName: string;
  companyId: string;
  fuelType: string;
  transmission: string;
  seatingCapacity: number;
  availableForTrial: boolean;
}

export interface PlatformBooking {
  id: string;
  userName: string;
  vehicleId: string;
  vehicleName: string;
  brandName: string;
  companyId: string;
  showroom: string;
  date: string;
  time: string;
  status: BookingStatus;
  paymentStatus: 'Paid' | 'Pending';
}

export const companies = brands.map((brand) => ({
  id: brand.id,
  name: brand.name,
  logo: brand.logo,
  description: brand.description,
  status: 'Active' as const,
}));

export const platformVehicles: PlatformVehicle[] = brands.flatMap((brand) => brand.vehicles.map((vehicle) => ({
  ...vehicle,
  brandId: brand.id,
  brandName: brand.name,
  companyId: brand.id,
  fuelType: vehicle.engine?.toLowerCase().includes('electric') ? 'Electric' : vehicle.engine?.toLowerCase().includes('diesel') ? 'Diesel' : 'Petrol',
  transmission: vehicle.category === 'bike' ? 'Manual' : 'Automatic',
  seatingCapacity: vehicle.category === 'bike' ? 2 : 5,
  availableForTrial: true,
})));

export const getPlatformVehicle = (id: string) => platformVehicles.find((vehicle) => vehicle.id === id);
export const getCompanyShowrooms = (companyId: string): Dealer[] => dealers.filter((dealer) => dealer.brandId === companyId);

const BOOKING_KEY = 'trial_platform_bookings';
export const getBookings = (): PlatformBooking[] => {
  try {
    return JSON.parse(localStorage.getItem(BOOKING_KEY) || '[]') as PlatformBooking[];
  } catch {
    return [];
  }
};

export const saveBooking = (booking: PlatformBooking) => {
  localStorage.setItem(BOOKING_KEY, JSON.stringify([booking, ...getBookings()]));
};