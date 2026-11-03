import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { gsap } from 'gsap';
import { 
  ArrowLeft, 
  Car, 
  Bike, 
  ChevronRight, 
  Fuel, 
  Gauge, 
  Settings,
  Filter,
  Search
} from 'lucide-react';
import { getBrandById, type Vehicle } from '../data/vehicles';

const BrandPage = () => {
  const { brandId } = useParams<{ brandId: string }>();
  const brand = getBrandById(brandId || '');
  const [filter, setFilter] = useState<'all' | 'car' | 'bike'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    // Scroll to top on mount
    window.scrollTo(0, 0);

    // Animate content
    gsap.fromTo(
      '.brand-header',
      { opacity: 0, y: 30 },
      { opacity: 1, y: 0, duration: 0.6, ease: 'power3.out' }
    );
    gsap.fromTo(
      '.vehicle-card',
      { opacity: 0, y: 40 },
      { opacity: 1, y: 0, duration: 0.5, stagger: 0.08, ease: 'power3.out', delay: 0.3 }
    );
  }, [brandId]);

  if (!brand) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#09243b]">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-[#f8fafc] mb-4">Brand Not Found</h1>
          <p className="text-[#a9c3d0] mb-6">The brand you are looking for does not exist.</p>
          <Link
            to="/"
            className="inline-flex items-center gap-2 px-6 py-3 bg-[#07549a] rounded-full text-white font-semibold"
          >
            <ArrowLeft className="w-5 h-5" />
            Back to Home
          </Link>
        </div>
      </div>
    );
  }

  const filteredVehicles = brand.vehicles.filter((vehicle: Vehicle) => {
    const matchesFilter = filter === 'all' || vehicle.category === filter;
    const matchesSearch = vehicle.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         vehicle.type.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const carCount = brand.vehicles.filter((v: Vehicle) => v.category === 'car').length;
  const bikeCount = brand.vehicles.filter((v: Vehicle) => v.category === 'bike').length;

  return (
    <div className="min-h-screen bg-[#09243b] pt-20">
      {/* Brand Header */}
      <section className="brand-header relative py-16 lg:py-24 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-[#103a58] to-[#09243b]" />
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: `radial-gradient(circle at 2px 2px, #07549a 1px, transparent 0)`,
            backgroundSize: '40px 40px'
          }} />
        </div>

        <div className="relative z-10 w-full px-4 sm:px-6 lg:px-8 xl:px-12">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-[#a9c3d0] hover:text-[#07549a] transition-colors mb-8"
          >
            <ArrowLeft className="w-5 h-5" />
            Back to Brands
          </Link>

          <div className="flex flex-col lg:flex-row lg:items-center gap-8">
            <div className="w-32 h-32 lg:w-40 lg:h-40 rounded-2xl bg-white p-6 flex items-center justify-center flex-shrink-0">
              <img
                src={brand.logo}
                alt={brand.name}
                className="w-full h-full object-contain"
              />
            </div>
            <div className="flex-1">
              <div className="flex flex-wrap items-center gap-4 mb-4">
                <h1 className="text-4xl lg:text-5xl font-bold font-['Exo_2'] text-[#f8fafc]">
                  {brand.name}
                </h1>
                <span className={`px-4 py-1.5 rounded-full text-sm font-medium ${
                  brand.category === 'car' 
                    ? 'bg-blue-500/20 text-blue-400' 
                    : brand.category === 'bike'
                    ? 'bg-orange-500/20 text-orange-400'
                    : 'bg-purple-500/20 text-purple-400'
                }`}>
                  {brand.category === 'both' ? 'Cars & Bikes' : brand.category === 'car' ? 'Cars' : 'Motorcycles'}
                </span>
              </div>
              <p className="text-lg text-[#a9c3d0] max-w-2xl mb-6">
                {brand.description}
              </p>
              <div className="flex flex-wrap gap-6">
                <div className="flex items-center gap-2">
                  <Car className="w-5 h-5 text-[#07549a]" />
                  <span className="text-[#f8fafc]">{carCount}</span>
                  <span className="text-[#a9c3d0]">Cars</span>
                </div>
                <div className="flex items-center gap-2">
                  <Bike className="w-5 h-5 text-[#16a7b7]" />
                  <span className="text-[#f8fafc]">{bikeCount}</span>
                  <span className="text-[#a9c3d0]">Bikes</span>
                </div>
                <div className="flex items-center gap-2">
                  <Settings className="w-5 h-5 text-[#22c55e]" />
                  <span className="text-[#f8fafc]">{brand.vehicles.length}</span>
                  <span className="text-[#a9c3d0]">Models</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Filter & Search Section */}
      <section className="py-8 border-b border-[#103a58] bg-[#09243b]/95 backdrop-blur sticky top-16 z-30">
        <div className="w-full px-4 sm:px-6 lg:px-8 xl:px-12">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            {/* Filter Tabs */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => setFilter('all')}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                  filter === 'all'
                    ? 'bg-[#07549a] text-white'
                    : 'bg-[#103a58] text-[#a9c3d0] hover:text-[#f8fafc]'
                }`}
              >
                All Models
              </button>
              <button
                onClick={() => setFilter('car')}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all flex items-center gap-2 ${
                  filter === 'car'
                    ? 'bg-[#07549a] text-white'
                    : 'bg-[#103a58] text-[#a9c3d0] hover:text-[#f8fafc]'
                }`}
              >
                <Car className="w-4 h-4" />
                Cars
              </button>
              <button
                onClick={() => setFilter('bike')}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all flex items-center gap-2 ${
                  filter === 'bike'
                    ? 'bg-[#16a7b7] text-white'
                    : 'bg-[#103a58] text-[#a9c3d0] hover:text-[#f8fafc]'
                }`}
              >
                <Bike className="w-4 h-4" />
                Bikes
              </button>
            </div>

            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#7695a5]" />
              <input
                type="text"
                placeholder="Search models..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full sm:w-64 pl-10 pr-4 py-2 rounded-full bg-[#103a58] border border-[#285673] text-[#f8fafc] placeholder-[#7695a5] focus:outline-none focus:border-[#07549a] transition-colors"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Vehicles Grid */}
      <section className="py-12">
        <div className="w-full px-4 sm:px-6 lg:px-8 xl:px-12">
          {filteredVehicles.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredVehicles.map((vehicle: Vehicle) => (
                <Link
                  key={vehicle.id}
                  to={`/brand/${brand.id}/vehicle/${vehicle.id}`}
                  className="vehicle-card group relative rounded-2xl overflow-hidden bg-[#103a58] border border-[#285673]/50 hover:border-[#07549a]/50 transition-all duration-300 hover:shadow-lg hover:shadow-[#07549a]/10"
                >
                  {/* Image */}
                  <div className="aspect-[4/3] overflow-hidden relative">
                    <img
                      src={vehicle.image}
                      alt={vehicle.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#09243b] via-transparent to-transparent" />
                    
                    {/* Category Badge */}
                    <div className="absolute top-4 left-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        vehicle.category === 'car'
                          ? 'bg-blue-500/80 text-white'
                          : 'bg-orange-500/80 text-white'
                      }`}>
                        {vehicle.category === 'car' ? 'Car' : 'Bike'}
                      </span>
                    </div>

                    {/* Featured Badge */}
                    {vehicle.featured && (
                      <div className="absolute top-4 right-4">
                        <span className="px-3 py-1 rounded-full bg-[#16a7b7] text-white text-xs font-semibold">
                          Featured
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Content */}
                  <div className="p-5">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-xs text-[#7695a5] uppercase tracking-wider">
                        {vehicle.type}
                      </span>
                    </div>
                    <h3 className="text-lg font-bold text-[#f8fafc] mb-2 group-hover:text-[#07549a] transition-colors">
                      {vehicle.name}
                    </h3>
                    <p className="text-[#16a7b7] font-semibold mb-4">
                      {vehicle.price}
                    </p>

                    {/* Specs */}
                    <div className="grid grid-cols-2 gap-3 pt-4 border-t border-[#285673]/50">
                      {vehicle.engine && (
                        <div className="flex items-center gap-2">
                          <Settings className="w-4 h-4 text-[#7695a5]" />
                          <span className="text-xs text-[#a9c3d0] truncate">{vehicle.engine}</span>
                        </div>
                      )}
                      {vehicle.power && (
                        <div className="flex items-center gap-2">
                          <Gauge className="w-4 h-4 text-[#7695a5]" />
                          <span className="text-xs text-[#a9c3d0]">{vehicle.power}</span>
                        </div>
                      )}
                      {vehicle.mileage && (
                        <div className="flex items-center gap-2">
                          <Fuel className="w-4 h-4 text-[#7695a5]" />
                          <span className="text-xs text-[#a9c3d0]">{vehicle.mileage}</span>
                        </div>
                      )}
                    </div>

                    {/* CTA */}
                    <div className="mt-4 flex items-center justify-between">
                      <span className="text-sm text-[#07549a] font-medium flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        View Details
                        <ChevronRight className="w-4 h-4" />
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="text-center py-20">
              <Filter className="w-16 h-16 text-[#285673] mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-[#f8fafc] mb-2">No vehicles found</h3>
              <p className="text-[#a9c3d0]">Try adjusting your filters or search query.</p>
            </div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 border-t border-[#103a58]">
        <div className="w-full px-4 sm:px-6 lg:px-8 xl:px-12">
          <div className="relative rounded-3xl overflow-hidden bg-gradient-to-r from-[#07549a] to-[#06457c] p-8 lg:p-12">
            <div className="absolute inset-0 opacity-20">
              <div className="absolute inset-0" style={{
                backgroundImage: `radial-gradient(circle at 2px 2px, white 1px, transparent 0)`,
                backgroundSize: '30px 30px'
              }} />
            </div>
            <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
              <div>
                <h2 className="text-2xl lg:text-3xl font-bold text-white mb-2">
                  Ready to test drive a {brand.name}?
                </h2>
                <p className="text-blue-100">
                  Book your test ride today and experience the {brand.name} difference.
                </p>
              </div>
              <Link
                to="/booking"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white text-[#07549a] rounded-full font-semibold hover:bg-blue-50 transition-colors"
              >
                Book Test Ride
                <ChevronRight className="w-5 h-5" />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default BrandPage;
