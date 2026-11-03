import { useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { gsap } from 'gsap';
import { 
  ArrowLeft, 
  Car, 
  Bike, 
  Fuel, 
  Gauge, 
  Settings,
  Calendar,
  MapPin,
  Phone,
  Check,
  ChevronRight,
  Star,
  Share2,
  Heart,
  Wallet
} from 'lucide-react';
import { getBrandById, getVehicleById } from '../data/vehicles';
import { getDealersByBrand } from '../data/dealers';
import { getBookingFee, getBookingFeeNote, type BookingFee } from '../utils/bookingFee';

const VehiclePage = () => {
  const { brandId, vehicleId } = useParams<{ brandId: string; vehicleId: string }>();
  const brand = getBrandById(brandId || '');
  const vehicle = getVehicleById(brandId || '', vehicleId || '');
  const dealers = getDealersByBrand(brandId || '');

  useEffect(() => {
    window.scrollTo(0, 0);

    gsap.fromTo(
      '.vehicle-hero',
      { opacity: 0, y: 30 },
      { opacity: 1, y: 0, duration: 0.6, ease: 'power3.out' }
    );
    gsap.fromTo(
      '.spec-card',
      { opacity: 0, y: 20 },
      { opacity: 1, y: 0, duration: 0.5, stagger: 0.08, ease: 'power3.out', delay: 0.3 }
    );
    gsap.fromTo(
      '.dealer-card',
      { opacity: 0, x: 20 },
      { opacity: 1, x: 0, duration: 0.5, stagger: 0.1, ease: 'power3.out', delay: 0.5 }
    );
    gsap.fromTo(
      '.booking-fee-card',
      { opacity: 0, y: 20 },
      { opacity: 1, y: 0, duration: 0.5, ease: 'power3.out', delay: 0.4 }
    );
  }, [brandId, vehicleId]);

  if (!brand || !vehicle) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#09243b]">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-[#f8fafc] mb-4">Vehicle Not Found</h1>
          <p className="text-[#a9c3d0] mb-6">The vehicle you are looking for does not exist.</p>
          <Link
            to={`/brand/${brandId}`}
            className="inline-flex items-center gap-2 px-6 py-3 bg-[#07549a] rounded-full text-white font-semibold"
          >
            <ArrowLeft className="w-5 h-5" />
            Back to Brand
          </Link>
        </div>
      </div>
    );
  }

  const bookingFee: BookingFee = getBookingFee(vehicle.category, vehicle.price);

  const specs = [
    { label: 'Engine', value: vehicle.engine, icon: Settings },
    { label: 'Power', value: vehicle.power, icon: Gauge },
    { label: 'Mileage/Range', value: vehicle.mileage, icon: Fuel },
    { label: 'Type', value: vehicle.type, icon: vehicle.category === 'car' ? Car : Bike },
  ].filter(spec => spec.value);

  return (
    <div className="min-h-screen bg-[#09243b] pt-20">
      {/* Breadcrumb */}
      <div className="w-full px-4 sm:px-6 lg:px-8 xl:px-12 py-4 border-b border-[#103a58]">
        <div className="flex items-center gap-2 text-sm">
          <Link to="/" className="text-[#7695a5] hover:text-[#07549a] transition-colors">Home</Link>
          <ChevronRight className="w-4 h-4 text-[#3c6b85]" />
          <Link to={`/brand/${brand.id}`} className="text-[#7695a5] hover:text-[#07549a] transition-colors">
            {brand.name}
          </Link>
          <ChevronRight className="w-4 h-4 text-[#3c6b85]" />
          <span className="text-[#f8fafc]">{vehicle.name}</span>
        </div>
      </div>

      {/* Vehicle Hero */}
      <section className="vehicle-hero py-8 lg:py-12">
        <div className="w-full px-4 sm:px-6 lg:px-8 xl:px-12">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
            {/* Image */}
            <div className="relative rounded-3xl overflow-hidden bg-[#103a58]">
              <div className="aspect-[4/3] lg:aspect-square">
                <img
                  src={vehicle.image}
                  alt={vehicle.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="absolute inset-0 bg-gradient-to-t from-[#09243b]/60 via-transparent to-transparent" />
              
              {/* Badges */}
              <div className="absolute top-6 left-6 flex flex-wrap gap-2">
                <span className={`px-4 py-1.5 rounded-full text-sm font-semibold ${
                  vehicle.category === 'car'
                    ? 'bg-blue-500/90 text-white'
                    : 'bg-orange-500/90 text-white'
                }`}>
                  {vehicle.category === 'car' ? 'Car' : 'Bike'}
                </span>
                <span className="px-4 py-1.5 rounded-full bg-[#103a58]/90 text-[#f8fafc] text-sm font-medium">
                  {vehicle.type}
                </span>
              </div>

              {vehicle.featured && (
                <div className="absolute top-6 right-6">
                  <span className="px-4 py-1.5 rounded-full bg-[#16a7b7] text-white text-sm font-semibold flex items-center gap-1">
                    <Star className="w-4 h-4" />
                    Featured
                  </span>
                </div>
              )}

              {/* Action Buttons */}
              <div className="absolute bottom-6 right-6 flex gap-2">
                <button className="w-10 h-10 rounded-full bg-[#103a58]/90 flex items-center justify-center text-[#f8fafc] hover:bg-[#07549a] transition-colors">
                  <Share2 className="w-5 h-5" />
                </button>
                <button className="w-10 h-10 rounded-full bg-[#103a58]/90 flex items-center justify-center text-[#f8fafc] hover:bg-[#16a7b7] transition-colors">
                  <Heart className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Info */}
            <div className="flex flex-col">
              <div className="flex items-center gap-3 mb-4">
                <img
                  src={brand.logo}
                  alt={brand.name}
                  className="w-10 h-10 object-contain bg-white rounded-lg p-1"
                />
                <span className="text-[#a9c3d0]">{brand.name}</span>
              </div>

              <h1 className="text-3xl lg:text-4xl xl:text-5xl font-bold font-['Exo_2'] text-[#f8fafc] mb-4">
                {vehicle.name}
              </h1>

              <p className="text-[#a9c3d0] text-lg mb-6 leading-relaxed">
                {vehicle.description}
              </p>

              {/* Ex-showroom Price */}
              <div className="mb-4">
                <span className="text-[#7695a5] text-sm">Ex-Showroom Price</span>
                <div className="text-3xl lg:text-4xl font-bold text-[#16a7b7]">
                  {vehicle.price}
                </div>
              </div>

              {/* Booking Fee Card */}
              <div className={`booking-fee-card p-5 rounded-2xl border-2 mb-6 ${
                bookingFee.isFree 
                  ? 'bg-[#22c55e]/10 border-[#22c55e]/50' 
                  : 'bg-[#07549a]/10 border-[#07549a]/50'
              }`}>
                <div className="flex items-center gap-3 mb-3">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                    bookingFee.isFree ? 'bg-[#22c55e]/20' : 'bg-[#07549a]/20'
                  }`}>
                    <Wallet className={`w-5 h-5 ${bookingFee.isFree ? 'text-[#22c55e]' : 'text-[#07549a]'}`} />
                  </div>
                  <div>
                    <span className="text-[#7695a5] text-sm">Booking Fee</span>
                    <div className={`text-2xl font-bold ${
                      bookingFee.isFree ? 'text-[#22c55e]' : 'text-[#07549a]'
                    }`}>
                      {bookingFee.isFree ? 'FREE' : bookingFee.displayText}
                    </div>
                  </div>
                </div>
                <p className={`text-sm ${bookingFee.isFree ? 'text-[#22c55e]/80' : 'text-[#07549a]/80'}`}>
                  {bookingFee.isFree 
                    ? 'FREE Booking â€“ No Convenience Charge' 
                    : `Booking Fee: ${bookingFee.displayText}`}
                </p>
                <p className="text-[#7695a5] text-xs mt-2">
                  {getBookingFeeNote()}
                </p>
              </div>

              {/* Quick Specs */}
              <div className="grid grid-cols-2 gap-4 mb-8">
                {specs.map((spec, index) => (
                  <div
                    key={index}
                    className="spec-card p-4 rounded-xl bg-[#103a58] border border-[#285673]/50"
                  >
                    <div className="flex items-center gap-2 mb-2">
                      <spec.icon className="w-5 h-5 text-[#07549a]" />
                      <span className="text-[#7695a5] text-sm">{spec.label}</span>
                    </div>
                    <span className="text-[#f8fafc] font-semibold">{spec.value}</span>
                  </div>
                ))}
              </div>

              {/* CTA Buttons */}
              <div className="flex flex-wrap gap-4 mt-auto">
                <Link
                  to="/booking"
                  className="flex-1 min-w-[200px] inline-flex items-center justify-center gap-2 px-8 py-4 bg-gradient-to-r from-[#07549a] to-[#06457c] rounded-full text-white font-semibold shadow-lg shadow-blue-500/30 hover:shadow-blue-500/50 transition-all duration-300"
                >
                  <Calendar className="w-5 h-5" />
                  Book Test Ride
                </Link>
                <a
                  href={`tel:+914412345678`}
                  className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-full border-2 border-[#285673] text-[#f8fafc] font-semibold hover:border-[#07549a] hover:text-[#07549a] transition-all duration-300"
                >
                  <Phone className="w-5 h-5" />
                  Call Dealer
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Specifications Section */}
      <section className="py-12 border-t border-[#103a58]">
        <div className="w-full px-4 sm:px-6 lg:px-8 xl:px-12">
          <h2 className="text-2xl font-bold text-[#f8fafc] mb-8">Key Specifications</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {specs.map((spec, index) => (
              <div
                key={index}
                className="spec-card p-6 rounded-2xl bg-[#103a58] border border-[#285673]/50 hover:border-[#07549a]/50 transition-all duration-300"
              >
                <div className="w-12 h-12 rounded-xl bg-[#07549a]/10 flex items-center justify-center mb-4">
                  <spec.icon className="w-6 h-6 text-[#07549a]" />
                </div>
                <span className="text-[#7695a5] text-sm block mb-1">{spec.label}</span>
                <span className="text-[#f8fafc] font-semibold text-lg">{spec.value}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Booking Fee Info Section */}
      <section className="py-12 border-t border-[#103a58]">
        <div className="w-full px-4 sm:px-6 lg:px-8 xl:px-12">
          <h2 className="text-2xl font-bold text-[#f8fafc] mb-6">Booking Fee Details</h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Current Vehicle Fee */}
            <div className={`p-6 rounded-2xl border-2 ${
              bookingFee.isFree 
                ? 'bg-[#22c55e]/5 border-[#22c55e]/30' 
                : 'bg-[#07549a]/5 border-[#07549a]/30'
            }`}>
              <div className="flex items-center justify-between mb-4">
                <span className="text-[#a9c3d0]">{vehicle.name} Booking Fee</span>
                <span className={`text-3xl font-bold ${
                  bookingFee.isFree ? 'text-[#22c55e]' : 'text-[#07549a]'
                }`}>
                  {bookingFee.displayText}
                </span>
              </div>
              <p className="text-[#7695a5] text-sm mb-4">
                Based on ex-showroom price of {vehicle.price}
              </p>
              <div className="p-4 rounded-xl bg-[#09243b]/50">
                <p className="text-[#a9c3d0] text-sm">
                  {getBookingFeeNote()}
                </p>
              </div>
            </div>

            {/* Fee Structure */}
            <div className="p-6 rounded-2xl bg-[#103a58] border border-[#285673]/50">
              <h3 className="text-[#f8fafc] font-semibold mb-4">
                {vehicle.category === 'bike' ? 'Bike' : 'Car'} Booking Fee Structure
              </h3>
              <div className="space-y-3">
                {vehicle.category === 'bike' ? (
                  <>
                    <div className="flex items-center justify-between py-2 border-b border-[#285673]/30">
                      <span className="text-[#a9c3d0] text-sm">Below â‚¹1.5 Lakhs</span>
                      <span className="text-[#22c55e] font-semibold">FREE</span>
                    </div>
                    <div className="flex items-center justify-between py-2 border-b border-[#285673]/30">
                      <span className="text-[#a9c3d0] text-sm">â‚¹1.5L - â‚¹3 Lakhs</span>
                      <span className="text-[#07549a] font-semibold">â‚¹99</span>
                    </div>
                    <div className="flex items-center justify-between py-2 border-b border-[#285673]/30">
                      <span className="text-[#a9c3d0] text-sm">â‚¹3L - â‚¹8 Lakhs</span>
                      <span className="text-[#07549a] font-semibold">â‚¹299</span>
                    </div>
                    <div className="flex items-center justify-between py-2">
                      <span className="text-[#a9c3d0] text-sm">Above â‚¹8 Lakhs</span>
                      <span className="text-[#07549a] font-semibold">â‚¹599</span>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="flex items-center justify-between py-2 border-b border-[#285673]/30">
                      <span className="text-[#a9c3d0] text-sm">Below â‚¹6 Lakhs</span>
                      <span className="text-[#22c55e] font-semibold">FREE</span>
                    </div>
                    <div className="flex items-center justify-between py-2 border-b border-[#285673]/30">
                      <span className="text-[#a9c3d0] text-sm">â‚¹6L - â‚¹15 Lakhs</span>
                      <span className="text-[#07549a] font-semibold">â‚¹299</span>
                    </div>
                    <div className="flex items-center justify-between py-2 border-b border-[#285673]/30">
                      <span className="text-[#a9c3d0] text-sm">â‚¹15L - â‚¹50 Lakhs</span>
                      <span className="text-[#07549a] font-semibold">â‚¹699</span>
                    </div>
                    <div className="flex items-center justify-between py-2">
                      <span className="text-[#a9c3d0] text-sm">Above â‚¹50 Lakhs</span>
                      <span className="text-[#07549a] font-semibold">â‚¹1,499</span>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Available Dealers Section */}
      {dealers.length > 0 && (
        <section className="py-12 border-t border-[#103a58]">
          <div className="w-full px-4 sm:px-6 lg:px-8 xl:px-12">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="text-2xl font-bold text-[#f8fafc] mb-2">Available Dealers</h2>
                <p className="text-[#a9c3d0]">
                  Visit these authorized {brand.name} dealers in Chennai for a test ride.
                </p>
              </div>
              <Link
                to="/dealers"
                className="hidden sm:flex items-center gap-2 text-[#07549a] font-medium hover:text-[#16a7b7] transition-colors"
              >
                View All Dealers
                <ChevronRight className="w-5 h-5" />
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {dealers.slice(0, 6).map((dealer) => (
                <div
                  key={dealer.id}
                  className="dealer-card p-6 rounded-2xl bg-[#103a58] border border-[#285673]/50 hover:border-[#07549a]/50 transition-all duration-300"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="text-[#f8fafc] font-semibold mb-1">{dealer.name}</h3>
                      <div className="flex items-center gap-1 text-[#7695a5] text-sm">
                        <MapPin className="w-4 h-4" />
                        {dealer.area}
                      </div>
                    </div>
                    <div className="w-10 h-10 rounded-full bg-[#07549a]/10 flex items-center justify-center">
                      <MapPin className="w-5 h-5 text-[#07549a]" />
                    </div>
                  </div>

                  <p className="text-[#a9c3d0] text-sm mb-4 line-clamp-2">
                    {dealer.address}
                  </p>

                  <div className="flex flex-wrap gap-2 mb-4">
                    {dealer.services.slice(0, 3).map((service, idx) => (
                      <span
                        key={idx}
                        className="px-2 py-1 rounded-full bg-[#09243b] text-[#a9c3d0] text-xs"
                      >
                        {service}
                      </span>
                    ))}
                  </div>

                  <div className="flex items-center gap-3 pt-4 border-t border-[#285673]/50">
                    <a
                      href={`tel:${dealer.phone}`}
                      className="flex-1 inline-flex items-center justify-center gap-2 py-2.5 rounded-lg bg-[#07549a]/10 text-[#07549a] text-sm font-medium hover:bg-[#07549a] hover:text-white transition-colors"
                    >
                      <Phone className="w-4 h-4" />
                      Call
                    </a>
                    <Link
                      to="/booking"
                      className="flex-1 inline-flex items-center justify-center gap-2 py-2.5 rounded-lg bg-[#16a7b7]/10 text-[#16a7b7] text-sm font-medium hover:bg-[#16a7b7] hover:text-white transition-colors"
                    >
                      <Calendar className="w-4 h-4" />
                      Book
                    </Link>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-8 text-center sm:hidden">
              <Link
                to="/dealers"
                className="inline-flex items-center gap-2 text-[#07549a] font-medium"
              >
                View All Dealers
                <ChevronRight className="w-5 h-5" />
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* Why Choose This Vehicle */}
      <section className="py-12 border-t border-[#103a58]">
        <div className="w-full px-4 sm:px-6 lg:px-8 xl:px-12">
          <h2 className="text-2xl font-bold text-[#f8fafc] mb-8">Why Choose {vehicle.name}?</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { title: 'Official Dealer Network', desc: 'Test ride at authorized dealerships with factory-trained staff.' },
              { title: 'Genuine Experience', desc: 'Experience the vehicle in real-world conditions before purchase.' },
              { title: 'Expert Guidance', desc: 'Get detailed information and answers from brand specialists.' },
              { title: 'No Obligation', desc: 'Free test rides with no pressure to buy.' },
              { title: 'Compare Options', desc: 'Test multiple vehicles to find your perfect match.' },
              { title: 'Best Deals', desc: 'Get exclusive offers when you book through our platform.' },
            ].map((item, index) => (
              <div
                key={index}
                className="flex items-start gap-4 p-6 rounded-xl bg-[#103a58]/50 border border-[#285673]/30"
              >
                <div className="w-8 h-8 rounded-full bg-[#22c55e]/10 flex items-center justify-center flex-shrink-0">
                  <Check className="w-4 h-4 text-[#22c55e]" />
                </div>
                <div>
                  <h3 className="text-[#f8fafc] font-semibold mb-1">{item.title}</h3>
                  <p className="text-[#a9c3d0] text-sm">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16">
        <div className="w-full px-4 sm:px-6 lg:px-8 xl:px-12">
          <div className="relative rounded-3xl overflow-hidden bg-gradient-to-r from-[#16a7b7] to-[#118894] p-8 lg:p-12">
            <div className="absolute inset-0 opacity-20">
              <div className="absolute inset-0" style={{
                backgroundImage: `radial-gradient(circle at 2px 2px, white 1px, transparent 0)`,
                backgroundSize: '30px 30px'
              }} />
            </div>
            <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
              <div>
                <h2 className="text-2xl lg:text-3xl font-bold text-white mb-2">
                  Ready to experience the {vehicle.name}?
                </h2>
                <p className="text-orange-100">
                  Book your test ride today and feel the difference.
                </p>
              </div>
              <Link
                to="/booking"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white text-[#16a7b7] rounded-full font-semibold hover:bg-orange-50 transition-colors"
              >
                <Calendar className="w-5 h-5" />
                Book Test Ride Now
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default VehiclePage;
