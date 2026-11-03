
import dotenv from 'dotenv';
import cors from 'cors';
import express, {
  type NextFunction,
  type Request,
  type Response
} from 'express';
import { mkdirSync, writeFileSync } from 'node:fs';
import { randomBytes } from 'node:crypto';
import { resolve } from 'node:path';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import {
  ObjectId,
  type Collection,
  type Document
} from 'mongodb';
import { connectDB } from '../config/db.js';
import { createBookingRouter } from './bookingRoutes.js';
import { createFavoritesRouter } from './favoritesRoutes.js';
import { createMessageRouter } from './messageRoutes.js';
import { createShowroomRouter } from './showroomRoutes.js';
import { createCompanySettingsRouter } from './companySettingsRoutes.js';
dotenv.config({ path: ['.env.local', '.env'] });

type Role = 'SUPER_ADMIN' | 'COMPANY_ADMIN' | 'CUSTOMER';

type AuthenticatedRequest = Request & {
  user?: {
    id: string;
    email: string;
    role: Role;
  };
  dbUser?: UserDoc;
};

interface UserDoc {
  _id: ObjectId;
  name: string;
  email: string;
  phone: string;
  passwordHash: string;
  role: Role;
  companyId: ObjectId | null;
  createdAt: Date;
}

interface CompanyDoc {
  _id: ObjectId;
  name: string;
  logo: string;
  description: string;
  location: string;
  status: 'ACTIVE' | 'INACTIVE';
}

interface VehicleDoc {
  _id: ObjectId;
  companyId: ObjectId;
  name: string;
  category: 'car' | 'bike';
  type: string;
  price: string;
  engine: string;
  mileage: string;
  transmission: string;
  fuelType: string;
  seatingCapacity: number;
  image: string;
  description: string;
  trialAvailable: boolean;
  createdAt: Date;
}

const port = Number(process.env.API_PORT || 3001);
const jwtSecret = process.env.JWT_SECRET;

if (!jwtSecret) {
  throw new Error('JWT_SECRET is required for the local API');
}

const db = await connectDB();

const uploadDir = resolve(
  process.env.UPLOAD_DIR || './data/uploads'
);

mkdirSync(uploadDir, { recursive: true });

const users: Collection<UserDoc> =
  db.collection<UserDoc>('users');

const companies: Collection<CompanyDoc> =
  db.collection<CompanyDoc>('companies');

const vehicles: Collection<VehicleDoc> =
  db.collection<VehicleDoc>('vehicles');

const caseInsensitive = {
  locale: 'en',
  strength: 2
} as const;

await users.createIndex(
  { email: 1 },
  {
    unique: true,
    collation: caseInsensitive
  }
);

await companies.createIndex(
  { name: 1 },
  {
    unique: true,
    collation: caseInsensitive
  }
);

await vehicles.createIndex({ companyId: 1 });
await users.createIndex({ companyId: 1 });

const isDuplicate = (error: unknown) =>
  typeof error === 'object' &&
  error !== null &&
  (error as { code?: number }).code === 11000;

// ---------- Initial Company Data ----------

const seedCompanies = [
  [
    'Toyota',
    '/images/brands/toyota.svg',
    'Reliable cars for everyday confidence.'
  ],
  [
    'Honda',
    '/images/brands/honda.svg',
    'Engineering-led cars and motorcycles.'
  ],
  [
    'Royal Enfield',
    '/images/brands/royal-enfield.svg',
    'Iconic motorcycles with character.'
  ],
  [
    'Yamaha',
    '/images/brands/yamaha.svg',
    'Performance motorcycles for every road.'
  ],
  [
    'BMW',
    '/images/brands/bmw.svg',
    'Premium cars and motorcycles.'
  ],
  [
    'Mahindra',
    '/images/brands/mahindra.svg',
    'Purposeful SUVs built for India.'
  ]
] as const;

for (const [name, logo, description] of seedCompanies) {
  await companies.updateOne(
    { name },
    {
      $setOnInsert: {
        name,
        logo,
        description,
        location: '',
        status: 'ACTIVE'
      }
    },
    {
      upsert: true,
      collation: caseInsensitive
    }
  );
}

// ---------- Initial Vehicle Data ----------

if ((await vehicles.estimatedDocumentCount()) === 0) {
  const seedVehicles = [
    [
      'Toyota', 'Camry', 'car', 'Sedan',
      '₹45-50 Lakh', '2.5L Hybrid', '23 kmpl',
      'Automatic', 'Hybrid', 5,
      '/images/toyota-camry.jpg',
      'A refined hybrid sedan for calm, comfortable miles.'
    ],
    [
      'Honda', 'City', 'car', 'Sedan',
      '₹12-18 Lakh', '1.5L Petrol', '18-24 kmpl',
      'Automatic', 'Petrol', 5,
      '/images/honda-city.jpg',
      'A familiar, practical sedan with a premium cabin.'
    ],
    [
      'Royal Enfield', 'Classic 350', 'bike', 'Retro',
      '₹1.9-2.3 Lakh', '349cc Single', '35-40 kmpl',
      'Manual', 'Petrol', 2,
      '/images/re-classic-350.jpg',
      'A relaxed modern classic made for city rides.'
    ],
    [
      'Yamaha', 'MT-09', 'bike', 'Naked',
      '₹9-10 Lakh', '890cc Triple', '18-22 kmpl',
      'Manual', 'Petrol', 2,
      '/images/yamaha-mt-09.jpg',
      'A sharp, playful street bike with serious pace.'
    ],
    [
      'BMW', 'S 1000 RR', 'bike', 'Superbike',
      '₹20-24 Lakh', '999cc Inline-4', '12-16 kmpl',
      'Manual', 'Petrol', 2,
      '/images/bmw-s1000rr.jpg',
      'A focused superbike experience from BMW Motorrad.'
    ],
    [
      'Mahindra', 'Thar', 'car', 'SUV',
      '₹11-17 Lakh', '2.0L Turbo', '12-15 kmpl',
      'Automatic', 'Petrol', 4,
      '/images/mahindra-thar.jpg',
      'A capable SUV with a clear sense of adventure.'
    ]
  ] as const;

  for (
    const [
      brand, name, category, type, price,
      engine, mileage, transmission, fuelType,
      seatingCapacity, image, description
    ] of seedVehicles
  ) {
    const company = await companies.findOne(
      { name: brand },
      { collation: caseInsensitive }
    );

    if (company) {
      await vehicles.insertOne({
        _id: new ObjectId(),
        companyId: company._id,
        name,
        category,
        type,
        price,
        engine,
        mileage,
        transmission,
        fuelType,
        seatingCapacity,
        image,
        description,
        trialAvailable: true,
        createdAt: new Date()
      });
    }
  }
}

// ---------- Super Administrator ----------

const adminEmail = process.env.SUPER_ADMIN_EMAIL
  ?.trim()
  .toLowerCase();

const adminPassword = process.env.SUPER_ADMIN_PASSWORD;
console.log('Admin email configured:', adminEmail);
console.log('Admin password configured:', Boolean(adminPassword));

if (
  adminEmail &&
  adminPassword &&
  !(await users.findOne(
    { email: adminEmail },
    { collation: caseInsensitive }
  ))
) {
  await users.insertOne({
    _id: new ObjectId(),
    name: 'Platform Administrator',
    email: adminEmail,
    phone: '',
    passwordHash: bcrypt.hashSync(adminPassword, 12),
    role: 'SUPER_ADMIN',
    companyId: null,
    createdAt: new Date()
  });
}

// ---------- Express Application ----------

const app = express();

const allowedOrigins = (
  process.env.CORS_ORIGIN ||
  'http://localhost:5173,http://127.0.0.1:5173'
)
  .split(',')
  .map(origin => origin.trim());

app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      return callback(null, true);
    }

    return callback(
      new Error('Origin is not allowed by CORS')
    );
  }
}));

app.use(express.json({ limit: '2mb' }));

app.use(
  '/uploads',
  (_request, response, next) => {
    response.setHeader(
      'X-Content-Type-Options',
      'nosniff'
    );
    next();
  },
  express.static(uploadDir)
);

type Handler = (
  request: AuthenticatedRequest,
  response: Response
) => Promise<unknown> | unknown;

const h = (handler: Handler) =>
  (
    request: Request,
    response: Response,
    next: NextFunction
  ) => {
    Promise.resolve(
      handler(request as AuthenticatedRequest, response)
    ).catch(next);
  };

const toId = (value: unknown): ObjectId | null =>
  typeof value === 'string' &&
  /^[0-9a-f]{24}$/i.test(value)
    ? new ObjectId(value)
    : null;

const text = (value: unknown, max: number) =>
  typeof value === 'string'
    ? value.trim().slice(0, max)
    : '';

const slug = (name: string) =>
  name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');

const publicUser = (user: UserDoc) => ({
  id: String(user._id),
  name: user.name,
  email: user.email,
  phone: user.phone,
  role: user.role,
  companyId: user.companyId
    ? String(user.companyId)
    : null
});

const issueToken = (user: UserDoc) =>
  jwt.sign(
    {
      sub: String(user._id),
      email: user.email,
      role: user.role
    },
    jwtSecret,
    { expiresIn: '7d' }
  );

const requireAuth = (
  request: AuthenticatedRequest,
  response: Response,
  next: NextFunction
) => {
  const token = request.headers.authorization
    ?.replace(/^Bearer\s+/i, '');

  if (!token) {
    return response.status(401).json({
      error: 'Authentication required'
    });
  }

  try {
    const payload = jwt.verify(token, jwtSecret) as {
      sub: string;
      email: string;
      role: Role;
    };

    request.user = {
      id: String(payload.sub),
      email: payload.email,
      role: payload.role
    };

    return next();
  } catch {
    return response.status(401).json({
      error: 'Invalid or expired session'
    });
  }
};

const requireRole = (...roles: Role[]) =>
  (
    request: AuthenticatedRequest,
    response: Response,
    next: NextFunction
  ) =>
    requireAuth(request, response, () => {
      const id = toId(request.user?.id);

      void (
        id
          ? users.findOne({ _id: id })
          : Promise.resolve(null)
      )
        .then(user => {
          if (!user || !roles.includes(user.role)) {
            return response.status(403).json({
              error: 'You do not have access to this resource.'
            });
          }

          request.dbUser = user;
          return next();
        })
        .catch(next);
    });

// ---------- Health Check ----------

app.get('/health', h(async (_request, response) => {
  await db.command({ ping: 1 });

  return response.json({
    ok: true,
    service: 'trial-api',
    database: 'mongodb'
  });
}));

// ---------- Authentication ----------

app.post('/api/auth/signup', h(async (request, response) => {
  const body = (request.body ?? {}) as Record<string, unknown>;

  const name = text(body.name, 80);
  const email = text(body.email, 120).toLowerCase();
  const phone = text(body.phone, 30);

  const password =
    typeof body.password === 'string'
      ? body.password
      : '';

  if (
    !name ||
    !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) ||
    password.length < 6
  ) {
    return response.status(400).json({
      error: 'Name, a valid email, and a password of at least 6 characters are required.'
    });
  }

  try {
    const result = await users.insertOne({
      _id: new ObjectId(),
      name,
      email,
      phone,
      passwordHash: bcrypt.hashSync(password, 12),
      role: 'CUSTOMER',
      companyId: null,
      createdAt: new Date()
    });

    return response.status(201).json({
      id: String(result.insertedId)
    });
  } catch (error) {
    if (isDuplicate(error)) {
      return response.status(409).json({
        error: 'An account with that email already exists.'
      });
    }

    throw error;
  }
}));

app.post('/api/auth/login', h(async (request, response) => {
  const body = (request.body ?? {}) as {
    email?: unknown;
    password?: unknown;
    role?: unknown;
  };

  const email =
    typeof body.email === 'string'
      ? body.email.trim().toLowerCase()
      : '';

  const user = email
    ? await users.findOne(
        { email },
        { collation: caseInsensitive }
      )
    : null;

  if (
    !user ||
    typeof body.password !== 'string' ||
    !bcrypt.compareSync(
      body.password,
      user.passwordHash
    )
  ) {
    return response.status(401).json({
      error: 'Invalid email or password',
      code: 'INVALID_CREDENTIALS'
    });
  }


  return response.json({
    token: issueToken(user),
    user: publicUser(user)
  });
}));

app.get(
  '/api/auth/me',
  requireAuth,
  h(async (request, response) => {
    const id = toId(request.user?.id);

    const user = id
      ? await users.findOne({ _id: id })
      : null;

    if (!user) {
      return response.status(404).json({
        error: 'Profile not found'
      });
    }

    return response.json(publicUser(user));
  })
);

// ---------- Public Companies ----------

const companyPublic = (company: CompanyDoc) => ({
  id: String(company._id),
  name: company.name,
  logo: company.logo,
  description: company.description,
  location: company.location,
  status: company.status
});

app.get('/api/companies', h(async (_request, response) => {
  const rows = await companies
    .find({ status: 'ACTIVE' })
    .collation(caseInsensitive)
    .sort({ name: 1 })
    .toArray();

  return response.json(rows.map(companyPublic));
}));

// ---------- Public Vehicles ----------

const vehicleView = (vehicle: VehicleDoc) => ({
  id: String(vehicle._id),
  companyId: String(vehicle.companyId),
  name: vehicle.name,
  category: vehicle.category,
  type: vehicle.type,
  price: vehicle.price,
  engine: vehicle.engine,
  mileage: vehicle.mileage,
  transmission: vehicle.transmission,
  fuelType: vehicle.fuelType,
  seatingCapacity: vehicle.seatingCapacity,
  image: vehicle.image,
  description: vehicle.description,
  availableForTrial: vehicle.trialAvailable
});

app.get('/api/vehicles', h(async (request, response) => {
  const match: Document = { trialAvailable: true };

  if (typeof request.query.companyId === 'string') {
    const id = toId(request.query.companyId);

    if (!id) return response.json([]);

    match.companyId = id;
  }

  if (
    request.query.category === 'car' ||
    request.query.category === 'bike'
  ) {
    match.category = request.query.category;
  }

  const rows = await vehicles.aggregate<
    VehicleDoc & { company: CompanyDoc }
  >([
    { $match: match },
    {
      $lookup: {
        from: 'companies',
        localField: 'companyId',
        foreignField: '_id',
        as: 'company'
      }
    },
    { $unwind: '$company' },
    { $match: { 'company.status': 'ACTIVE' } },
    { $sort: { createdAt: -1 } }
  ]).toArray();

  return response.json(
    rows.map(row => ({
      ...vehicleView(row),
      brandId: slug(row.company.name),
      brandName: row.company.name,
      logo: row.company.logo
    }))
  );
}));

// ---------- Image Upload Validation ----------

const resolveImage = (value: unknown): string | null => {
  if (typeof value !== 'string' || !value.trim()) {
    return '';
  }

  const input = value.trim();

  const dataUrl = input.match(
    /^data:image\/(png|jpeg|webp);base64,([A-Za-z0-9+/=]+)$/
  );

  if (dataUrl) {
    const buffer = Buffer.from(dataUrl[2], 'base64');

    if (
      buffer.length === 0 ||
      buffer.length > 800 * 1024
    ) {
      return null;
    }

    const name =
      `${randomBytes(12).toString('hex')}.` +
      `${dataUrl[1] === 'jpeg' ? 'jpg' : dataUrl[1]}`;

    writeFileSync(resolve(uploadDir, name), buffer);

    return `/uploads/${name}`;
  }

  if (
    /^https?:\/\/[^\s]+$/i.test(input) &&
    input.length <= 500
  ) {
    return input;
  }

  if (
    /^\/(images|uploads)\/[\w./-]+$/.test(input) &&
    !input.includes('..')
  ) {
    return input;
  }

  return null;
};

// ---------- Vehicle Validation ----------

const parseVehicle = (
  body: Record<string, unknown>,
  partial: boolean
) => {
  const out: Record<
    string,
    string | number | boolean
  > = {};

  const errors: string[] = [];

  const required = (
    key: string,
    raw: unknown,
    max: number
  ) => {
    const value = text(raw, max);

    if (value) {
      out[key] = value;
    } else if (!partial || raw !== undefined) {
      errors.push(`${key} is required`);
    }
  };

  const optional = (
    key: string,
    raw: unknown,
    max: number
  ) => {
    if (raw !== undefined) {
      out[key] = text(raw, max);
    }
  };

  required('name', body.name, 80);
  required('type', body.type, 40);
  required('price', body.price, 40);

  if (
    body.category === 'car' ||
    body.category === 'bike'
  ) {
    out.category = body.category;
  } else if (
    !partial ||
    body.category !== undefined
  ) {
    errors.push('category must be car or bike');
  }

  optional('engine', body.engine, 60);
  optional('mileage', body.mileage, 40);
  optional('transmission', body.transmission, 40);
  optional('fuelType', body.fuelType, 40);
  optional('description', body.description, 600);

  if (body.seatingCapacity !== undefined) {
    const seats = Number(body.seatingCapacity);

    if (
      !Number.isInteger(seats) ||
      seats < 1 ||
      seats > 12
    ) {
      errors.push('seatingCapacity must be 1-12');
    } else {
      out.seatingCapacity = seats;
    }
  }

  if (body.availableForTrial !== undefined) {
    out.trialAvailable = Boolean(body.availableForTrial);
  }

  if (body.image !== undefined) {
    const image = resolveImage(body.image);

    if (image === null) {
      errors.push(
        'image must be an https URL, an /images path, or a png/jpeg/webp under 800KB'
      );
    } else {
      out.image = image;
    }
  }

  return { out, errors };
};

// ---------- Company Admin ----------

const companyOnly = requireRole('COMPANY_ADMIN');

const ownCompany = (
  request: AuthenticatedRequest,
  response: Response
) => {
  const companyId = request.dbUser?.companyId;

  if (!companyId) {
    response.status(403).json({
      error: 'Your account is not linked to a company yet. Ask the platform administrator.'
    });

    return null;
  }

  return companyId;
};

app.get(
  '/api/company/vehicles',
  companyOnly,
  h(async (request, response) => {
    const companyId = ownCompany(request, response);

    if (!companyId) return;

    const rows = await vehicles
      .find({ companyId })
      .sort({ createdAt: -1 })
      .toArray();

    return response.json(rows.map(vehicleView));
  })
);

app.post(
  '/api/company/vehicles',
  companyOnly,
  h(async (request, response) => {
    const companyId = ownCompany(request, response);

    if (!companyId) return;

    const { out, errors } = parseVehicle(
      (request.body ?? {}) as Record<string, unknown>,
      false
    );

    if (errors.length) {
      return response.status(400).json({
        error: errors.join('; ')
      });
    }

    const doc = {
      engine: '',
      mileage: '',
      transmission: '',
      fuelType: '',
      seatingCapacity: 2,
      image: '',
      description: '',
      trialAvailable: true,
      ...out,
      _id: new ObjectId(),
      companyId,
      createdAt: new Date()
    } as VehicleDoc;

    await vehicles.insertOne(doc);

    return response.status(201).json(
      vehicleView(doc)
    );
  })
);

app.put(
  '/api/company/vehicles/:id',
  companyOnly,
  h(async (request, response) => {
    const companyId = ownCompany(request, response);

    if (!companyId) return;

    const id = toId(request.params.id);

    const { out, errors } = parseVehicle(
      (request.body ?? {}) as Record<string, unknown>,
      true
    );

    if (errors.length) {
      return response.status(400).json({
        error: errors.join('; ')
      });
    }

    if (!Object.keys(out).length) {
      return response.status(400).json({
        error: 'Nothing to update.'
      });
    }

    const updated = id
      ? await vehicles.findOneAndUpdate(
          { _id: id, companyId },
          { $set: out },
          { returnDocument: 'after' }
        )
      : null;

    if (!updated) {
      return response.status(404).json({
        error: 'Vehicle not found.'
      });
    }

    return response.json(vehicleView(updated));
  })
);

app.delete(
  '/api/company/vehicles/:id',
  companyOnly,
  h(async (request, response) => {
    const companyId = ownCompany(request, response);

    if (!companyId) return;

    const id = toId(request.params.id);

    const result = id
      ? await vehicles.deleteOne({
          _id: id,
          companyId
        })
      : { deletedCount: 0 };

    if (!result.deletedCount) {
      return response.status(404).json({
        error: 'Vehicle not found.'
      });
    }

    return response.status(204).end();
  })
);

// ---------- Super Admin ----------

const adminOnly = requireRole('SUPER_ADMIN');

const adminCompanies = async (onlyId?: ObjectId) => {
  const rows = await companies.aggregate<
    CompanyDoc & {
      vehicleCount: number;
      admins: { email: string }[];
    }
  >([
    ...(onlyId ? [{ $match: { _id: onlyId } }] : []),
    {
      $lookup: {
        from: 'vehicles',
        localField: '_id',
        foreignField: 'companyId',
        as: 'v'
      }
    },
    {
      $lookup: {
        from: 'users',
        let: { id: '$_id' },
        pipeline: [
          {
            $match: {
              $expr: {
                $and: [
                  { $eq: ['$companyId', '$$id'] },
                  { $eq: ['$role', 'COMPANY_ADMIN'] }
                ]
              }
            }
          },
          { $project: { email: 1 } }
        ],
        as: 'admins'
      }
    },
    {
      $addFields: {
        vehicleCount: { $size: '$v' }
      }
    },
    { $project: { v: 0 } },
    { $sort: { name: 1 } }
  ], {
    collation: caseInsensitive
  }).toArray();

  return rows.map(row => ({
    ...companyPublic(row),
    vehicleCount: row.vehicleCount,
    adminEmails:
      row.admins.map(admin => admin.email).join(', ') ||
      null
  }));
};

app.get(
  '/api/admin/companies',
  adminOnly,
  h(async (_request, response) => {
    return response.json(await adminCompanies());
  })
);

// ---------- Create Company ----------

const buildCompanyAdmin = (
  companyId: ObjectId,
  body: Record<string, unknown>
): string | UserDoc => {
  const name = text(body.adminName, 80);

  const email = text(
    body.adminEmail,
    120
  ).toLowerCase();

  const password =
    typeof body.adminPassword === 'string'
      ? body.adminPassword
      : '';

  if (
    !name ||
    !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) ||
    password.length < 8
  ) {
    return 'Admin name, a valid email, and a password of at least 8 characters are required.';
  }

  return {
    _id: new ObjectId(),
    name,
    email,
    phone: '',
    passwordHash: bcrypt.hashSync(password, 12),
    role: 'COMPANY_ADMIN',
    companyId,
    createdAt: new Date()
  };
};

app.post(
  '/api/admin/companies',
  adminOnly,
  h(async (request, response) => {
    const body = (
      request.body ?? {}
    ) as Record<string, unknown>;

    const name = text(body.name, 80);

    if (!name) {
      return response.status(400).json({
        error: 'Brand name is required.'
      });
    }

    const logo = resolveImage(body.logo);

    if (logo === null) {
      return response.status(400).json({
        error: 'Logo must be an https URL, an /images path, or a png/jpeg/webp under 800KB.'
      });
    }

    const companyId = new ObjectId();

    const wantsAdmin = Boolean(
      body.adminEmail ||
      body.adminName ||
      body.adminPassword
    );

    const admin = wantsAdmin
      ? buildCompanyAdmin(companyId, body)
      : null;

    if (typeof admin === 'string') {
      return response.status(400).json({
        error: admin
      });
    }

    try {
      await companies.insertOne({
        _id: companyId,
        name,
        logo,
        description: text(body.description, 400),
        location: text(body.location, 160),
        status: 'ACTIVE'
      });
    } catch (error) {
      if (isDuplicate(error)) {
        return response.status(409).json({
          error: 'A brand with that name already exists.'
        });
      }

      throw error;
    }

    if (admin) {
      try {
        await users.insertOne(admin);
      } catch (error) {
        await companies.deleteOne({
          _id: companyId
        });

        if (isDuplicate(error)) {
          return response.status(409).json({
            error: 'A user with that email already exists.'
          });
        }

        throw error;
      }
    }

    return response.status(201).json(
      (await adminCompanies(companyId))[0]
    );
  })
);

// ---------- Update Company ----------

app.put(
  '/api/admin/companies/:id',
  adminOnly,
  h(async (request, response) => {
    const id = toId(request.params.id);

    const body = (
      request.body ?? {}
    ) as Record<string, unknown>;

    const set: Record<string, string> = {};

    if (body.name !== undefined) {
      const value = text(body.name, 80);

      if (!value) {
        return response.status(400).json({
          error: 'Brand name cannot be empty.'
        });
      }

      set.name = value;
    }

    if (body.description !== undefined) {
      set.description = text(body.description, 400);
    }

    if (body.location !== undefined) {
      set.location = text(body.location, 160);
    }

    if (body.status !== undefined) {
      if (
        body.status !== 'ACTIVE' &&
        body.status !== 'INACTIVE'
      ) {
        return response.status(400).json({
          error: 'Invalid status.'
        });
      }

      set.status = body.status;
    }

    if (body.logo !== undefined) {
      const logo = resolveImage(body.logo);

      if (logo === null) {
        return response.status(400).json({
          error: 'Invalid logo.'
        });
      }

      set.logo = logo;
    }

    if (!Object.keys(set).length) {
      return response.status(400).json({
        error: 'Nothing to update.'
      });
    }

    try {
      const result = id
        ? await companies.updateOne(
            { _id: id },
            { $set: set }
          )
        : { matchedCount: 0 };

      if (!result.matchedCount) {
        return response.status(404).json({
          error: 'Brand not found.'
        });
      }
    } catch (error) {
      if (isDuplicate(error)) {
        return response.status(409).json({
          error: 'A brand with that name already exists.'
        });
      }

      throw error;
    }

    return response.json(
      (await adminCompanies(id as ObjectId))[0]
    );
  })
);

// ---------- Delete Company ----------

app.delete(
  '/api/admin/companies/:id',
  adminOnly,
  h(async (request, response) => {
    const id = toId(request.params.id);

    if (!id) {
      return response.status(404).json({
        error: 'Brand not found.'
      });
    }

    if (
      (await vehicles.countDocuments({
        companyId: id
      })) > 0
    ) {
      return response.status(409).json({
        error: 'This brand still has vehicles. Deactivate it instead, or remove its vehicles first.'
      });
    }

    const result = await companies.deleteOne({
      _id: id
    });

    if (!result.deletedCount) {
      return response.status(404).json({
        error: 'Brand not found.'
      });
    }

    await users.deleteMany({
      companyId: id,
      role: 'COMPANY_ADMIN'
    });

    return response.status(204).end();
  })
);

// ---------- Create Company Administrator ----------

app.post(
  '/api/admin/companies/:id/admin',
  adminOnly,
  h(async (request, response) => {
    const id = toId(request.params.id);

    if (
      !id ||
      !(await companies.findOne({ _id: id }))
    ) {
      return response.status(404).json({
        error: 'Brand not found.'
      });
    }

    const admin = buildCompanyAdmin(
      id,
      (request.body ?? {}) as Record<string, unknown>
    );

    if (typeof admin === 'string') {
      return response.status(400).json({
        error: admin
      });
    }

    try {
      await users.insertOne(admin);
    } catch (error) {
      if (isDuplicate(error)) {
        return response.status(409).json({
          error: 'A user with that email already exists.'
        });
      }

      throw error;
    }

    return response.status(201).json(
      (await adminCompanies(id))[0]
    );
  })
);

// ---------- Admin Analytics ----------

app.get(
  '/api/admin/analytics',
  adminOnly,
  h(async (_request, response) => {
    const since30 = new Date(
      Date.now() - 29 * 86400000
    );

    since30.setUTCHours(0, 0, 0, 0);

    const since7 = new Date(
      Date.now() - 7 * 86400000
    );

    const [
      totalUsers,
      customers,
      companyAdmins,
      newCustomers7d,
      totalCompanies,
      activeCompanies,
      totalVehicles,
      trialVehicles,
      byDay,
      vehiclesByCompany,
      recent
    ] = await Promise.all([
      users.countDocuments(),
      users.countDocuments({
        role: 'CUSTOMER'
      }),
      users.countDocuments({
        role: 'COMPANY_ADMIN'
      }),
      users.countDocuments({
        role: 'CUSTOMER',
        createdAt: { $gte: since7 }
      }),
      companies.countDocuments(),
      companies.countDocuments({
        status: 'ACTIVE'
      }),
      vehicles.countDocuments(),
      vehicles.countDocuments({
        trialAvailable: true
      }),
      users.aggregate<{
        _id: string;
        count: number;
      }>([
        {
          $match: {
            role: 'CUSTOMER',
            createdAt: { $gte: since30 }
          }
        },
        {
          $group: {
            _id: {
              $dateToString: {
                format: '%Y-%m-%d',
                date: '$createdAt',
                timezone: 'UTC'
              }
            },
            count: { $sum: 1 }
          }
        }
      ]).toArray(),
      companies.aggregate<{
        name: string;
        count: number;
      }>([
        {
          $lookup: {
            from: 'vehicles',
            localField: '_id',
            foreignField: 'companyId',
            as: 'v'
          }
        },
        {
          $project: {
            _id: 0,
            name: 1,
            count: { $size: '$v' }
          }
        },
        {
          $sort: {
            count: -1,
            name: 1
          }
        }
      ]).toArray(),
      users.find(
        {},
        { projection: { passwordHash: 0 } }
      )
        .sort({ createdAt: -1 })
        .limit(25)
        .toArray()
    ]);

    const counts = new Map(
      byDay.map(row => [row._id, row.count])
    );

    const signupsByDay = Array.from(
      { length: 30 },
      (_, index) => {
        const date = new Date(
          Date.now() -
          (29 - index) * 86400000
        ).toISOString().slice(0, 10);

        return {
          date,
          count: counts.get(date) ?? 0
        };
      }
    );

    return response.json({
      totals: {
        users: totalUsers,
        customers,
        companyAdmins,
        newCustomers7d,
        companies: totalCompanies,
        activeCompanies,
        vehicles: totalVehicles,
        trialVehicles
      },
      signupsByDay,
      vehiclesByCompany,
      recentUsers: recent.map(user => ({
        id: String(user._id),
        name: user.name,
        email: user.email,
        role: user.role,
        createdAt: user.createdAt.toISOString()
      }))
    });
  })
);

// ---------- Booking System ----------

const bookingRouter = await createBookingRouter(
  db,
  jwtSecret
);

app.use('/api/bookings', bookingRouter);

// ---------- Favorites System ----------

const favoritesRouter = await createFavoritesRouter(
  db,
  jwtSecret
);

app.use('/api/favorites', favoritesRouter);

// ---------- Dealer Messaging System ----------

const messageRouter = await createMessageRouter(
  db,
  jwtSecret
);

app.use('/api/messages', messageRouter);

const showroomRouter = await createShowroomRouter(
  db,
  jwtSecret
);

app.use('/api/showrooms', showroomRouter);
app.use(
  '/api/company-settings',
  createCompanySettingsRouter(db, jwtSecret)
);

// ---------- Error Handling ----------

app.use((
  error: Error,
  _request: Request,
  response: Response,
  next: NextFunction
) => {
  if (response.headersSent) {
    return next(error);
  }

  const tooLarge =
    (error as Error & { type?: string }).type ===
    'entity.too.large';

  if (
    !tooLarge &&
    !(error as Error & { type?: string }).type
  ) {
    console.error(error);

    return response.status(500).json({
      error: 'Something went wrong on the server.'
    });
  }

  return response.status(
    tooLarge ? 413 : 400
  ).json({
    error: tooLarge
      ? 'That upload is too large.'
      : 'Bad request.'
  });
});

// ---------- Start Server ----------

app.listen(port, '0.0.0.0', () => {
  console.log(
    `Trial API listening on 0.0.0.0:${port} (MongoDB: ${db.databaseName})`
  );
  console.log('Booking API: /api/bookings');
  console.log('Favorites API: /api/favorites');
});
