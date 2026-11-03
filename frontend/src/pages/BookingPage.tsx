
import { useEffect, useMemo, useState, type ChangeEvent, type FormEvent } from 'react';
import { Link, useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import { gsap } from 'gsap';
import {
  ArrowLeft,
  Calendar,
  Clock,
  User,
  Phone,
  Mail,
  MapPin,
  Car,
  Check,
  ChevronRight,
  Send,
  MessageSquare,
  Wallet,
  CreditCard,
  Lock,
  AlertCircle,
  Loader2,
  CheckCircle2
} from 'lucide-react';

import { apiFetch, assetSrc } from '../lib/api';
import BookingShowroomSelect from '../components/BookingShowroomSelect';
import { useAuth } from '../context/AuthContext';
import { getBookingFeeNote } from '../utils/bookingFee';
import {
  getDatabaseVehicles,
  getAvailableBookingSlots,
  createBooking,
  type DatabaseVehicle,
  type BookingSlot,
  type Booking
} from '../services/bookingApi';

type PaymentMethod = 'upi' | 'card' | 'netbanking';

interface PublicShowroom {
  id: string;
  companyId: string;
  companyName: string;
  name: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
  openingHours: string;
  active: boolean;
}

interface FormData {
  name: string;
  phone: string;
  email: string;
  brand: string;
  vehicle: string;
  dealer: string;
  date: string;
  time: string;
  notes: string;
}

const initialForm: FormData = {
  name: '',
  phone: '',
  email: '',
  brand: '',
  vehicle: '',
  dealer: '',
  date: '',
  time: '',
  notes: ''
};

const steps = [
  { number: 1, title: 'Personal Info' },
  { number: 2, title: 'Vehicle' },
  { number: 3, title: 'Showroom & Time' },
  { number: 4, title: 'Payment' },
  { number: 5, title: 'Confirm' }
];

function todayInIndia(): string {
  const parts = new Intl.DateTimeFormat('en-GB', {
    timeZone: 'Asia/Kolkata',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit'
  }).formatToParts(new Date());

  const part = (type: string) =>
    parts.find(item => item.type === type)?.value || '';

  return `${part('year')}-${part('month')}-${part('day')}`;
}

function calculateFee(
  vehicle: DatabaseVehicle | undefined
): number {
  if (!vehicle) return 0;

  const match = vehicle.price
    .replace(/,/g, '')
    .match(/(\d+(?:\.\d+)?)/);

  const value = match ? Number(match[1]) : 0;
  const price = vehicle.price.toLowerCase();

  const lakhs = price.includes('crore')
    ? value * 100
    : price.includes('lakh')
      ? value
      : value / 100000;

  if (vehicle.category === 'bike') {
    if (lakhs < 1.5) return 0;
    if (lakhs < 3) return 99;
    if (lakhs < 8) return 299;
    return 599;
  }

  if (lakhs < 6) return 0;
  if (lakhs < 15) return 299;
  if (lakhs < 50) return 699;
  return 1499;
}

const inputClass =
  'w-full px-4 py-4 rounded-xl bg-[#103a58] border border-[#285673] text-[#f8fafc] placeholder-[#7695a5] focus:outline-none focus:border-[#16a7b7] transition-colors';

const primaryButton =
  'inline-flex items-center justify-center gap-2 px-7 py-3.5 bg-[#07549a] rounded-xl text-white font-semibold hover:bg-[#0875ac] transition disabled:opacity-50 disabled:cursor-not-allowed';

const backButton =
  'inline-flex items-center justify-center gap-2 px-6 py-3.5 border border-[#285673] rounded-xl text-[#f8fafc] font-semibold hover:bg-[#103a58] transition';

const panelClass =
  'p-6 rounded-2xl bg-[#103a58] border border-[#285673]/70';

export default function BookingPage() {
  const { user, authLoading } = useAuth();

  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();

  const requestedVehicleId = searchParams.get('vehicle');

  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState<FormData>(initialForm);

  const [vehicles, setVehicles] = useState<DatabaseVehicle[]>([]);
  const [slots, setSlots] = useState<BookingSlot[]>([]);
  const [showrooms, setShowrooms] = useState<PublicShowroom[]>([]);
  const [loadingShowrooms, setLoadingShowrooms] = useState(false);

  const [loadingVehicles, setLoadingVehicles] = useState(true);
  const [loadingSlots, setLoadingSlots] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const [error, setError] = useState('');
  const [slotError, setSlotError] = useState('');

  const [submittedBooking, setSubmittedBooking] =
    useState<Booking | null>(null);

  const [paymentMethod, setPaymentMethod] =
    useState<PaymentMethod>('upi');

  const [imageFailed, setImageFailed] = useState(false);

  const selectedVehicle = vehicles.find(
    vehicle => vehicle.id === formData.vehicle
  );

  const availableBrands = useMemo(() => {
    const map = new Map<string, string>();

    for (const vehicle of vehicles) {
      map.set(vehicle.brandId, vehicle.brandName);
    }

    return Array.from(map.entries())
      .map(([id, name]) => ({ id, name }))
      .sort((a, b) => a.name.localeCompare(b.name));
  }, [vehicles]);

  const availableVehicles = vehicles.filter(
    vehicle => vehicle.brandId === formData.brand
  );

  const selectedBrand = availableBrands.find(
    brand => brand.id === formData.brand
  );

  const selectedDealer = showrooms.find(
    showroom => showroom.id === formData.dealer &&
      showroom.companyId === selectedVehicle?.companyId &&
      showroom.active
  );

  useEffect(() => {
    let active = true;
    setShowrooms([]);
    setLoadingShowrooms(Boolean(selectedVehicle?.companyId));

    if (!selectedVehicle?.companyId) return;

    void apiFetch<PublicShowroom[]>('/api/showrooms/public')
      .then(result => {
        if (!active) return;
        setShowrooms(Array.isArray(result) ? result.filter(
          showroom => showroom.companyId === selectedVehicle.companyId && showroom.active
        ) : []);
      })
      .catch(reason => {
        if (!active) return;
        setSlotError(reason instanceof Error ? reason.message : 'Unable to load showrooms.');
      })
      .finally(() => {
        if (active) setLoadingShowrooms(false);
      });

    return () => { active = false; };
  }, [selectedVehicle?.companyId]);

  const bookingFee = calculateFee(selectedVehicle);
  const isFree = bookingFee === 0;
  const displayFee = isFree ? 'FREE' : `₹${bookingFee}`;

  const origin = (location.state as { from?: string } | null)?.from;

  const returnPath =
    origin && /^\/(brands|vehicles)(\/[a-zA-Z0-9-]+)?$/.test(origin)
      ? origin
      : requestedVehicleId
        ? `/vehicles/${requestedVehicleId}`
        : user
          ? user.role === 'SUPER_ADMIN'
            ? '/admin/dashboard'
            : user.role === 'COMPANY_ADMIN'
              ? '/company/dashboard'
              : '/dashboard'
          : '/vehicles';

  useEffect(() => {
    window.scrollTo(0, 0);

    gsap.fromTo(
      '.booking-form',
      { opacity: 0, y: 20 },
      { opacity: 1, y: 0, duration: 0.4, ease: 'power3.out' }
    );
  }, []);

  useEffect(() => {
    if (!user) return;

    setFormData(previous => ({
      ...previous,
      name: previous.name || user.name,
      email: previous.email || user.email,
      phone: previous.phone || user.phone || ''
    }));
  }, [user]);

  // Load vehicles directly from MongoDB.
  // If the URL includes ?vehicle=..., preselect that vehicle.
  useEffect(() => {
    let active = true;

    async function loadVehicles() {
      setLoadingVehicles(true);

      try {
        const result = await getDatabaseVehicles();

        if (!active) return;

        setVehicles(result);

        if (requestedVehicleId) {
          const requested = result.find(
            vehicle => vehicle.id === requestedVehicleId
          );

          if (requested) {
            setFormData(previous => ({
              ...previous,
              brand: requested.brandId,
              vehicle: requested.id,
              dealer: '',
              date: '',
              time: ''
            }));
          } else {
            setError(
              'The selected vehicle is unavailable. Please choose another vehicle.'
            );
          }
        }
      } catch (err) {
        if (!active) return;

        setError(
          err instanceof Error
            ? err.message
            : 'Unable to load vehicles from MongoDB.'
        );
      } finally {
        if (active) setLoadingVehicles(false);
      }
    }

    void loadVehicles();

    return () => {
      active = false;
    };
  }, [requestedVehicleId]);

  useEffect(() => {
    setImageFailed(false);
  }, [formData.vehicle]);

  // Check availability for the selected vehicle AND showroom.
  useEffect(() => {
    let active = true;

    if (!formData.vehicle || !formData.dealer || !formData.date) {
      setSlots([]);
      setSlotError('');
      setLoadingSlots(false);
      return;
    }

    async function loadSlots() {
      setLoadingSlots(true);
      setSlotError('');

      try {
        const result = await getAvailableBookingSlots(
          formData.vehicle,
          formData.date,
          formData.dealer
        );

        if (active) {
          setSlots(result.slots);
        }
      } catch (err) {
        if (active) {
          setSlots([]);
          setSlotError(
            err instanceof Error
              ? err.message
              : 'Unable to check booking availability.'
          );
        }
      } finally {
        if (active) setLoadingSlots(false);
      }
    }

    void loadSlots();

    return () => {
      active = false;
    };
  }, [formData.vehicle, formData.dealer, formData.date]);

  function handleInputChange(
    event: ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) {
    const { name, value } = event.target;
    setError('');

    setFormData(previous => {
      if (name === 'brand') {
        return {
          ...previous,
          brand: value,
          vehicle: '',
          dealer: '',
          date: '',
          time: ''
        };
      }

      if (name === 'vehicle') {
        return {
          ...previous,
          vehicle: value,
          dealer: '',
          date: '',
          time: ''
        };
      }

      if (name === 'date') {
        return {
          ...previous,
          date: value,
          time: ''
        };
      }

      return {
        ...previous,
        [name]: value
      };
    });
  }

  function goToStep(nextStep: number) {
    setError('');
    setStep(nextStep);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  function goBack() {
    if (step > 1) {
      goToStep(step - 1);
    } else {
      navigate(returnPath);
    }
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (submitting) return;

    setError('');

    if (!user || user.role !== 'CUSTOMER') {
      setError(
        'Please sign in with a customer account to submit your booking.'
      );
      return;
    }

    if (!selectedVehicle || !selectedDealer) {
      setError('Please select a valid vehicle and showroom.');
      return;
    }

    if (
      !formData.name.trim() ||
      !formData.phone.trim() ||
      !formData.date ||
      !formData.time
    ) {
      setError('Please complete all required information.');
      return;
    }

    if (
      !slots.some(
        slot =>
          slot.time === formData.time &&
          slot.available
      )
    ) {
      setError(
        'This time slot is unavailable. Please choose another.'
      );
      goToStep(3);
      return;
    }

    setSubmitting(true);

    try {
      // Confirm the location still belongs to the vehicle's company.
      const currentShowrooms = await apiFetch<PublicShowroom[]>('/api/showrooms/public');
      const currentShowroom = currentShowrooms.find(item =>
        item.id === formData.dealer &&
        item.active &&
        item.companyId === selectedVehicle.companyId
      );
      if (!currentShowroom) {
        setError('This showroom is no longer available. Please choose another.');
        goToStep(3);
        return;
      }

      const response = await createBooking({
        vehicleId: selectedVehicle.id,
        name: formData.name.trim(),
        phone: formData.phone.trim(),
        showroom: currentShowroom.name,
        showroomId: currentShowroom.id,
        date: formData.date,
        time: formData.time,
        notes: formData.notes.trim()
      });

      setSubmittedBooking(response.booking);

      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : 'Unable to submit booking.'
      );
    } finally {
      setSubmitting(false);
    }
  }

  if (submittedBooking) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#09243b] px-4 py-16">
        <div className="w-full max-w-xl text-center">
          <div className="mx-auto mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-green-500/20">
            <CheckCircle2 className="h-12 w-12 text-green-400" />
          </div>

          <h1 className="text-3xl font-bold text-white">
            Booking Request Submitted!
          </h1>

          <p className="mt-4 text-[#a9c3d0]">
            Your trial booking has been saved in MongoDB.
            The company can now review your request.
          </p>

          <div className={`${panelClass} mt-8 space-y-4 text-left`}>
            <p className="text-white">
              <span className="text-[#a9c3d0]">Booking ID: </span>
              {submittedBooking.bookingCode}
            </p>

            <p className="text-white">
              <span className="text-[#a9c3d0]">Vehicle: </span>
              {submittedBooking.companyName}{' '}
              {submittedBooking.vehicleName}
            </p>

            <p className="text-white">
              <span className="text-[#a9c3d0]">Showroom: </span>
              {submittedBooking.showroom}
            </p>

            <p className="text-white">
              <span className="text-[#a9c3d0]">Appointment: </span>
              {submittedBooking.date} at {submittedBooking.time}
            </p>

            <p className="text-white">
              <span className="text-[#a9c3d0]">Status: </span>
              <span className="text-amber-300">
                {submittedBooking.status}
              </span>
            </p>

            <p className="text-white">
              <span className="text-[#a9c3d0]">Booking Fee: </span>
              {submittedBooking.bookingFee === 0
                ? 'FREE'
                : `₹${submittedBooking.bookingFee}`}
            </p>

            <p className="text-white">
              <span className="text-[#a9c3d0]">Payment: </span>
              {submittedBooking.paymentStatus}
            </p>
          </div>

          {submittedBooking.paymentStatus === 'Pending' && (
            <p className="mt-5 text-sm text-amber-300">
              No payment has been collected. Online payment
              integration is not active yet.
            </p>
          )}

          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <Link to="/dashboard/bookings" className={primaryButton}>
              My Bookings
            </Link>

            <Link to="/vehicles" className={backButton}>
              Explore Vehicles
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#09243b] text-white">

      <section className="border-b border-[#285673] bg-[#0b2d47] py-12">
        <div className="mx-auto max-w-5xl px-4 sm:px-6">

          <button
            type="button"
            onClick={goBack}
            className="mb-8 inline-flex items-center gap-2 rounded-xl border border-[#285673] bg-[#103a58] px-4 py-2.5 text-sm font-semibold text-white hover:border-[#16a7b7]"
          >
            <ArrowLeft className="h-4 w-4" />
            {step === 1 ? 'Back to Previous Page' : 'Previous Step'}
          </button>

          <div className="text-center">
            <span className="inline-flex items-center gap-2 rounded-full bg-[#16a7b7]/20 px-4 py-2 text-sm font-medium text-[#67d7df]">
              <Calendar className="h-4 w-4" />
              Smart Trial Booking
            </span>

            <h1 className="mt-5 text-3xl font-bold sm:text-4xl">
              Schedule Your Test Drive
            </h1>

            <p className="mt-4 text-[#a9c3d0]">
              Choose your vehicle, showroom, date and time.
            </p>

            {requestedVehicleId && selectedVehicle && (
              <div className="mt-5 inline-flex items-center gap-2 rounded-xl border border-[#16a7b7]/40 bg-[#103a58] px-4 py-3 text-sm text-[#67d7df]">
                <Car className="h-5 w-5" />
                Selected: {selectedVehicle.brandName}{' '}
                {selectedVehicle.name}
              </div>
            )}
          </div>
        </div>
      </section>

      <section className="border-b border-[#285673] py-6">
        <div className="mx-auto flex max-w-4xl items-center justify-center gap-1 overflow-x-auto px-4 sm:gap-3">
          {steps.map((item, index) => (
            <div
              key={item.number}
              className="flex shrink-0 items-center"
            >
              <div
                className={`flex items-center gap-2 rounded-xl px-2 py-2 sm:px-4 ${
                  step >= item.number
                    ? 'bg-[#07549a]/30 text-[#67d7df]'
                    : 'bg-[#103a58] text-[#7695a5]'
                }`}
              >
                <span
                  className={`flex h-8 w-8 items-center justify-center rounded-full font-bold ${
                    step >= item.number
                      ? 'bg-[#07549a] text-white'
                      : 'bg-[#285673]'
                  }`}
                >
                  {step > item.number
                    ? <Check className="h-4 w-4" />
                    : item.number}
                </span>

                <span className="hidden text-sm sm:inline">
                  {item.title}
                </span>
              </div>

              {index < steps.length - 1 && (
                <ChevronRight className="mx-1 h-4 w-4 text-[#285673]" />
              )}
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-3xl px-4 py-12 sm:px-6">

        {!authLoading && !user && (
          <div className="mb-6 rounded-xl border border-amber-500/40 bg-amber-500/10 p-5">
            <p className="text-amber-200">
              You can explore the booking process without an account.
              Sign in before submitting the request.
            </p>

            <Link
              to="/signin"
              state={{ from: `${location.pathname}${location.search}` }}
              className="mt-3 inline-flex font-semibold text-[#67d7df] hover:underline"
            >
              Sign In
            </Link>
          </div>
        )}

        {user && user.role !== 'CUSTOMER' && (
          <div className="mb-6 rounded-xl border border-amber-500/40 bg-amber-500/10 p-5 text-amber-200">
            Trial booking requires a customer account.
          </div>
        )}

        {error && (
          <div
            role="alert"
            className="mb-6 flex items-start gap-3 rounded-xl border border-red-400/40 bg-red-500/10 p-4 text-red-200"
          >
            <AlertCircle className="mt-0.5 h-5 w-5 shrink-0" />
            <p>{error}</p>
          </div>
        )}

        <form className="booking-form" onSubmit={handleSubmit}>

          {/* STEP 1: PERSONAL INFORMATION */}

          {step === 1 && (
            <div className="space-y-6">
              <h2 className="text-xl font-bold">
                Personal Information
              </h2>

              <div className="grid gap-6 md:grid-cols-2">
                <div>
                  <label className="mb-2 block text-sm text-[#a9c3d0]">
                    Full Name *
                  </label>

                  <div className="relative">
                    <User className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-[#7695a5]" />

                    <input
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      placeholder="Enter your full name"
                      maxLength={80}
                      className={`${inputClass} pl-12`}
                    />
                  </div>
                </div>

                <div>
                  <label className="mb-2 block text-sm text-[#a9c3d0]">
                    Phone Number *
                  </label>

                  <div className="relative">
                    <Phone className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-[#7695a5]" />

                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      placeholder="+91 98765 43210"
                      maxLength={20}
                      className={`${inputClass} pl-12`}
                    />
                  </div>
                </div>

                <div className="md:col-span-2">
                  <label className="mb-2 block text-sm text-[#a9c3d0]">
                    Email Address
                  </label>

                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-[#7695a5]" />

                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      placeholder="your@email.com"
                      className={`${inputClass} pl-12`}
                    />
                  </div>
                </div>
              </div>

              <div className="flex justify-end pt-6">
                <button
                  type="button"
                  className={primaryButton}
                  disabled={
                    !formData.name.trim() ||
                    !/^[0-9+\-()\s]{7,20}$/.test(formData.phone.trim())
                  }
                  onClick={() => goToStep(2)}
                >
                  Next: Select Vehicle
                  <ChevronRight className="h-5 w-5" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 2: VEHICLE */}

          {step === 2 && (
            <div className="space-y-6">
              <h2 className="text-xl font-bold">
                Select Your Vehicle
              </h2>

              {loadingVehicles && (
                <p className="flex items-center gap-2 text-[#a9c3d0]">
                  <Loader2 className="h-5 w-5 animate-spin" />
                  Loading vehicles...
                </p>
              )}

              <div className="grid gap-6 md:grid-cols-2">
                <div>
                  <label className="mb-2 block text-sm text-[#a9c3d0]">
                    Brand *
                  </label>

                  <select
                    name="brand"
                    value={formData.brand}
                    onChange={handleInputChange}
                    className={inputClass}
                  >
                    <option value="">Select a brand</option>

                    {availableBrands.map(brand => (
                      <option key={brand.id} value={brand.id}>
                        {brand.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="mb-2 block text-sm text-[#a9c3d0]">
                    Model *
                  </label>

                  <select
                    name="vehicle"
                    value={formData.vehicle}
                    onChange={handleInputChange}
                    disabled={!formData.brand}
                    className={`${inputClass} disabled:opacity-50`}
                  >
                    <option value="">Select a model</option>

                    {availableVehicles.map(vehicle => (
                      <option key={vehicle.id} value={vehicle.id}>
                        {vehicle.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {selectedVehicle && selectedBrand && (
                <div className={panelClass}>
                  <div className="flex flex-col items-start gap-5 sm:flex-row">

                    <div className="flex h-28 w-28 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-[#09243b]">
                      {selectedVehicle.image && !imageFailed ? (
                        <img
                          src={assetSrc(selectedVehicle.image)}
                          alt={selectedVehicle.name}
                          onError={() => setImageFailed(true)}
                          className="h-full w-full object-contain"
                        />
                      ) : (
                        <Car className="h-12 w-12 text-[#7695a5]" />
                      )}
                    </div>

                    <div className="flex-1">
                      <h3 className="text-lg font-semibold">
                        {selectedVehicle.name}
                      </h3>

                      <p className="text-[#a9c3d0]">
                        {selectedBrand.name}
                      </p>

                      <p className="mt-2 font-semibold text-[#67d7df]">
                        {selectedVehicle.price}
                      </p>
                    </div>

                    <div className="rounded-xl bg-[#09243b] p-4">
                      <p className="text-xs text-[#7695a5]">
                        Booking Fee
                      </p>

                      <p className={`text-xl font-bold ${
                        isFree ? 'text-green-400' : 'text-[#67d7df]'
                      }`}>
                        {displayFee}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {!loadingVehicles && vehicles.length === 0 && (
                <div className={panelClass}>
                  <p className="text-[#a9c3d0]">
                    No vehicles are currently available.
                    Please check the backend connection.
                  </p>
                </div>
              )}

              <div className="flex justify-between gap-3 pt-6">
                <button
                  type="button"
                  className={backButton}
                  onClick={() => goToStep(1)}
                >
                  Back
                </button>

                <button
                  type="button"
                  className={primaryButton}
                  disabled={!selectedVehicle}
                  onClick={() => goToStep(3)}
                >
                  Next: Select Showroom
                  <ChevronRight className="h-5 w-5" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 3: DEALER AND TIME */}

          {step === 3 && (
            <div className="space-y-6">
              <h2 className="text-xl font-bold">
                Select Showroom & Time
              </h2>

              <BookingShowroomSelect
                companyId={selectedVehicle?.companyId || ''}
                value={formData.dealer}
                onChange={showroomId => setFormData(previous => ({
                  ...previous,
                  dealer: showroomId,
                  date: '',
                  time: ''
                }))}
                disabled={loadingShowrooms}
              />

              <div className="grid gap-6 md:grid-cols-2">
                <div>
                  <label className="mb-2 block text-sm text-[#a9c3d0]">
                    Preferred Date *
                  </label>

                  <div className="relative">
                    <Calendar className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-[#7695a5]" />

                    <input
                      type="date"
                      name="date"
                      value={formData.date}
                      onChange={handleInputChange}
                      min={todayInIndia()}
                      className={`${inputClass} pl-12`}
                    />
                  </div>
                </div>

                <div>
                  <label className="mb-2 block text-sm text-[#a9c3d0]">
                    Preferred Time *
                  </label>

                  <div className="relative">
                    <Clock className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-[#7695a5]" />

                    <select
                      name="time"
                      value={formData.time}
                      onChange={handleInputChange}
                      disabled={
                        loadingSlots ||
                        !formData.date ||
                        Boolean(slotError)
                      }
                      className={`${inputClass} pl-12 disabled:opacity-50`}
                    >
                      <option value="">
                        {loadingSlots
                          ? 'Checking availability...'
                          : 'Select a time slot'}
                      </option>

                      {slots.map(slot => (
                        <option
                          key={slot.time}
                          value={slot.time}
                          disabled={!slot.available}
                        >
                          {slot.time}
                          {!slot.available ? ' — Unavailable' : ''}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              {slotError && (
                <p role="alert" className="text-sm text-red-300">
                  {slotError}
                </p>
              )}

              {!loadingSlots &&
                formData.date &&
                !slotError &&
                slots.every(slot => !slot.available) && (
                  <p className="text-sm text-amber-300">
                    No available time slots for this date.
                    Please choose another date.
                  </p>
                )}

              <div>
                <label className="mb-2 block text-sm text-[#a9c3d0]">
                  Additional Notes
                </label>

                <div className="relative">
                  <MessageSquare className="absolute left-4 top-4 h-5 w-5 text-[#7695a5]" />

                  <textarea
                    name="notes"
                    value={formData.notes}
                    onChange={handleInputChange}
                    maxLength={1000}
                    rows={4}
                    placeholder="Any specific requirements..."
                    className={`${inputClass} resize-none pl-12`}
                  />
                </div>
              </div>

              <div className="flex justify-between gap-3 pt-6">
                <button
                  type="button"
                  className={backButton}
                  onClick={() => goToStep(2)}
                >
                  Back
                </button>

                <button
                  type="button"
                  className={primaryButton}
                  disabled={
                    !selectedDealer ||
                    loadingShowrooms ||
                    !formData.date ||
                    loadingSlots ||
                    Boolean(slotError) ||
                    !slots.some(
                      slot =>
                        slot.time === formData.time &&
                        slot.available
                    )
                  }
                  onClick={() => goToStep(4)}
                >
                  Next: Payment
                  <ChevronRight className="h-5 w-5" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 4: PAYMENT INFORMATION */}

          {step === 4 && (
            <div className="space-y-6">
              <h2 className="text-xl font-bold">
                Payment Information
              </h2>

              <div className={`rounded-2xl border-2 p-6 ${
                isFree
                  ? 'border-green-500/40 bg-green-500/10'
                  : 'border-[#07549a]/50 bg-[#07549a]/10'
              }`}>
                <div className="flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <Wallet className="h-8 w-8 text-[#67d7df]" />

                    <div>
                      <p className="text-sm text-[#a9c3d0]">
                        Booking Fee
                      </p>

                      <p className="font-semibold">
                        {selectedVehicle?.name}
                      </p>
                    </div>
                  </div>

                  <p className={`text-3xl font-bold ${
                    isFree ? 'text-green-400' : 'text-[#67d7df]'
                  }`}>
                    {displayFee}
                  </p>
                </div>

                <p className="mt-4 text-sm text-[#a9c3d0]">
                  {getBookingFeeNote()}
                </p>
              </div>

              {!isFree && (
                <div className="space-y-4">
                  <h3 className="font-semibold">
                    Preferred Payment Method
                  </h3>

                  <p className="text-sm text-amber-300">
                    Online payment integration is not active yet.
                    Selecting a payment method will not charge you.
                    Your booking request will be saved with payment
                    status Pending.
                  </p>

                  {([
                    {
                      id: 'upi',
                      name: 'UPI',
                      icon: Wallet
                    },
                    {
                      id: 'card',
                      name: 'Credit / Debit Card',
                      icon: CreditCard
                    },
                    {
                      id: 'netbanking',
                      name: 'Net Banking',
                      icon: Lock
                    }
                  ] as const).map(method => {
                    const Icon = method.icon;

                    return (
                      <label
                        key={method.id}
                        className={`flex cursor-pointer items-center gap-4 rounded-xl border p-4 ${
                          paymentMethod === method.id
                            ? 'border-[#16a7b7] bg-[#07549a]/20'
                            : 'border-[#285673] bg-[#103a58]'
                        }`}
                      >
                        <input
                          type="radio"
                          checked={paymentMethod === method.id}
                          onChange={() => setPaymentMethod(method.id)}
                          className="accent-cyan-500"
                        />

                        <Icon className="h-5 w-5 text-[#67d7df]" />

                        <span>{method.name}</span>
                      </label>
                    );
                  })}
                </div>
              )}

              <div className="flex justify-between gap-3 pt-6">
                <button
                  type="button"
                  className={backButton}
                  onClick={() => goToStep(3)}
                >
                  Back
                </button>

                <button
                  type="button"
                  className={primaryButton}
                  onClick={() => goToStep(5)}
                >
                  Review Booking
                  <ChevronRight className="h-5 w-5" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 5: REVIEW AND CONFIRM */}

          {step === 5 && (
            <div className="space-y-6">
              <h2 className="text-xl font-bold">
                Review Your Booking
              </h2>

              <div className="space-y-4">

                <div className={panelClass}>
                  <h3 className="mb-4 flex items-center gap-2 font-semibold">
                    <User className="h-5 w-5 text-[#67d7df]" />
                    Personal Information
                  </h3>

                  <div className="grid gap-4 md:grid-cols-2">
                    <div>
                      <p className="text-sm text-[#7695a5]">Name</p>
                      <p>{formData.name}</p>
                    </div>

                    <div>
                      <p className="text-sm text-[#7695a5]">Phone</p>
                      <p>{formData.phone}</p>
                    </div>

                    <div className="md:col-span-2">
                      <p className="text-sm text-[#7695a5]">Email</p>
                      <p>{user?.email || formData.email || 'Not provided'}</p>
                    </div>
                  </div>
                </div>

                <div className={panelClass}>
                  <h3 className="mb-4 flex items-center gap-2 font-semibold">
                    <Car className="h-5 w-5 text-[#67d7df]" />
                    Vehicle
                  </h3>

                  <p className="text-lg font-semibold">
                    {selectedBrand?.name} {selectedVehicle?.name}
                  </p>

                  <p className="mt-2 text-[#67d7df]">
                    {selectedVehicle?.price}
                  </p>
                </div>

                <div className={panelClass}>
                  <h3 className="mb-4 flex items-center gap-2 font-semibold">
                    <MapPin className="h-5 w-5 text-[#67d7df]" />
                    Showroom and Appointment
                  </h3>

                  <div className="space-y-3">
                    <div>
                      <p className="text-sm text-[#7695a5]">
                        Showroom
                      </p>

                      <p>{selectedDealer?.name}</p>

                      <p className="text-sm text-[#a9c3d0]">
                        {selectedDealer ? `${selectedDealer.address}, ${selectedDealer.city}, ${selectedDealer.state}` : ''}
                      </p>
                    </div>

                    <div>
                      <p className="text-sm text-[#7695a5]">
                        Appointment
                      </p>

                      <p>
                        {formData.date} at {formData.time}
                      </p>
                    </div>
                  </div>

                  {formData.notes && (
                    <div className="mt-4 border-t border-[#285673] pt-4">
                      <p className="text-sm text-[#7695a5]">
                        Notes
                      </p>

                      <p className="mt-2">{formData.notes}</p>
                    </div>
                  )}
                </div>

                <div className={panelClass}>
                  <h3 className="mb-4 flex items-center gap-2 font-semibold">
                    <Wallet className="h-5 w-5 text-[#67d7df]" />
                    Payment Summary
                  </h3>

                  <div className="flex items-center justify-between gap-4">
                    <div>
                      <p className="text-[#a9c3d0]">
                        Booking Fee
                      </p>

                      <p className="text-sm text-[#7695a5]">
                        {isFree
                          ? 'No payment required'
                          : 'Payment pending — no charge made'}
                      </p>
                    </div>

                    <p className={`text-2xl font-bold ${
                      isFree ? 'text-green-400' : 'text-[#67d7df]'
                    }`}>
                      {displayFee}
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex justify-between gap-3 pt-6">
                <button
                  type="button"
                  className={backButton}
                  onClick={() => goToStep(4)}
                  disabled={submitting}
                >
                  Back
                </button>

                <button
                  type="submit"
                  disabled={
                    submitting ||
                    authLoading ||
                    !user ||
                    user.role !== 'CUSTOMER'
                  }
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-green-600 px-7 py-3.5 font-semibold text-white hover:bg-green-700 disabled:opacity-50"
                >
                  {submitting ? (
                    <Loader2 className="h-5 w-5 animate-spin" />
                  ) : (
                    <Send className="h-5 w-5" />
                  )}

                  {submitting
                    ? 'Saving Booking...'
                    : 'Submit Booking Request'}
                </button>
              </div>
            </div>
          )}

        </form>
      </section>
    </div>
  );
}
