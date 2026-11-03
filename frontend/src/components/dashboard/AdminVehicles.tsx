import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { CarFront, Search, Loader2, AlertCircle, ExternalLink } from 'lucide-react';
import { getDatabaseVehicles, type DatabaseVehicle } from '../../services/bookingApi';
import { assetSrc } from '../../lib/api';

export default function AdminVehicles() {
  const [vehicles, setVehicles] = useState<DatabaseVehicle[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('all');

  useEffect(() => {
    let active = true;
    getDatabaseVehicles()
      .then(result => {
        if (active) setVehicles(Array.isArray(result) ? result : []);
      })
      .catch(reason => {
        if (active) setError(reason instanceof Error ? reason.message : 'Unable to load vehicles.');
      })
      .finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, []);

  const filtered = useMemo(() => {
    const term = search.toLowerCase().trim();
    return vehicles.filter(vehicle =>
      (category === 'all' || vehicle.category === category) &&
      [vehicle.brandName, vehicle.name, vehicle.type, vehicle.price]
        .some(value => String(value || '').toLowerCase().includes(term))
    );
  }, [vehicles, search, category]);

  return (
    <div className="space-y-6 text-white">
      <section className="rounded-2xl border border-[#285673] bg-[#103a58] p-6">
        <div className="flex items-center gap-3">
          <CarFront className="h-7 w-7 text-[#67d7df]" />
          <div>
            <h2 className="text-2xl font-bold">Platform Vehicles</h2>
            <p className="mt-2 text-sm text-[#a9c3d0]">Browse the trial-available vehicles published on Trial Your Dream.</p>
          </div>
        </div>
        <p className="mt-5 text-3xl font-bold">{vehicles.length}</p>
        <p className="mt-1 text-sm text-[#a9c3d0]">Trial-available vehicles</p>
        <div className="mt-6 grid gap-3 sm:grid-cols-[1fr_180px]">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#8db3c5]" />
            <input aria-label="Search vehicles" value={search} onChange={e => setSearch(e.target.value)} placeholder="Search brand or model" className="w-full rounded-xl border border-[#285673] bg-[#09243b] py-3 pl-10 pr-4 text-sm outline-none focus:border-[#16a7b7]" />
          </div>
          <select aria-label="Filter vehicle category" value={category} onChange={e => setCategory(e.target.value)} className="rounded-xl border border-[#285673] bg-[#09243b] px-4 py-3 text-sm">
            <option value="all">All categories</option>
            <option value="car">Cars</option>
            <option value="bike">Bikes</option>
          </select>
        </div>
      </section>
      {loading ? (
        <div className="flex items-center justify-center gap-2 py-16 text-[#a9c3d0]"><Loader2 className="h-5 w-5 animate-spin" />Loading vehicles...</div>
      ) : error ? (
        <div role="alert" className="flex items-center gap-2 rounded-xl border border-red-400/30 bg-red-500/10 p-5 text-red-200"><AlertCircle className="h-5 w-5" />{error}</div>
      ) : filtered.length === 0 ? (
        <div className="rounded-xl border border-[#285673] bg-[#103a58] p-8 text-center text-[#a9c3d0]">No matching vehicles found.</div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {filtered.map(vehicle => (
            <article key={vehicle.id} className="overflow-hidden rounded-2xl border border-[#285673] bg-[#103a58]">
              <div className="flex h-40 items-center justify-center bg-[#09243b]">
                {vehicle.image ? <img src={assetSrc(vehicle.image)} alt={vehicle.name} className="h-full w-full object-contain" /> : <CarFront className="h-12 w-12 text-[#7695a5]" />}
              </div>
              <div className="p-5">
                <p className="text-xs font-semibold uppercase tracking-wider text-[#67d7df]">{vehicle.brandName} · {vehicle.category}</p>
                <h3 className="mt-2 text-lg font-bold">{vehicle.name}</h3>
                <p className="mt-2 text-sm text-[#a9c3d0]">{vehicle.type}</p>
                <p className="mt-3 font-semibold text-[#67d7df]">{vehicle.price}</p>
                <Link to={`/vehicles/${vehicle.id}`} className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-[#67d7df] hover:text-white">View listing <ExternalLink className="h-4 w-4" /></Link>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
