import { apiFetch } from '../lib/api';

export type BookingStatus =
  | 'Pending'
  | 'Approved'
  | 'Rejected'
  | 'Cancelled'
  | 'Completed';

export type PaymentStatus =
  | 'Not Required'
  | 'Pending'
  | 'Paid';

export interface DatabaseVehicle {
  id: string;
  companyId: string;
  name: string;
  category: 'car' | 'bike';
  type: string;
  price: string;
  image: string;
  brandId: string;
  brandName: string;
  availableForTrial: boolean;
}

export interface Booking {
  id: string;
  bookingCode: string;
  userId: string;
  companyId: string;
  vehicleId: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  vehicleName: string;
  companyName: string;
  showroom: string;
  date: string;
  time: string;
  notes: string;
  bookingFee: number;
  currency: 'INR';
  paymentStatus: PaymentStatus;
  status: BookingStatus;
  createdAt: string;
  updatedAt: string;
}

export interface BookingFormData {
  vehicleId: string;
  name: string;
  phone: string;
  showroom: string;
  showroomId?: string;
  date: string;
  time: string;
  notes?: string;
}

export interface BookingSlot {
  time: string;
  available: boolean;
}

export interface BookingSlotsResponse {
  vehicleId: string;
  showroomId: string;
  date: string;
  slots: BookingSlot[];
}

export interface BookingResponse {
  message: string;
  booking: Booking;
}

function normalize(value: string): string {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]/g, '');
}

export async function getDatabaseVehicles():
  Promise<DatabaseVehicle[]> {
  return apiFetch<DatabaseVehicle[]>('/api/vehicles');
}

export async function findDatabaseVehicle(
  brandName: string,
  vehicleName: string
): Promise<DatabaseVehicle | null> {
  const vehicles = await getDatabaseVehicles();

  const brand = normalize(brandName);
  const name = normalize(vehicleName);

  return (
    vehicles.find(vehicle =>
      normalize(vehicle.brandName) === brand &&
      normalize(vehicle.name) === name
    ) || null
  );
}

export async function getAvailableBookingSlots(
  vehicleId: string,
  date: string,
  showroomId: string
): Promise<BookingSlotsResponse> {
  const params = new URLSearchParams({
    vehicleId,
    showroomId,
    date
  });

  return apiFetch<BookingSlotsResponse>(
    `/api/bookings/slots?${params.toString()}`
  );
}

export async function createBooking(
  formData: BookingFormData
): Promise<BookingResponse> {
  return apiFetch<BookingResponse>('/api/bookings', {
    method: 'POST',
    body: JSON.stringify(formData)
  });
}

export async function getMyBookings():
  Promise<Booking[]> {
  return apiFetch<Booking[]>('/api/bookings/my');
}

export async function getCompanyBookings():
  Promise<Booking[]> {
  return apiFetch<Booking[]>('/api/bookings/company');
}

export async function getAllBookings():
  Promise<Booking[]> {
  return apiFetch<Booking[]>('/api/bookings/all');
}

export async function cancelBooking(
  bookingId: string
): Promise<BookingResponse> {
  return apiFetch<BookingResponse>(
    `/api/bookings/${bookingId}/cancel`,
    {
      method: 'PATCH'
    }
  );
}

export async function updateBookingStatus(
  bookingId: string,
  status: 'Approved' | 'Rejected' | 'Completed'
): Promise<BookingResponse> {
  return apiFetch<BookingResponse>(
    `/api/bookings/${bookingId}/status`,
    {
      method: 'PATCH',
      body: JSON.stringify({ status })
    }
  );
}