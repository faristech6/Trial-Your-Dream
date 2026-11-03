export interface Vehicle {
  id: string;
  name: string;
  category: 'car' | 'bike';
  type: string;
  price: string;
  engine?: string;
  power?: string;
  mileage?: string;
  description: string;
  image: string;
  featured?: boolean;
}

export interface Brand {
  id: string;
  name: string;
  category: 'car' | 'bike' | 'both';
  logo: string;
  description: string;
  vehicles: Vehicle[];
}

export const brands: Brand[] = [
  {
    id: 'toyota',
    name: 'Toyota',
    category: 'car',
    logo: '/images/brands/toyota.svg',
    description: 'Japanese automotive manufacturer known for reliability and innovation.',
    vehicles: [
      { id: 'toyota-corolla', name: 'Corolla', category: 'car', type: 'Sedan', price: 'â‚¹12-18 Lakh', engine: '1.8L Petrol/Hybrid', power: '140 bhp', mileage: '22-25 kmpl', description: 'World\'s best-selling sedan with exceptional reliability.', image: '/images/toyota-corolla.jpg' },
      { id: 'toyota-corolla-cross', name: 'Corolla Cross', category: 'car', type: 'SUV', price: 'â‚¹18-25 Lakh', engine: '2.0L Petrol/Hybrid', power: '169 bhp', mileage: '18-22 kmpl', description: 'Compact SUV combining Corolla reliability with versatility.', image: '/images/toyota-corolla-cross.jpg' },
      { id: 'toyota-camry', name: 'Camry', category: 'car', type: 'Sedan', price: 'â‚¹45-50 Lakh', engine: '2.5L Hybrid', power: '218 bhp', mileage: '23 kmpl', description: 'Premium hybrid sedan with luxury features.', image: '/images/toyota-camry.jpg', featured: true },
      { id: 'toyota-innova', name: 'Innova', category: 'car', type: 'MPV', price: 'â‚¹20-30 Lakh', engine: '2.4L Diesel', power: '148 bhp', mileage: '15-18 kmpl', description: 'India\'s favorite MPV for families.', image: '/images/toyota-innova.jpg', featured: true },
      { id: 'toyota-fortuner', name: 'Fortuner', category: 'car', type: 'SUV', price: 'â‚¹35-50 Lakh', engine: '2.8L Diesel', power: '201 bhp', mileage: '14-16 kmpl', description: 'Premium SUV with commanding road presence.', image: '/images/toyota-fortuner.jpg', featured: true },
      { id: 'toyota-hilux', name: 'Hilux', category: 'car', type: 'Pickup', price: 'â‚¹30-38 Lakh', engine: '2.8L Diesel', power: '201 bhp', mileage: '12-14 kmpl', description: 'Legendary pickup truck built for any terrain.', image: '/images/toyota-hilux.jpg' },
      { id: 'toyota-rav4', name: 'RAV4', category: 'car', type: 'SUV', price: 'â‚¹35-45 Lakh', engine: '2.5L Hybrid', power: '219 bhp', mileage: '20 kmpl', description: 'Compact SUV with hybrid efficiency.', image: '/images/toyota-rav4.jpg' },
      { id: 'toyota-land-cruiser', name: 'Land Cruiser', category: 'car', type: 'SUV', price: 'â‚¹2.5-3 Crore', engine: '3.3L Diesel V6', power: '304 bhp', mileage: '10-12 kmpl', description: 'Legendary off-roader with unmatched capability.', image: '/images/toyota-land-cruiser.jpg', featured: true },
      { id: 'toyota-supra', name: 'GR Supra', category: 'car', type: 'Sports', price: 'â‚¹85-95 Lakh', engine: '3.0L Turbo', power: '382 bhp', mileage: '10-12 kmpl', description: 'Iconic sports car reborn for the modern era.', image: '/images/toyota-supra.jpg', featured: true },
      { id: 'toyota-bz4x', name: 'bZ4X', category: 'car', type: 'Electric', price: 'â‚¹50-60 Lakh', engine: 'Electric', power: '215 bhp', mileage: '450 km range', description: 'Toyota\'s first dedicated electric SUV.', image: '/images/toyota-bz4x.jpg' },
      { id: 'toyota-yaris', name: 'Yaris', category: 'car', type: 'Hatchback', price: 'â‚¹9-14 Lakh', engine: '1.5L Petrol', power: '106 bhp', mileage: '18-20 kmpl', description: 'Compact hatchback with premium features.', image: '/images/toyota-yaris.jpg' },
      { id: 'toyota-highlander', name: 'Highlander', category: 'car', type: 'SUV', price: 'â‚¹55-70 Lakh', engine: '2.5L Hybrid', power: '243 bhp', mileage: '19 kmpl', description: 'Three-row SUV with hybrid powertrain.', image: '/images/toyota-highlander.jpg' },
    ]
  },
  {
    id: 'honda',
    name: 'Honda',
    category: 'both',
    logo: '/images/brands/honda.svg',
    description: 'Japanese manufacturer known for engineering excellence in cars and bikes.',
    vehicles: [
      { id: 'honda-city', name: 'City', category: 'car', type: 'Sedan', price: 'â‚¹12-18 Lakh', engine: '1.5L Petrol', power: '121 bhp', mileage: '18-24 kmpl', description: 'India\'s most loved premium sedan.', image: '/images/honda-city.jpg', featured: true },
      { id: 'honda-civic', name: 'Civic', category: 'car', type: 'Sedan', price: 'â‚¹22-28 Lakh', engine: '1.8L Petrol', power: '140 bhp', mileage: '16-18 kmpl', description: 'Iconic sedan with sporty dynamics.', image: '/images/honda-city.jpg', featured: true },
      { id: 'honda-cr-v', name: 'CR-V', category: 'car', type: 'SUV', price: 'â‚¹32-38 Lakh', engine: '2.0L Hybrid', power: '184 bhp', mileage: '18 kmpl', description: 'Premium SUV with hybrid technology.', image: '/images/honda-cr-v.jpg' },
      { id: 'honda-wr-v', name: 'WR-V', category: 'car', type: 'SUV', price: 'â‚¹9-13 Lakh', engine: '1.2L Petrol', power: '90 bhp', mileage: '16-23 kmpl', description: 'Compact SUV with Honda reliability.', image: '/images/honda-wr-v.jpg' },
      { id: 'honda-amaze', name: 'Amaze', category: 'car', type: 'Sedan', price: 'â‚¹7-11 Lakh', engine: '1.2L Petrol', power: '90 bhp', mileage: '18-24 kmpl', description: 'Compact sedan with spacious interior.', image: '/images/honda-amaze.jpg' },
      { id: 'honda-jazz', name: 'Jazz', category: 'car', type: 'Hatchback', price: 'â‚¹8-12 Lakh', engine: '1.2L Petrol', power: '90 bhp', mileage: '16-17 kmpl', description: 'Versatile hatchback with magic seats.', image: '/images/honda-jazz.jpg' },
      { id: 'honda-cb1000r', name: 'CB1000R', category: 'bike', type: 'Naked', price: 'â‚¹14-16 Lakh', engine: '998cc Inline-4', power: '143 bhp', mileage: '15-18 kmpl', description: 'Neo Sports Cafe flagship with stunning design.', image: '/images/honda-cb1000r.jpg', featured: true },
      { id: 'honda-cbr650r', name: 'CBR650R', category: 'bike', type: 'Sports', price: 'â‚¹9-10 Lakh', engine: '649cc Inline-4', power: '94 bhp', mileage: '20-25 kmpl', description: 'Middleweight supersport with inline-4 power.', image: '/images/honda-cbr650r.jpg', featured: true },
      { id: 'honda-cb650r', name: 'CB650R', category: 'bike', type: 'Naked', price: 'â‚¹8.5-9.5 Lakh', engine: '649cc Inline-4', power: '94 bhp', mileage: '20-25 kmpl', description: 'Neo Sports Cafe middleweight naked.', image: '/images/honda-cb650r.jpg' },
      { id: 'honda-africa-twin', name: 'Africa Twin', category: 'bike', type: 'Adventure', price: 'â‚¹16-18 Lakh', engine: '1084cc Parallel-Twin', power: '101 bhp', mileage: '18-22 kmpl', description: 'Legendary adventure tourer for any terrain.', image: '/images/honda-africa-twin.jpg', featured: true },
      { id: 'honda-gold-wing', name: 'Gold Wing', category: 'bike', type: 'Touring', price: 'â‚¹39-42 Lakh', engine: '1833cc Flat-6', power: '126 bhp', mileage: '14-16 kmpl', description: 'Ultimate luxury touring motorcycle.', image: '/images/honda-gold-wing.jpg', featured: true },
      { id: 'honda-rebel-500', name: 'Rebel 500', category: 'bike', type: 'Cruiser', price: 'â‚¹4.5-5.5 Lakh', engine: '471cc Parallel-Twin', power: '46 bhp', mileage: '25-28 kmpl', description: 'Modern cruiser with approachable power.', image: '/images/honda-rebel-500.jpg' },
      { id: 'honda-cb350', name: 'CB350', category: 'bike', type: 'Retro', price: 'â‚¹2-2.5 Lakh', engine: '348cc Single', power: '21 bhp', mileage: '35-40 kmpl', description: 'Classic roadster with modern reliability.', image: '/images/honda-cb350.jpg' },
      { id: 'honda-hornet-2', name: 'Hornet 2.0', category: 'bike', type: 'Naked', price: 'â‚¹1.3-1.5 Lakh', engine: '184cc Single', power: '17 bhp', mileage: '45-50 kmpl', description: 'Streetfighter with aggressive styling.', image: '/images/honda-hornet-2.jpg' },
      { id: 'honda-sp-125', name: 'SP 125', category: 'bike', type: 'Commuter', price: 'â‚¹85,000-95,000', engine: '124cc Single', power: '10 bhp', mileage: '60-65 kmpl', description: 'Fuel-efficient commuter motorcycle.', image: '/images/honda-sp-125.jpg' },
    ]
  },
  {
    id: 'yamaha',
    name: 'Yamaha',
    category: 'both',
    logo: '/images/brands/yamaha.svg',
    description: 'Japanese brand famous for performance bikes and reliable cars.',
    vehicles: [
      { id: 'yamaha-r1', name: 'YZF-R1', category: 'bike', type: 'Superbike', price: 'â‚¹18-20 Lakh', engine: '998cc Inline-4', power: '200 bhp', mileage: '12-15 kmpl', description: 'MotoGP-derived superbike technology.', image: '/images/yamaha-r1.jpg', featured: true },
      { id: 'yamaha-r7', name: 'YZF-R7', category: 'bike', type: 'Sports', price: 'â‚¹7-8 Lakh', engine: '689cc Parallel-Twin', power: '73 bhp', mileage: '20-25 kmpl', description: 'Middleweight supersport with CP2 engine.', image: '/images/yamaha-r7.jpg' },
      { id: 'yamaha-r3', name: 'YZF-R3', category: 'bike', type: 'Sports', price: 'â‚¹4.5-5 Lakh', engine: '321cc Parallel-Twin', power: '42 bhp', mileage: '25-30 kmpl', description: 'Entry-level supersport with twin-cylinder power.', image: '/images/yamaha-r3.jpg', featured: true },
      { id: 'yamaha-r15', name: 'YZF-R15 V4', category: 'bike', type: 'Sports', price: 'â‚¹1.8-2.2 Lakh', engine: '155cc Single', power: '18 bhp', mileage: '40-45 kmpl', description: 'India\'s favorite sports motorcycle.', image: '/images/yamaha-r15.jpg', featured: true },
      { id: 'yamaha-mt-10', name: 'MT-10', category: 'bike', type: 'Naked', price: 'â‚¹14-16 Lakh', engine: '998cc Inline-4', power: '160 bhp', mileage: '12-15 kmpl', description: 'Hyper naked with R1-derived engine.', image: '/images/yamaha-mt-10.jpg' },
      { id: 'yamaha-mt-09', name: 'MT-09', category: 'bike', type: 'Naked', price: 'â‚¹9-10 Lakh', engine: '890cc Triple', power: '119 bhp', mileage: '18-22 kmpl', description: 'The ultimate torque master.', image: '/images/yamaha-mt-09.jpg', featured: true },
      { id: 'yamaha-mt-07', name: 'MT-07', category: 'bike', type: 'Naked', price: 'â‚¹6-7 Lakh', engine: '689cc Parallel-Twin', power: '73 bhp', mileage: '22-26 kmpl', description: 'Best-selling middleweight naked bike.', image: '/images/yamaha-mt-07.jpg' },
      { id: 'yamaha-mt-03', name: 'MT-03', category: 'bike', type: 'Naked', price: 'â‚¹3.5-4 Lakh', engine: '321cc Parallel-Twin', power: '42 bhp', mileage: '25-30 kmpl', description: 'Entry naked with aggressive styling.', image: '/images/yamaha-mt-03.jpg' },
      { id: 'yamaha-mt-15', name: 'MT-15 V2', category: 'bike', type: 'Naked', price: 'â‚¹1.7-2 Lakh', engine: '155cc Single', power: '18 bhp', mileage: '45-50 kmpl', description: 'Streetfighter with R15 performance.', image: '/images/yamaha-mt-15.jpg' },
      { id: 'yamaha-tenere-700', name: 'Tenere 700', category: 'bike', type: 'Adventure', price: 'â‚¹10-12 Lakh', engine: '689cc Parallel-Twin', power: '73 bhp', mileage: '22-26 kmpl', description: 'Middleweight adventure bike for serious touring.', image: '/images/yamaha-tenere-700.jpg', featured: true },
      { id: 'yamaha-tracer-9', name: 'Tracer 9', category: 'bike', type: 'Touring', price: 'â‚¹11-13 Lakh', engine: '890cc Triple', power: '119 bhp', mileage: '18-22 kmpl', description: 'Sport tourer with CP3 engine.', image: '/images/yamaha-tracer-9.jpg' },
      { id: 'yamaha-xsr900', name: 'XSR900', category: 'bike', type: 'Retro', price: 'â‚¹9-10 Lakh', engine: '890cc Triple', power: '119 bhp', mileage: '18-22 kmpl', description: 'Neo-retro styling with modern performance.', image: '/images/yamaha-xsr900.jpg' },
      { id: 'yamaha-bolt', name: 'Bolt R-Spec', category: 'bike', type: 'Cruiser', price: 'â‚¹6-7 Lakh', engine: '942cc V-Twin', power: '65 bhp', mileage: '18-22 kmpl', description: 'Bobber-style cruiser with V-twin character.', image: '/images/yamaha-bolt.jpg' },
      { id: 'yamaha-wr450f', name: 'WR450F', category: 'bike', type: 'Off-Road', price: 'â‚¹7-8 Lakh', engine: '450cc Single', power: '55 bhp', mileage: '15-18 kmpl', description: 'Enduro bike for extreme off-roading.', image: '/images/yamaha-wr450f.jpg' },
      { id: 'yamaha-aerox', name: 'Aerox 155', category: 'bike', type: 'Scooter', price: 'â‚¹1.4-1.6 Lakh', engine: '155cc Single', power: '15 bhp', mileage: '40-45 kmpl', description: 'Sports scooter with R15 engine.', image: '/images/yamaha-aerox.jpg', featured: true },
      { id: 'yamaha-fascino', name: 'Fascino 125', category: 'bike', type: 'Scooter', price: 'â‚¹80,000-95,000', engine: '125cc Single', power: '8 bhp', mileage: '50-58 kmpl', description: 'Stylish scooter with hybrid power.', image: '/images/yamaha-fascino.jpg' },
    ]
  },
  {
    id: 'royal-enfield',
    name: 'Royal Enfield',
    category: 'bike',
    logo: '/images/brands/royal-enfield.svg',
    description: 'Iconic Indian motorcycle brand with British heritage.',
    vehicles: [
      { id: 're-classic-350', name: 'Classic 350', category: 'bike', type: 'Retro', price: 'â‚¹1.9-2.3 Lakh', engine: '349cc Single', power: '20 bhp', mileage: '35-40 kmpl', description: 'The motorcycle that defined a generation.', image: '/images/re-classic-350.jpg', featured: true },
      { id: 're-classic-350-signals', name: 'Classic 350 Signals', category: 'bike', type: 'Retro', price: 'â‚¹2.1-2.4 Lakh', engine: '349cc Single', power: '20 bhp', mileage: '35-40 kmpl', description: 'Military-inspired special edition.', image: '/images/re-classic-350-signals.jpg' },
      { id: 're-bullet-350', name: 'Bullet 350', category: 'bike', type: 'Retro', price: 'â‚¹1.7-2 Lakh', engine: '349cc Single', power: '20 bhp', mileage: '35-40 kmpl', description: 'The legendary thumper reborn.', image: '/images/re-bullet-350.jpg', featured: true },
      { id: 're-hunter-350', name: 'Hunter 350', category: 'bike', type: 'Retro', price: 'â‚¹1.5-1.9 Lakh', engine: '349cc Single', power: '20 bhp', mileage: '35-40 kmpl', description: 'Urban cruiser with modern attitude.', image: '/images/re-hunter-350.jpg', featured: true },
      { id: 're-meteor-350', name: 'Meteor 350', category: 'bike', type: 'Cruiser', price: 'â‚¹2-2.4 Lakh', engine: '349cc Single', power: '20 bhp', mileage: '35-40 kmpl', description: 'Easy-going cruiser with tripper navigation.', image: '/images/re-meteor-350.jpg' },
      { id: 're-himalayan-450', name: 'Himalayan 450', category: 'bike', type: 'Adventure', price: 'â‚¹2.9-3.3 Lakh', engine: '452cc Single', power: '40 bhp', mileage: '30-35 kmpl', description: 'All-new adventure bike with liquid cooling.', image: '/images/re-himalayan-450.jpg', featured: true },
      { id: 're-scram-411', name: 'Scram 411', category: 'bike', type: 'Scrambler', price: 'â‚¹2-2.3 Lakh', engine: '411cc Single', power: '24 bhp', mileage: '32-38 kmpl', description: 'Urban scrambler based on Himalayan.', image: '/images/re-scram-411.jpg' },
      { id: 're-interceptor-650', name: 'Interceptor 650', category: 'bike', type: 'Retro', price: 'â‚¹3-3.4 Lakh', engine: '648cc Parallel-Twin', power: '47 bhp', mileage: '25-30 kmpl', description: 'Modern classic with twin-cylinder smoothness.', image: '/images/re-interceptor-650.jpg', featured: true },
      { id: 're-continental-gt-650', name: 'Continental GT 650', category: 'bike', type: 'Cafe Racer', price: 'â‚¹3.2-3.6 Lakh', engine: '648cc Parallel-Twin', power: '47 bhp', mileage: '25-30 kmpl', description: 'Cafe racer styling with modern performance.', image: '/images/re-continental-gt-650.jpg', featured: true },
      { id: 're-super-meteor-650', name: 'Super Meteor 650', category: 'bike', type: 'Cruiser', price: 'â‚¹3.6-4 Lakh', engine: '648cc Parallel-Twin', power: '47 bhp', mileage: '25-28 kmpl', description: 'Premium cruiser with twin power.', image: '/images/re-super-meteor-650.jpg', featured: true },
      { id: 're-shotgun-650', name: 'Shotgun 650', category: 'bike', type: 'Bobber', price: 'â‚¹3.8-4.2 Lakh', engine: '648cc Parallel-Twin', power: '47 bhp', mileage: '25-28 kmpl', description: 'Modern bobber with aggressive stance.', image: '/images/re-shotgun-650.jpg' },
      { id: 're-bear-650', name: 'Bear 650', category: 'bike', type: 'Scrambler', price: 'â‚¹3.5-4 Lakh', engine: '648cc Parallel-Twin', power: '47 bhp', mileage: '25-28 kmpl', description: 'Scrambler variant of the 650 platform.', image: '/images/re-bear-650.jpg' },
    ]
  },
  {
    id: 'kawasaki',
    name: 'Kawasaki',
    category: 'bike',
    logo: '/images/brands/kawasaki.svg',
    description: 'Japanese manufacturer known for high-performance motorcycles.',
    vehicles: [
      { id: 'kawasaki-ninja-h2r', name: 'Ninja H2R', category: 'bike', type: 'Superbike', price: 'â‚¹80-85 Lakh', engine: '998cc Supercharged', power: '310 bhp', mileage: '8-12 kmpl', description: 'The fastest production motorcycle ever made.', image: '/images/kawasaki-ninja-h2r.jpg', featured: true },
      { id: 'kawasaki-ninja-h2', name: 'Ninja H2', category: 'bike', type: 'Superbike', price: 'â‚¹35-40 Lakh', engine: '998cc Supercharged', power: '231 bhp', mileage: '10-14 kmpl', description: 'Street-legal supercharged hyperbike.', image: '/images/kawasaki-ninja-h2.jpg', featured: true },
      { id: 'kawasaki-ninja-zx10r', name: 'Ninja ZX-10R', category: 'bike', type: 'Superbike', price: 'â‚¹16-18 Lakh', engine: '998cc Inline-4', power: '203 bhp', mileage: '12-15 kmpl', description: 'World Superbike championship winner.', image: '/images/kawasaki-ninja-zx10r.jpg', featured: true },
      { id: 'kawasaki-ninja-zx6r', name: 'Ninja ZX-6R', category: 'bike', type: 'Supersport', price: 'â‚¹11-13 Lakh', engine: '636cc Inline-4', power: '130 bhp', mileage: '15-18 kmpl', description: '600cc class-leading supersport.', image: '/images/kawasaki-ninja-zx6r.jpg' },
      { id: 'kawasaki-ninja-650', name: 'Ninja 650', category: 'bike', type: 'Sports', price: 'â‚¹7-8 Lakh', engine: '649cc Parallel-Twin', power: '68 bhp', mileage: '20-25 kmpl', description: 'Versatile sports tourer with twin power.', image: '/images/kawasaki-ninja-650.jpg', featured: true },
      { id: 'kawasaki-ninja-400', name: 'Ninja 400', category: 'bike', type: 'Sports', price: 'â‚¹5-5.5 Lakh', engine: '399cc Parallel-Twin', power: '49 bhp', mileage: '25-30 kmpl', description: 'Best-selling entry-level sports bike.', image: '/images/kawasaki-ninja-400.jpg' },
      { id: 'kawasaki-z-h2', name: 'Z H2', category: 'bike', type: 'Naked', price: 'â‚¹22-25 Lakh', engine: '998cc Supercharged', power: '200 bhp', mileage: '12-15 kmpl', description: 'Supercharged naked hyperbike.', image: '/images/kawasaki-z-h2.jpg', featured: true },
      { id: 'kawasaki-z900', name: 'Z900', category: 'bike', type: 'Naked', price: 'â‚¹9-10 Lakh', engine: '948cc Inline-4', power: '125 bhp', mileage: '15-18 kmpl', description: 'Sugomi styling with inline-4 power.', image: '/images/kawasaki-z900.jpg' },
      { id: 'kawasaki-z650', name: 'Z650', category: 'bike', type: 'Naked', price: 'â‚¹6-7 Lakh', engine: '649cc Parallel-Twin', power: '68 bhp', mileage: '20-25 kmpl', description: 'Middleweight naked with agile handling.', image: '/images/kawasaki-z650.jpg' },
      { id: 'kawasaki-z400', name: 'Z400', category: 'bike', type: 'Naked', price: 'â‚¹4.5-5 Lakh', engine: '399cc Parallel-Twin', power: '49 bhp', mileage: '25-30 kmpl', description: 'Entry naked with sporty character.', image: '/images/kawasaki-z400.jpg' },
      { id: 'kawasaki-versys-1000', name: 'Versys 1000', category: 'bike', type: 'Adventure', price: 'â‚¹12-14 Lakh', engine: '1043cc Inline-4', power: '120 bhp', mileage: '16-20 kmpl', description: 'Sport adventure tourer with inline-4 smoothness.', image: '/images/kawasaki-versys-1000.jpg' },
      { id: 'kawasaki-versys-650', name: 'Versys 650', category: 'bike', type: 'Adventure', price: 'â‚¹7.5-8.5 Lakh', engine: '649cc Parallel-Twin', power: '68 bhp', mileage: '20-25 kmpl', description: 'Middleweight adventure all-rounder.', image: '/images/kawasaki-versys-650.jpg' },
      { id: 'kawasaki-vulcan-s', name: 'Vulcan S', category: 'bike', type: 'Cruiser', price: 'â‚¹6-7 Lakh', engine: '649cc Parallel-Twin', power: '61 bhp', mileage: '20-25 kmpl', description: 'Sport cruiser with adjustable ergonomics.', image: '/images/kawasaki-vulcan-s.jpg' },
      { id: 'kawasaki-klr-650', name: 'KLR 650', category: 'bike', type: 'Adventure', price: 'â‚¹6-7 Lakh', engine: '652cc Single', power: '40 bhp', mileage: '25-30 kmpl', description: 'Legendary dual-sport adventure bike.', image: '/images/kawasaki-klr-650.jpg' },
      { id: 'kawasaki-kx-450', name: 'KX 450', category: 'bike', type: 'Motocross', price: 'â‚¹8-9 Lakh', engine: '449cc Single', power: '55 bhp', mileage: 'N/A', description: 'Championship-winning motocross bike.', image: '/images/kawasaki-kx-450.jpg' },
    ]
  },
  {
    id: 'bmw',
    name: 'BMW Motorrad',
    category: 'both',
    logo: '/images/brands/bmw.svg',
    description: 'German luxury brand offering premium cars and motorcycles.',
    vehicles: [
      { id: 'bmw-s1000rr', name: 'S 1000 RR', category: 'bike', type: 'Superbike', price: 'â‚¹20-24 Lakh', engine: '999cc Inline-4', power: '210 bhp', mileage: '12-16 kmpl', description: 'The ultimate superbike with asymmetric headlights.', image: '/images/bmw-s1000rr.jpg', featured: true },
      { id: 'bmw-s1000r', name: 'S 1000 R', category: 'bike', type: 'Naked', price: 'â‚¹18-20 Lakh', engine: '999cc Inline-4', power: '165 bhp', mileage: '14-18 kmpl', description: 'Super naked with RR DNA.', image: '/images/bmw-s1000r.jpg', featured: true },
      { id: 'bmw-s1000xr', name: 'S 1000 XR', category: 'bike', type: 'Adventure', price: 'â‚¹20-23 Lakh', engine: '999cc Inline-4', power: '165 bhp', mileage: '15-19 kmpl', description: 'Adventure sport with superbike performance.', image: '/images/bmw-s1000xr.jpg' },
      { id: 'bmw-m1000rr', name: 'M 1000 RR', category: 'bike', type: 'Superbike', price: 'â‚¹42-48 Lakh', engine: '999cc Inline-4', power: '212 bhp', mileage: '12-15 kmpl', description: 'M Performance superbike with carbon wings.', image: '/images/bmw-m1000rr.jpg', featured: true },
      { id: 'bmw-r1250gs', name: 'R 1250 GS', category: 'bike', type: 'Adventure', price: 'â‚¹20-24 Lakh', engine: '1254cc Boxer-Twin', power: '136 bhp', mileage: '18-22 kmpl', description: 'The king of adventure motorcycles.', image: '/images/bmw-r1250gs.jpg', featured: true },
      { id: 'bmw-r1250gsa', name: 'R 1250 GS Adventure', category: 'bike', type: 'Adventure', price: 'â‚¹22-26 Lakh', engine: '1254cc Boxer-Twin', power: '136 bhp', mileage: '18-22 kmpl', description: 'Ultimate long-distance adventure machine.', image: '/images/bmw-r1250gsa.jpg' },
      { id: 'bmw-r1250rt', name: 'R 1250 RT', category: 'bike', type: 'Touring', price: 'â‚¹24-28 Lakh', engine: '1254cc Boxer-Twin', power: '136 bhp', mileage: '18-22 kmpl', description: 'Luxury touring with boxer comfort.', image: '/images/bmw-r1250rt.jpg' },
      { id: 'bmw-r18', name: 'R 18', category: 'bike', type: 'Cruiser', price: 'â‚¹24-28 Lakh', engine: '1802cc Boxer-Twin', power: '91 bhp', mileage: '15-18 kmpl', description: 'Biggest boxer engine in production.', image: '/images/bmw-r18.jpg', featured: true },
      { id: 'bmw-rnine-t', name: 'R nineT', category: 'bike', type: 'Retro', price: 'â‚¹18-22 Lakh', engine: '1170cc Boxer-Twin', power: '109 bhp', mileage: '18-22 kmpl', description: 'Heritage styling with modern performance.', image: '/images/bmw-rnine-t.jpg' },
      { id: 'bmw-f900r', name: 'F 900 R', category: 'bike', type: 'Naked', price: 'â‚¹11-13 Lakh', engine: '895cc Parallel-Twin', power: '105 bhp', mileage: '20-24 kmpl', description: 'Dynamic roadster with versatile performance.', image: '/images/bmw-f900r.jpg' },
      { id: 'bmw-f900xr', name: 'F 900 XR', category: 'bike', type: 'Adventure', price: 'â‚¹12-14 Lakh', engine: '895cc Parallel-Twin', power: '105 bhp', mileage: '20-24 kmpl', description: 'Sport adventure middleweight.', image: '/images/bmw-f900xr.jpg' },
      { id: 'bmw-f850gs', name: 'F 850 GS', category: 'bike', type: 'Adventure', price: 'â‚¹13-15 Lakh', engine: '853cc Parallel-Twin', power: '95 bhp', mileage: '22-26 kmpl', description: 'Middleweight adventure all-rounder.', image: '/images/bmw-f850gs.jpg' },
      { id: 'bmw-g310r', name: 'G 310 R', category: 'bike', type: 'Naked', price: 'â‚¹3-3.5 Lakh', engine: '313cc Single', power: '34 bhp', mileage: '30-35 kmpl', description: 'Entry roadster with BMW quality.', image: '/images/bmw-g310r.jpg' },
      { id: 'bmw-g310gs', name: 'G 310 GS', category: 'bike', type: 'Adventure', price: 'â‚¹3.5-4 Lakh', engine: '313cc Single', power: '34 bhp', mileage: '28-32 kmpl', description: 'Entry adventure bike with GS DNA.', image: '/images/bmw-g310gs.jpg' },
      { id: 'bmw-k1600gtl', name: 'K 1600 GTL', category: 'bike', type: 'Touring', price: 'â‚¹32-36 Lakh', engine: '1649cc Inline-6', power: '160 bhp', mileage: '16-20 kmpl', description: 'Luxury touring with 6-cylinder smoothness.', image: '/images/bmw-k1600gtl.jpg', featured: true },
      { id: 'bmw-ce04', name: 'CE 04', category: 'bike', type: 'Electric', price: 'â‚¹14-16 Lakh', engine: 'Electric', power: '42 bhp', mileage: '130 km range', description: 'Futuristic electric scooter from BMW.', image: '/images/bmw-ce04.jpg' },
    ]
  },
  {
    id: 'suzuki',
    name: 'Suzuki',
    category: 'both',
    logo: '/images/brands/suzuki.svg',
    description: 'Japanese manufacturer offering reliable cars and performance bikes.',
    vehicles: [
      { id: 'suzuki-swift', name: 'Swift', category: 'car', type: 'Hatchback', price: 'â‚¹6-9 Lakh', engine: '1.2L Petrol', power: '90 bhp', mileage: '22-25 kmpl', description: 'India\'s favorite hot hatch.', image: '/images/suzuki-swift.jpg', featured: true },
      { id: 'suzuki-dzire', name: 'Dzire', category: 'car', type: 'Sedan', price: 'â‚¹6.5-10 Lakh', engine: '1.2L Petrol', power: '90 bhp', mileage: '22-25 kmpl', description: 'Compact sedan with premium features.', image: '/images/suzuki-dzire.jpg' },
      { id: 'suzuki-baleno', name: 'Baleno', category: 'car', type: 'Hatchback', price: 'â‚¹7-10 Lakh', engine: '1.2L Petrol', power: '90 bhp', mileage: '22-25 kmpl', description: 'Premium hatchback with spacious interior.', image: '/images/suzuki-baleno.jpg' },
      { id: 'suzuki-brezza', name: 'Brezza', category: 'car', type: 'SUV', price: 'â‚¹8-13 Lakh', engine: '1.5L Petrol', power: '103 bhp', mileage: '17-20 kmpl', description: 'Compact SUV with strong hybrid option.', image: '/images/suzuki-brezza.jpg', featured: true },
      { id: 'suzuki-ertiga', name: 'Ertiga', category: 'car', type: 'MPV', price: 'â‚¹9-13 Lakh', engine: '1.5L Petrol', power: '103 bhp', mileage: '20-26 kmpl', description: 'India\'s favorite family MPV.', image: '/images/suzuki-ertiga.jpg' },
      { id: 'suzuki-xl6', name: 'XL6', category: 'car', type: 'MPV', price: 'â‚¹12-15 Lakh', engine: '1.5L Petrol', power: '103 bhp', mileage: '20-26 kmpl', description: 'Premium 6-seater MPV with captain seats.', image: '/images/suzuki-xl6.jpg' },
      { id: 'suzuki-grand-vitara', name: 'Grand Vitara', category: 'car', type: 'SUV', price: 'â‚¹11-20 Lakh', engine: '1.5L Hybrid', power: '116 bhp', mileage: '27 kmpl', description: 'Premium SUV with strong hybrid technology.', image: '/images/suzuki-grand-vitara.jpg', featured: true },
      { id: 'suzuki-jimny', name: 'Jimny', category: 'car', type: 'SUV', price: 'â‚¹13-16 Lakh', engine: '1.5L Petrol', power: '105 bhp', mileage: '16-18 kmpl', description: 'Legendary 4x4 in a compact package.', image: '/images/suzuki-jimny.jpg', featured: true },
      { id: 'suzuki-invicto', name: 'Invicto', category: 'car', type: 'MPV', price: 'â‚¹25-30 Lakh', engine: '2.0L Hybrid', power: '190 bhp', mileage: '23 kmpl', description: 'Premium MPV with hybrid powertrain.', image: '/images/suzuki-invicto.jpg' },
      { id: 'suzuki-gsx-r1000', name: 'GSX-R1000R', category: 'bike', type: 'Superbike', price: 'â‚¹20-22 Lakh', engine: '999cc Inline-4', power: '202 bhp', mileage: '12-15 kmpl', description: 'Top-tier superbike with MotoGP DNA.', image: '/images/suzuki-gsx-r1000.jpg', featured: true },
      { id: 'suzuki-gsx-s1000', name: 'GSX-S1000', category: 'bike', type: 'Naked', price: 'â‚¹12-14 Lakh', engine: '999cc Inline-4', power: '152 bhp', mileage: '14-18 kmpl', description: 'Streetfighter with superbike engine.', image: '/images/suzuki-gsx-s1000.jpg' },
      { id: 'suzuki-gsx-s750', name: 'GSX-S750', category: 'bike', type: 'Naked', price: 'â‚¹8-9 Lakh', engine: '749cc Inline-4', power: '114 bhp', mileage: '16-20 kmpl', description: 'Middleweight naked with inline-4 character.', image: '/images/suzuki-gsx-s750.jpg' },
      { id: 'suzuki-hayabusa', name: 'Hayabusa', category: 'bike', type: 'Hyperbike', price: 'â‚¹16-18 Lakh', engine: '1340cc Inline-4', power: '190 bhp', mileage: '12-15 kmpl', description: 'The legendary speed demon reborn.', image: '/images/suzuki-hayabusa.jpg', featured: true },
      { id: 'suzuki-vstrom-1050', name: 'V-Strom 1050', category: 'bike', type: 'Adventure', price: 'â‚¹14-16 Lakh', engine: '1037cc V-Twin', power: '107 bhp', mileage: '18-22 kmpl', description: 'Adventure touring with V-twin character.', image: '/images/suzuki-vstrom-1050.jpg' },
      { id: 'suzuki-vstrom-650', name: 'V-Strom 650', category: 'bike', type: 'Adventure', price: 'â‚¹8-9 Lakh', engine: '645cc V-Twin', power: '71 bhp', mileage: '22-26 kmpl', description: 'Versatile middleweight adventure bike.', image: '/images/suzuki-vstrom-650.jpg' },
      { id: 'suzuki-sv650', name: 'SV650', category: 'bike', type: 'Naked', price: 'â‚¹6-7 Lakh', engine: '645cc V-Twin', power: '76 bhp', mileage: '22-26 kmpl', description: 'Lightweight middleweight with V-twin charm.', image: '/images/suzuki-sv650.jpg' },
      { id: 'suzuki-boulevard', name: 'Boulevard M109R', category: 'bike', type: 'Cruiser', price: 'â‚¹12-14 Lakh', engine: '1783cc V-Twin', power: '128 bhp', mileage: '14-18 kmpl', description: 'Power cruiser with massive V-twin.', image: '/images/suzuki-boulevard.jpg' },
      { id: 'suzuki-intruder', name: 'Intruder 150', category: 'bike', type: 'Cruiser', price: 'â‚¹1.2-1.4 Lakh', engine: '155cc Single', power: '14 bhp', mileage: '40-45 kmpl', description: 'Entry cruiser with distinctive styling.', image: '/images/suzuki-intruder.jpg' },
      { id: 'suzuki-access', name: 'Access 125', category: 'bike', type: 'Scooter', price: 'â‚¹80,000-95,000', engine: '124cc Single', power: '8.5 bhp', mileage: '50-55 kmpl', description: 'Reliable family scooter with great mileage.', image: '/images/suzuki-access.jpg' },
      { id: 'suzuki-burgman', name: 'Burgman Street 125', category: 'bike', type: 'Scooter', price: 'â‚¹95,000-1.1 Lakh', engine: '124cc Single', power: '8.5 bhp', mileage: '48-52 kmpl', description: 'Maxi-scooter styling in 125cc format.', image: '/images/suzuki-burgman.jpg' },
    ]
  },
  {
    id: 'ktm',
    name: 'KTM',
    category: 'bike',
    logo: '/images/brands/ktm.svg',
    description: 'Austrian brand known for high-performance orange machines.',
    vehicles: [
      { id: 'ktm-rc-390', name: 'RC 390', category: 'bike', type: 'Supersport', price: 'â‚¹3.2-3.6 Lakh', engine: '373cc Single', power: '43 bhp', mileage: '25-30 kmpl', description: 'Track-focused supersport with WP suspension.', image: '/images/ktm-rc-390.jpg', featured: true },
      { id: 'ktm-rc-200', name: 'RC 200', category: 'bike', type: 'Sports', price: 'â‚¹2.2-2.5 Lakh', engine: '200cc Single', power: '25 bhp', mileage: '30-35 kmpl', description: 'Entry supersport with sharp styling.', image: '/images/ktm-rc-200.jpg' },
      { id: 'ktm-rc-125', name: 'RC 125', category: 'bike', type: 'Sports', price: 'â‚¹1.9-2.2 Lakh', engine: '125cc Single', power: '15 bhp', mileage: '35-40 kmpl', description: 'Learner-legal sports bike with RC styling.', image: '/images/ktm-rc-125.jpg' },
      { id: 'ktm-duke-390', name: '390 Duke', category: 'bike', type: 'Naked', price: 'â‚¹3-3.4 Lakh', engine: '399cc Single', power: '46 bhp', mileage: '25-30 kmpl', description: 'The corner rocket with supermoto handling.', image: '/images/ktm-duke-390.jpg', featured: true },
      { id: 'ktm-duke-250', name: '250 Duke', category: 'bike', type: 'Naked', price: 'â‚¹2.3-2.6 Lakh', engine: '249cc Single', power: '30 bhp', mileage: '30-35 kmpl', description: 'Lightweight Duke with agile handling.', image: '/images/ktm-duke-250.jpg' },
      { id: 'ktm-duke-200', name: '200 Duke', category: 'bike', type: 'Naked', price: 'â‚¹1.9-2.2 Lakh', engine: '200cc Single', power: '25 bhp', mileage: '32-38 kmpl', description: 'The original Duke that started it all.', image: '/images/ktm-duke-200.jpg' },
      { id: 'ktm-duke-125', name: '125 Duke', category: 'bike', type: 'Naked', price: 'â‚¹1.7-2 Lakh', engine: '125cc Single', power: '15 bhp', mileage: '35-42 kmpl', description: 'Entry Duke with full-size attitude.', image: '/images/ktm-duke-125.jpg' },
      { id: 'ktm-890-duke', name: '890 Duke R', category: 'bike', type: 'Naked', price: 'â‚¹11-13 Lakh', engine: '889cc Parallel-Twin', power: '121 bhp', mileage: '18-22 kmpl', description: 'The scalpel - sharp and precise.', image: '/images/ktm-890-duke.jpg', featured: true },
      { id: 'ktm-1290-sdr', name: '1290 Super Duke R', category: 'bike', type: 'Naked', price: 'â‚¹20-24 Lakh', engine: '1301cc V-Twin', power: '180 bhp', mileage: '14-18 kmpl', description: 'The beast - ultimate hyper naked.', image: '/images/ktm-1290-sdr.jpg', featured: true },
      { id: 'ktm-390-adventure', name: '390 Adventure', category: 'bike', type: 'Adventure', price: 'â‚¹3.4-3.8 Lakh', engine: '373cc Single', power: '43 bhp', mileage: '28-32 kmpl', description: 'Compact adventure with touring capability.', image: '/images/ktm-390-adventure.jpg', featured: true },
      { id: 'ktm-250-adventure', name: '250 Adventure', category: 'bike', type: 'Adventure', price: 'â‚¹2.5-2.8 Lakh', engine: '249cc Single', power: '30 bhp', mileage: '32-36 kmpl', description: 'Light adventure for exploring horizons.', image: '/images/ktm-250-adventure.jpg' },
      { id: 'ktm-890-adventure', name: '890 Adventure R', category: 'bike', type: 'Adventure', price: 'â‚¹14-16 Lakh', engine: '889cc Parallel-Twin', power: '105 bhp', mileage: '20-24 kmpl', description: 'Rally-ready adventure machine.', image: '/images/ktm-890-adventure.jpg' },
      { id: 'ktm-1290-sa', name: '1290 Super Adventure S', category: 'bike', type: 'Adventure', price: 'â‚¹18-22 Lakh', engine: '1301cc V-Twin', power: '160 bhp', mileage: '16-20 kmpl', description: 'Ultimate adventure tourer with semi-active suspension.', image: '/images/ktm-1290-sa.jpg' },
      { id: 'ktm-450-exc', name: '450 EXC-F', category: 'bike', type: 'Enduro', price: 'â‚¹10-12 Lakh', engine: '450cc Single', power: '55 bhp', mileage: 'N/A', description: 'Race-ready enduro bike.', image: '/images/ktm-450-exc.jpg' },
      { id: 'ktm-350-exc', name: '350 EXC-F', category: 'bike', type: 'Enduro', price: 'â‚¹9-11 Lakh', engine: '350cc Single', power: '45 bhp', mileage: 'N/A', description: 'Versatile enduro for all terrains.', image: '/images/ktm-350-exc.jpg' },
      { id: 'ktm-450-sx', name: '450 SX-F', category: 'bike', type: 'Motocross', price: 'â‚¹9-11 Lakh', engine: '450cc Single', power: '63 bhp', mileage: 'N/A', description: 'Championship-winning motocrosser.', image: '/images/ktm-450-sx.jpg' },
    ]
  },
  {
    id: 'triumph',
    name: 'Triumph',
    category: 'bike',
    logo: '/images/brands/triumph.svg',
    description: 'British motorcycle brand with rich heritage and modern performance.',
    vehicles: [
      { id: 'triumph-street-triple-rs', name: 'Street Triple RS', category: 'bike', type: 'Naked', price: 'â‚¹12-14 Lakh', engine: '765cc Triple', power: '128 bhp', mileage: '18-22 kmpl', description: 'The ultimate middleweight naked.', image: '/images/triumph-street-triple-rs.jpg', featured: true },
      { id: 'triumph-street-triple-r', name: 'Street Triple R', category: 'bike', type: 'Naked', price: 'â‚¹10-12 Lakh', engine: '765cc Triple', power: '118 bhp', mileage: '18-22 kmpl', description: 'Streetfighter with triple character.', image: '/images/triumph-street-triple-r.jpg' },
      { id: 'triumph-speed-triple-1200', name: 'Speed Triple 1200 RS', category: 'bike', type: 'Naked', price: 'â‚¹18-20 Lakh', engine: '1160cc Triple', power: '180 bhp', mileage: '15-18 kmpl', description: 'Hyper naked with iconic twin headlights.', image: '/images/triumph-speed-triple-1200.jpg', featured: true },
      { id: 'triumph-speed-twin-900', name: 'Speed Twin 900', category: 'bike', type: 'Retro', price: 'â‚¹9-10 Lakh', engine: '900cc Parallel-Twin', power: '65 bhp', mileage: '22-26 kmpl', description: 'Modern classic with sporty handling.', image: '/images/triumph-speed-twin-900.jpg' },
      { id: 'triumph-speed-twin-1200', name: 'Speed Twin 1200', category: 'bike', type: 'Retro', price: 'â‚¹12-14 Lakh', engine: '1200cc Parallel-Twin', power: '100 bhp', mileage: '20-24 kmpl', description: 'Performance modern classic.', image: '/images/triumph-speed-twin-1200.jpg' },
      { id: 'triumph-bonneville-t120', name: 'Bonneville T120', category: 'bike', type: 'Classic', price: 'â‚¹11-13 Lakh', engine: '1200cc Parallel-Twin', power: '80 bhp', mileage: '20-24 kmpl', description: 'The original British motorcycle icon.', image: '/images/triumph-bonneville-t120.jpg', featured: true },
      { id: 'triumph-bonneville-bobber', name: 'Bonneville Bobber', category: 'bike', type: 'Bobber', price: 'â‚¹12-14 Lakh', engine: '1200cc Parallel-Twin', power: '78 bhp', mileage: '20-24 kmpl', description: 'Factory custom bobber styling.', image: '/images/triumph-bonneville-bobber.jpg' },
      { id: 'triumph-bonneville-speedmaster', name: 'Bonneville Speedmaster', category: 'bike', type: 'Cruiser', price: 'â‚¹12-14 Lakh', engine: '1200cc Parallel-Twin', power: '78 bhp', mileage: '20-24 kmpl', description: 'Cruiser comfort with classic style.', image: '/images/triumph-bonneville-speedmaster.jpg' },
      { id: 'triumph-tiger-900', name: 'Tiger 900 GT', category: 'bike', type: 'Adventure', price: 'â‚¹14-16 Lakh', engine: '888cc Triple', power: '95 bhp', mileage: '20-24 kmpl', description: 'Middleweight adventure with triple character.', image: '/images/triumph-tiger-900.jpg' },
      { id: 'triumph-tiger-1200', name: 'Tiger 1200 Rally Pro', category: 'bike', type: 'Adventure', price: 'â‚¹20-24 Lakh', engine: '1160cc Triple', power: '150 bhp', mileage: '18-22 kmpl', description: 'Ultimate adventure with triple power.', image: '/images/triumph-tiger-1200.jpg', featured: true },
      { id: 'triumph-rocket-3', name: 'Rocket 3 R', category: 'bike', type: 'Cruiser', price: 'â‚¹19-22 Lakh', engine: '2500cc Inline-3', power: '167 bhp', mileage: '14-18 kmpl', description: 'World\'s largest production motorcycle engine.', image: '/images/triumph-rocket-3.jpg', featured: true },
      { id: 'triumph-daytona-660', name: 'Daytona 660', category: 'bike', type: 'Sports', price: 'â‚¹9-10 Lakh', engine: '660cc Triple', power: '95 bhp', mileage: '20-24 kmpl', description: 'Supersport returns with triple power.', image: '/images/triumph-daytona-660.jpg' },
      { id: 'triumph-trident-660', name: 'Trident 660', category: 'bike', type: 'Naked', price: 'â‚¹7.5-8.5 Lakh', engine: '660cc Triple', power: '81 bhp', mileage: '22-26 kmpl', description: 'Pure fun guaranteed with triple smoothness.', image: '/images/triumph-trident-660.jpg' },
      { id: 'triumph-speed-400', name: 'Speed 400', category: 'bike', type: 'Naked', price: 'â‚¹2.3-2.6 Lakh', engine: '398cc Single', power: '40 bhp', mileage: '28-32 kmpl', description: 'Entry Triumph with big bike feel.', image: '/images/triumph-speed-400.jpg', featured: true },
      { id: 'triumph-scrambler-400', name: 'Scrambler 400 X', category: 'bike', type: 'Scrambler', price: 'â‚¹2.6-2.9 Lakh', engine: '398cc Single', power: '40 bhp', mileage: '28-32 kmpl', description: 'Scrambler style in entry segment.', image: '/images/triumph-scrambler-400.jpg' },
      { id: 'triumph-scrambler-900', name: 'Scrambler 900', category: 'bike', type: 'Scrambler', price: 'â‚¹10-12 Lakh', engine: '900cc Parallel-Twin', power: '65 bhp', mileage: '22-26 kmpl', description: 'Urban scrambler with classic DNA.', image: '/images/triumph-scrambler-900.jpg' },
      { id: 'triumph-scrambler-1200', name: 'Scrambler 1200 XE', category: 'bike', type: 'Scrambler', price: 'â‚¹14-16 Lakh', engine: '1200cc Parallel-Twin', power: '90 bhp', mileage: '20-24 kmpl', description: 'Ultimate scrambler with off-road capability.', image: '/images/triumph-scrambler-1200.jpg' },
    ]
  },
  {
    id: 'aprilia',
    name: 'Aprilia',
    category: 'bike',
    logo: '/images/brands/aprilia.svg',
    description: 'Italian brand known for racing pedigree and performance bikes.',
    vehicles: [
      { id: 'aprilia-rsv4', name: 'RSV4', category: 'bike', type: 'Superbike', price: 'â‚¹24-28 Lakh', engine: '1099cc V4', power: '217 bhp', mileage: '12-15 kmpl', description: 'World Superbike championship winner.', image: '/images/aprilia-rsv4.jpg', featured: true },
      { id: 'aprilia-rsv4-factory', name: 'RSV4 Factory', category: 'bike', type: 'Superbike', price: 'â‚¹28-32 Lakh', engine: '1099cc V4', power: '217 bhp', mileage: '12-15 kmpl', description: 'Factory race bike for the road.', image: '/images/aprilia-rsv4-factory.jpg' },
      { id: 'aprilia-tuono-v4', name: 'Tuono V4', category: 'bike', type: 'Naked', price: 'â‚¹21-24 Lakh', engine: '1077cc V4', power: '175 bhp', mileage: '14-18 kmpl', description: 'Hyper naked with V4 power.', image: '/images/aprilia-tuono-v4.jpg', featured: true },
      { id: 'aprilia-tuono-660', name: 'Tuono 660', category: 'bike', type: 'Naked', price: 'â‚¹12-14 Lakh', engine: '659cc Parallel-Twin', power: '95 bhp', mileage: '20-24 kmpl', description: 'Middleweight naked with sporty character.', image: '/images/aprilia-tuono-660.jpg' },
      { id: 'aprilia-rs-660', name: 'RS 660', category: 'bike', type: 'Supersport', price: 'â‚¹13-15 Lakh', engine: '659cc Parallel-Twin', power: '100 bhp', mileage: '20-24 kmpl', description: 'Twin-cylinder supersport with racing DNA.', image: '/images/aprilia-rs-660.jpg', featured: true },
      { id: 'aprilia-rs-457', name: 'RS 457', category: 'bike', type: 'Sports', price: 'â‚¹4-4.5 Lakh', engine: '457cc Parallel-Twin', power: '47 bhp', mileage: '25-30 kmpl', description: 'Entry supersport with twin-cylinder power.', image: '/images/aprilia-rs-457.jpg' },
      { id: 'aprilia-tuareg-660', name: 'Tuareg 660', category: 'bike', type: 'Adventure', price: 'â‚¹12-14 Lakh', engine: '659cc Parallel-Twin', power: '80 bhp', mileage: '22-26 kmpl', description: 'Middleweight adventure with rally styling.', image: '/images/aprilia-tuareg-660.jpg' },
      { id: 'aprilia-sr-160', name: 'SR 160', category: 'bike', type: 'Scooter', price: 'â‚¹1.3-1.5 Lakh', engine: '160cc Single', power: '11 bhp', mileage: '35-40 kmpl', description: 'Sport scooter with Italian styling.', image: '/images/aprilia-sr-160.jpg', featured: true },
      { id: 'aprilia-sxr-160', name: 'SXR 160', category: 'bike', type: 'Scooter', price: 'â‚¹1.4-1.6 Lakh', engine: '160cc Single', power: '11 bhp', mileage: '35-40 kmpl', description: 'Maxi-scooter styling in 160cc format.', image: '/images/aprilia-sxr-160.jpg' },
      { id: 'aprilia-sr-gt-200', name: 'SR GT 200', category: 'bike', type: 'Scooter', price: 'â‚¹1.5-1.7 Lakh', engine: '200cc Single', power: '17 bhp', mileage: '32-38 kmpl', description: 'Adventure scooter with off-road capability.', image: '/images/aprilia-sr-gt-200.jpg' },
    ]
  },
  {
    id: 'harley-davidson',
    name: 'Harley-Davidson',
    category: 'bike',
    logo: '/images/brands/harley-davidson.svg',
    description: 'American motorcycle icon known for cruisers and touring bikes.',
    vehicles: [
      { id: 'hd-road-king', name: 'Road King', category: 'bike', type: 'Touring', price: 'â‚¹22-25 Lakh', engine: '1868cc V-Twin', power: '93 bhp', mileage: '16-20 kmpl', description: 'Classic touring with timeless style.', image: '/images/hd-road-king.jpg', featured: true },
      { id: 'hd-street-glide', name: 'Street Glide', category: 'bike', type: 'Touring', price: 'â‚¹32-36 Lakh', engine: '1923cc V-Twin', power: '105 bhp', mileage: '15-18 kmpl', description: 'Bagger style with modern technology.', image: '/images/hd-street-glide.jpg', featured: true },
      { id: 'hd-road-glide', name: 'Road Glide', category: 'bike', type: 'Touring', price: 'â‚¹35-40 Lakh', engine: '1923cc V-Twin', power: '105 bhp', mileage: '15-18 kmpl', description: 'Shark nose fairing with touring comfort.', image: '/images/hd-road-glide.jpg' },
      { id: 'hd-ultra-limited', name: 'Ultra Limited', category: 'bike', type: 'Touring', price: 'â‚¹38-42 Lakh', engine: '1923cc V-Twin', power: '105 bhp', mileage: '15-18 kmpl', description: 'Ultimate touring machine with all features.', image: '/images/hd-ultra-limited.jpg' },
      { id: 'hd-fat-boy', name: 'Fat Boy 114', category: 'bike', type: 'Cruiser', price: 'â‚¹24-27 Lakh', engine: '1868cc V-Twin', power: '95 bhp', mileage: '16-20 kmpl', description: 'Iconic cruiser with solid disc wheels.', image: '/images/hd-fat-boy.jpg', featured: true },
      { id: 'hd-heritage-classic', name: 'Heritage Classic', category: 'bike', type: 'Cruiser', price: 'â‚¹22-25 Lakh', engine: '1868cc V-Twin', power: '95 bhp', mileage: '16-20 kmpl', description: 'Classic styling with modern reliability.', image: '/images/hd-heritage-classic.jpg' },
      { id: 'hd-breakout', name: 'Breakout 117', category: 'bike', type: 'Cruiser', price: 'â‚¹28-32 Lakh', engine: '1923cc V-Twin', power: '105 bhp', mileage: '15-18 kmpl', description: 'Drag styling with massive rear tire.', image: '/images/hd-breakout.jpg' },
      { id: 'hd-low-rider-s', name: 'Low Rider S', category: 'bike', type: 'Cruiser', price: 'â‚¹18-21 Lakh', engine: '1923cc V-Twin', power: '105 bhp', mileage: '15-18 kmpl', description: 'Performance cruiser with club style.', image: '/images/hd-low-rider-s.jpg' },
      { id: 'hd-street-bob', name: 'Street Bob 114', category: 'bike', type: 'Cruiser', price: 'â‚¹16-19 Lakh', engine: '1868cc V-Twin', power: '95 bhp', mileage: '16-20 kmpl', description: 'Minimalist bobber with big engine.', image: '/images/hd-street-bob.jpg' },
      { id: 'hd-sportster-s', name: 'Sportster S', category: 'bike', type: 'Cruiser', price: 'â‚¹16-18 Lakh', engine: '1252cc V-Twin', power: '121 bhp', mileage: '18-22 kmpl', description: 'Revolution Max powered modern Sportster.', image: '/images/hd-sportster-s.jpg', featured: true },
      { id: 'hd-nightster', name: 'Nightster', category: 'bike', type: 'Cruiser', price: 'â‚¹12-14 Lakh', engine: '975cc V-Twin', power: '90 bhp', mileage: '20-24 kmpl', description: 'Dark custom styling with Revolution Max.', image: '/images/hd-nightster.jpg' },
      { id: 'hd-pan-america', name: 'Pan America 1250', category: 'bike', type: 'Adventure', price: 'â‚¹18-22 Lakh', engine: '1252cc V-Twin', power: '150 bhp', mileage: '18-22 kmpl', description: 'Harley\'s first adventure motorcycle.', image: '/images/hd-pan-america.jpg', featured: true },
    ]
  },
  {
    id: 'mahindra',
    name: 'Mahindra',
    category: 'car',
    logo: '/images/brands/mahindra.svg',
    description: 'Indian automotive giant known for SUVs and commercial vehicles.',
    vehicles: [
      { id: 'mahindra-thar', name: 'Thar', category: 'car', type: 'SUV', price: 'â‚¹11-17 Lakh', engine: '2.0L Turbo/2.2L Diesel', power: '150 bhp', mileage: '12-15 kmpl', description: 'Iconic off-roader reborn for modern era.', image: '/images/mahindra-thar.jpg', featured: true },
      { id: 'mahindra-thar-roxx', name: 'Thar Roxx', category: 'car', type: 'SUV', price: 'â‚¹13-20 Lakh', engine: '2.0L Turbo/2.2L Diesel', power: '175 bhp', mileage: '12-15 kmpl', description: '5-door Thar with enhanced capability.', image: '/images/mahindra-thar-roxx.jpg', featured: true },
      { id: 'mahindra-scorpio-n', name: 'Scorpio N', category: 'car', type: 'SUV', price: 'â‚¹13-24 Lakh', engine: '2.0L Turbo/2.2L Diesel', power: '200 bhp', mileage: '12-15 kmpl', description: 'The big daddy of SUVs reinvented.', image: '/images/mahindra-scorpio-n.jpg', featured: true },
      { id: 'mahindra-scorpio-classic', name: 'Scorpio Classic', category: 'car', type: 'SUV', price: 'â‚¹13-16 Lakh', engine: '2.2L Diesel', power: '140 bhp', mileage: '15 kmpl', description: 'The original SUV that started it all.', image: '/images/mahindra-scorpio-classic.jpg' },
      { id: 'mahindra-xuv700', name: 'XUV700', category: 'car', type: 'SUV', price: 'â‚¹14-26 Lakh', engine: '2.0L Turbo/2.2L Diesel', power: '200 bhp', mileage: '12-16 kmpl', description: 'Tech-loaded SUV with ADAS features.', image: '/images/mahindra-xuv700.jpg', featured: true },
      { id: 'mahindra-xuv300', name: 'XUV300', category: 'car', type: 'SUV', price: 'â‚¹8-14 Lakh', engine: '1.2L Turbo/1.5L Diesel', power: '130 bhp', mileage: '17-20 kmpl', description: 'Compact SUV with 5-star safety rating.', image: '/images/mahindra-xuv300.jpg' },
      { id: 'mahindra-xuv400', name: 'XUV400', category: 'car', type: 'Electric', price: 'â‚¹16-19 Lakh', engine: 'Electric', power: '150 bhp', mileage: '375-456 km range', description: 'Mahindra\'s first electric SUV.', image: '/images/mahindra-xuv400.jpg' },
      { id: 'mahindra-bolero', name: 'Bolero', category: 'car', type: 'SUV', price: 'â‚¹10-12 Lakh', engine: '1.5L Diesel', power: '75 bhp', mileage: '16-18 kmpl', description: 'Rural India\'s favorite workhorse.', image: '/images/mahindra-bolero.jpg' },
      { id: 'mahindra-bolero-neo', name: 'Bolero Neo', category: 'car', type: 'SUV', price: 'â‚¹10-13 Lakh', engine: '1.5L Diesel', power: '100 bhp', mileage: '17 kmpl', description: 'Urban Bolero with modern features.', image: '/images/mahindra-bolero-neo.jpg' },
      { id: 'mahindra-marazzo', name: 'Marazzo', category: 'car', type: 'MPV', price: 'â‚¹14-17 Lakh', engine: '1.5L Diesel', power: '123 bhp', mileage: '17 kmpl', description: 'Premium MPV with car-like handling.', image: '/images/mahindra-marazzo.jpg' },
      { id: 'mahindra-kuv100', name: 'KUV100 NXT', category: 'car', type: 'SUV', price: 'â‚¹6-9 Lakh', engine: '1.2L Petrol', power: '83 bhp', mileage: '18 kmpl', description: 'Micro SUV with spacious 6-seat layout.', image: '/images/mahindra-kuv100.jpg' },
      { id: 'mahindra-be-6', name: 'BE 6', category: 'car', type: 'Electric', price: 'â‚¹19-23 Lakh', engine: 'Electric', power: '230 bhp', mileage: '550 km range', description: 'Born Electric SUV with coupe styling.', image: '/images/mahindra-be-6.jpg', featured: true },
      { id: 'mahindra-xev-9e', name: 'XEV 9e', category: 'car', type: 'Electric', price: 'â‚¹22-26 Lakh', engine: 'Electric', power: '250 bhp', mileage: '450 km range', description: 'Premium electric SUV from Mahindra.', image: '/images/mahindra-xev-9e.jpg' },
    ]
  },
  {
    id: 'tvs',
    name: 'TVS',
    category: 'bike',
    logo: '/images/brands/tvs.svg',
    description: 'Indian two-wheeler giant with performance and commuter bikes.',
    vehicles: [
      { id: 'tvs-apache-rr310', name: 'Apache RR 310', category: 'bike', type: 'Sports', price: 'â‚¹2.7-3 Lakh', engine: '312cc Single', power: '34 bhp', mileage: '30-35 kmpl', description: 'TVS flagship with BMW-derived engine.', image: '/images/tvs-apache-rr310.jpg', featured: true },
      { id: 'tvs-apache-rtr-310', name: 'Apache RTR 310', category: 'bike', type: 'Naked', price: 'â‚¹2.4-2.7 Lakh', engine: '312cc Single', power: '35 bhp', mileage: '30-35 kmpl', description: 'Naked streetfighter with aggressive styling.', image: '/images/tvs-apache-rtr-310.jpg' },
      { id: 'tvs-apache-rtr-200', name: 'Apache RTR 200 4V', category: 'bike', type: 'Naked', price: 'â‚¹1.4-1.6 Lakh', engine: '197cc Single', power: '21 bhp', mileage: '35-40 kmpl', description: 'Race-derived technology in 200cc segment.', image: '/images/tvs-apache-rtr-200.jpg' },
      { id: 'tvs-apache-rtr-160', name: 'Apache RTR 160 4V', category: 'bike', type: 'Naked', price: 'â‚¹1.2-1.4 Lakh', engine: '159cc Single', power: '17 bhp', mileage: '40-45 kmpl', description: 'India\'s best-selling performance 160cc.', image: '/images/tvs-apache-rtr-160.jpg' },
      { id: 'tvs-raider', name: 'Raider 125', category: 'bike', type: 'Naked', price: 'â‚¹95,000-1.1 Lakh', engine: '125cc Single', power: '11 bhp', mileage: '55-60 kmpl', description: 'Stylish 125cc with segment-first features.', image: '/images/tvs-raider.jpg' },
      { id: 'tvs-star-city-plus', name: 'Star City Plus', category: 'bike', type: 'Commuter', price: 'â‚¹75,000-90,000', engine: '109cc Single', power: '8 bhp', mileage: '65-70 kmpl', description: 'India\'s most fuel-efficient motorcycle.', image: '/images/tvs-star-city-plus.jpg' },
      { id: 'tvs-sport', name: 'Sport', category: 'bike', type: 'Commuter', price: 'â‚¹65,000-80,000', engine: '109cc Single', power: '8 bhp', mileage: '65-70 kmpl', description: 'Affordable commuter with great mileage.', image: '/images/tvs-sport.jpg' },
      { id: 'tvs-jupiter', name: 'Jupiter', category: 'bike', type: 'Scooter', price: 'â‚¹75,000-95,000', engine: '110cc Single', power: '8 bhp', mileage: '55-60 kmpl', description: 'India\'s favorite family scooter.', image: '/images/tvs-jupiter.jpg', featured: true },
      { id: 'tvs-jupiter-125', name: 'Jupiter 125', category: 'bike', type: 'Scooter', price: 'â‚¹85,000-1.05 Lakh', engine: '125cc Single', power: '8 bhp', mileage: '50-55 kmpl', description: 'Premium 125cc scooter with large boot.', image: '/images/tvs-jupiter-125.jpg' },
      { id: 'tvs-ntorq', name: 'NTorq 125', category: 'bike', type: 'Scooter', price: 'â‚¹85,000-1.1 Lakh', engine: '125cc Single', power: '10 bhp', mileage: '40-45 kmpl', description: 'Tech-loaded scooter with smart features.', image: '/images/tvs-ntorq.jpg', featured: true },
      { id: 'tvs-iqube', name: 'iQube', category: 'bike', type: 'Electric', price: 'â‚¹1.2-1.6 Lakh', engine: 'Electric', power: '4.4 kW', mileage: '100-145 km range', description: 'TVS electric scooter with connected features.', image: '/images/tvs-iqube.jpg' },
      { id: 'tvs-xl100', name: 'XL100', category: 'bike', type: 'Moped', price: 'â‚¹45,000-55,000', engine: '99cc Single', power: '4 bhp', mileage: '55-60 kmpl', description: 'India\'s trusted workhorse moped.', image: '/images/tvs-xl100.jpg' },
      { id: 'tvs-ronin', name: 'Ronin', category: 'bike', type: 'Retro', price: 'â‚¹1.5-1.8 Lakh', engine: '225cc Single', power: '21 bhp', mileage: '35-40 kmpl', description: 'Modern retro with scrambler styling.', image: '/images/tvs-ronin.jpg' },
    ]
  },
  {
    id: 'ford',
    name: 'Ford',
    category: 'car',
    logo: '/images/brands/ford.svg',
    description: 'American automotive brand known for performance and utility vehicles.',
    vehicles: [
      { id: 'ford-mustang', name: 'Mustang', category: 'car', type: 'Sports', price: 'â‚¹75-85 Lakh', engine: '5.0L V8', power: '450 bhp', mileage: '8-10 kmpl', description: 'The original American muscle car.', image: '/images/ford-mustang.jpg', featured: true },
      { id: 'ford-mustang-mach-e', name: 'Mustang Mach-E', category: 'car', type: 'Electric', price: 'â‚¹70-80 Lakh', engine: 'Electric', power: '346 bhp', mileage: '450 km range', description: 'Electric Mustang SUV with performance.', image: '/images/ford-mustang-mach-e.jpg' },
      { id: 'ford-ecosport', name: 'EcoSport', category: 'car', type: 'SUV', price: 'â‚¹8-12 Lakh', engine: '1.0L Turbo/1.5L Diesel', power: '125 bhp', mileage: '15-21 kmpl', description: 'Compact SUV with fun-to-drive dynamics.', image: '/images/ford-ecosport.jpg' },
      { id: 'ford-endeavour', name: 'Endeavour', category: 'car', type: 'SUV', price: 'â‚¹33-38 Lakh', engine: '2.0L Diesel', power: '170 bhp', mileage: '12-14 kmpl', description: 'Full-size SUV with true 4x4 capability.', image: '/images/ford-endeavour.jpg', featured: true },
      { id: 'ford-figo', name: 'Figo', category: 'car', type: 'Hatchback', price: 'â‚¹6-9 Lakh', engine: '1.2L Petrol/1.5L Diesel', power: '100 bhp', mileage: '18-24 kmpl', description: 'Fun-to-drive hatchback with great handling.', image: '/images/ford-figo.jpg' },
      { id: 'ford-aspire', name: 'Aspire', category: 'car', type: 'Sedan', price: 'â‚¹7-10 Lakh', engine: '1.2L Petrol/1.5L Diesel', power: '100 bhp', mileage: '18-24 kmpl', description: 'Compact sedan with sporty dynamics.', image: '/images/ford-aspire.jpg' },
      { id: 'ford-freestyle', name: 'Freestyle', category: 'car', type: 'Crossover', price: 'â‚¹7-9 Lakh', engine: '1.2L Petrol', power: '96 bhp', mileage: '18-20 kmpl', description: 'Cross-hatch with SUV-like stance.', image: '/images/ford-freestyle.jpg' },
    ]
  },
  {
    id: 'mercedes-benz',
    name: 'Mercedes-Benz',
    category: 'car',
    logo: '/images/brands/mercedes-benz.svg',
    description: 'German luxury automotive brand with premium vehicles.',
    vehicles: [
      { id: 'mercedes-a-class', name: 'A-Class Limousine', category: 'car', type: 'Sedan', price: 'â‚¹42-48 Lakh', engine: '2.0L Turbo', power: '190 bhp', mileage: '16-18 kmpl', description: 'Entry luxury sedan with premium features.', image: '/images/mercedes-a-class.jpg' },
      { id: 'mercedes-c-class', name: 'C-Class', category: 'car', type: 'Sedan', price: 'â‚¹55-65 Lakh', engine: '2.0L Turbo', power: '204 bhp', mileage: '15-17 kmpl', description: 'The benchmark compact luxury sedan.', image: '/images/mercedes-c-class.jpg', featured: true },
      { id: 'mercedes-e-class', name: 'E-Class', category: 'car', type: 'Sedan', price: 'â‚¹75-90 Lakh', engine: '2.0L Turbo', power: '197 bhp', mileage: '14-16 kmpl', description: 'Executive luxury sedan with best-in-class comfort.', image: '/images/mercedes-e-class.jpg', featured: true },
      { id: 'mercedes-s-class', name: 'S-Class', category: 'car', type: 'Sedan', price: 'â‚¹1.6-2 Crore', engine: '3.0L Turbo', power: '367 bhp', mileage: '12-14 kmpl', description: 'The best car in the world.', image: '/images/mercedes-s-class.jpg', featured: true },
      { id: 'mercedes-gla', name: 'GLA', category: 'car', type: 'SUV', price: 'â‚¹48-55 Lakh', engine: '2.0L Turbo', power: '190 bhp', mileage: '15-17 kmpl', description: 'Compact luxury SUV with youthful appeal.', image: '/images/mercedes-gla.jpg' },
      { id: 'mercedes-glc', name: 'GLC', category: 'car', type: 'SUV', price: 'â‚¹65-75 Lakh', engine: '2.0L Turbo', power: '258 bhp', mileage: '14-16 kmpl', description: 'Mid-size luxury SUV with great dynamics.', image: '/images/mercedes-glc.jpg', featured: true },
      { id: 'mercedes-gle', name: 'GLE', category: 'car', type: 'SUV', price: 'â‚¹95-1.2 Crore', engine: '3.0L Turbo', power: '367 bhp', mileage: '12-14 kmpl', description: 'Premium luxury SUV with air suspension.', image: '/images/mercedes-gle.jpg' },
      { id: 'mercedes-gls', name: 'GLS', category: 'car', type: 'SUV', price: 'â‚¹1.2-1.6 Crore', engine: '3.0L Turbo', power: '367 bhp', mileage: '11-13 kmpl', description: 'S-Class of SUVs with 7-seat luxury.', image: '/images/mercedes-gls.jpg' },
      { id: 'mercedes-g-class', name: 'G-Class', category: 'car', type: 'SUV', price: 'â‚¹2.5-3 Crore', engine: '4.0L V8', power: '585 bhp', mileage: '8-10 kmpl', description: 'Iconic luxury off-roader.', image: '/images/mercedes-g-class.jpg', featured: true },
      { id: 'mercedes-amg-gt', name: 'AMG GT', category: 'car', type: 'Sports', price: 'â‚¹2.5-3.5 Crore', engine: '4.0L V8', power: '585 bhp', mileage: '8-10 kmpl', description: 'Mercedes-AMG flagship sports car.', image: '/images/mercedes-amg-gt.jpg' },
      { id: 'mercedes-eqs', name: 'EQS', category: 'car', type: 'Electric', price: 'â‚¹1.5-2 Crore', engine: 'Electric', power: '523 bhp', mileage: '700 km range', description: 'Electric luxury sedan with Hyperscreen.', image: '/images/mercedes-eqs.jpg' },
      { id: 'mercedes-eqe', name: 'EQE', category: 'car', type: 'Electric', price: 'â‚¹1-1.3 Crore', engine: 'Electric', power: '408 bhp', mileage: '550 km range', description: 'Electric executive sedan.', image: '/images/mercedes-eqe.jpg' },
    ]
  },
  {
    id: 'bmw-cars',
    name: 'BMW',
    category: 'car',
    logo: '/images/brands/bmw.svg',
    description: 'German luxury brand known for driving pleasure and premium vehicles.',
    vehicles: [
      { id: 'bmw-2-series', name: '2 Series Gran Coupe', category: 'car', type: 'Sedan', price: 'â‚¹42-48 Lakh', engine: '2.0L Turbo', power: '190 bhp', mileage: '15-18 kmpl', description: 'Entry BMW sedan with coupe styling.', image: '/images/bmw-2-series.jpg' },
      { id: 'bmw-3-series', name: '3 Series', category: 'car', type: 'Sedan', price: 'â‚¹55-65 Lakh', engine: '2.0L Turbo', power: '258 bhp', mileage: '14-17 kmpl', description: 'The ultimate driving machine.', image: '/images/bmw-3-series.jpg', featured: true },
      { id: 'bmw-5-series', name: '5 Series', category: 'car', type: 'Sedan', price: 'â‚¹68-78 Lakh', engine: '2.0L/3.0L Turbo', power: '340 bhp', mileage: '13-16 kmpl', description: 'Executive sedan with perfect balance.', image: '/images/bmw-5-series.jpg', featured: true },
      { id: 'bmw-7-series', name: '7 Series', category: 'car', type: 'Sedan', price: 'â‚¹1.5-2 Crore', engine: '3.0L Turbo', power: '381 bhp', mileage: '12-14 kmpl', description: 'Luxury flagship with theater screen.', image: '/images/bmw-7-series.jpg', featured: true },
      { id: 'bmw-x1', name: 'X1', category: 'car', type: 'SUV', price: 'â‚¹48-55 Lakh', engine: '2.0L Turbo', power: '192 bhp', mileage: '15-18 kmpl', description: 'Compact luxury SUV with great practicality.', image: '/images/bmw-x1.jpg' },
      { id: 'bmw-x3', name: 'X3', category: 'car', type: 'SUV', price: 'â‚¹68-78 Lakh', engine: '2.0L Turbo', power: '252 bhp', mileage: '14-16 kmpl', description: 'Mid-size luxury SUV with sporty handling.', image: '/images/bmw-x3.jpg', featured: true },
      { id: 'bmw-x5', name: 'X5', category: 'car', type: 'SUV', price: 'â‚¹95-1.1 Crore', engine: '3.0L Turbo', power: '340 bhp', mileage: '12-14 kmpl', description: 'Premium luxury SUV with commanding presence.', image: '/images/bmw-x5.jpg' },
      { id: 'bmw-x7', name: 'X7', category: 'car', type: 'SUV', price: 'â‚¹1.2-1.5 Crore', engine: '3.0L Turbo', power: '400 bhp', mileage: '11-13 kmpl', description: '7-seat luxury flagship SUV.', image: '/images/bmw-x7.jpg' },
      { id: 'bmw-xm', name: 'XM', category: 'car', type: 'SUV', price: 'â‚¹2.6-3 Crore', engine: '4.4L V8 Hybrid', power: '653 bhp', mileage: '60 km electric range', description: 'M Performance hybrid SUV.', image: '/images/bmw-xm.jpg', featured: true },
      { id: 'bmw-m4', name: 'M4 Competition', category: 'car', type: 'Sports', price: 'â‚¹1.5-1.8 Crore', engine: '3.0L Turbo', power: '510 bhp', mileage: '10-12 kmpl', description: 'High-performance coupe with M DNA.', image: '/images/bmw-m4.jpg' },
      { id: 'bmw-m5', name: 'M5 Competition', category: 'car', type: 'Sports', price: 'â‚¹1.8-2.1 Crore', engine: '4.4L V8', power: '625 bhp', mileage: '9-11 kmpl', description: 'Super sedan with track performance.', image: '/images/bmw-m5.jpg', featured: true },
      { id: 'bmw-ix', name: 'iX', category: 'car', type: 'Electric', price: 'â‚¹1.2-1.4 Crore', engine: 'Electric', power: '523 bhp', mileage: '600 km range', description: 'BMW\'s flagship electric SUV.', image: '/images/bmw-ix.jpg' },
      { id: 'bmw-i4', name: 'i4', category: 'car', type: 'Electric', price: 'â‚¹70-80 Lakh', engine: 'Electric', power: '340 bhp', mileage: '500 km range', description: 'Electric Gran Coupe with M Performance.', image: '/images/bmw-i4.jpg' },
      { id: 'bmw-i7', name: 'i7', category: 'car', type: 'Electric', price: 'â‚¹2-2.3 Crore', engine: 'Electric', power: '544 bhp', mileage: '625 km range', description: 'Electric luxury flagship with theater screen.', image: '/images/bmw-i7.jpg' },
    ]
  },
];

export const getBrandById = (id: string): Brand | undefined => {
  return brands.find(brand => brand.id === id);
};

export const getVehicleById = (brandId: string, vehicleId: string): Vehicle | undefined => {
  const brand = getBrandById(brandId);
  return brand?.vehicles.find(vehicle => vehicle.id === vehicleId);
};

export const getFeaturedVehicles = (): { brand: Brand; vehicle: Vehicle }[] => {
  const featured: { brand: Brand; vehicle: Vehicle }[] = [];
  brands.forEach(brand => {
    brand.vehicles.forEach(vehicle => {
      if (vehicle.featured) {
        featured.push({ brand, vehicle });
      }
    });
  });
  return featured.slice(0, 8);
};

export const getVehiclesByCategory = (category: 'car' | 'bike'): Vehicle[] => {
  const vehicles: Vehicle[] = [];
  brands.forEach(brand => {
    if (brand.category === category || brand.category === 'both') {
      vehicles.push(...brand.vehicles.filter(v => v.category === category));
    }
  });
  return vehicles;
};
