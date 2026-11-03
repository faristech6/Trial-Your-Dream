
import {
  Router,
  type Request,
  type Response,
  type NextFunction
} from 'express';

import {
  Db,
  ObjectId,
  MongoServerError
} from 'mongodb';

import jwt from 'jsonwebtoken';

interface UserRecord {
  _id: ObjectId;
  name: string;
  email: string;
  role: 'CUSTOMER' | 'COMPANY_ADMIN' | 'SUPER_ADMIN';
}

interface FavoriteRecord {
  _id: ObjectId;
  userId: ObjectId;
  vehicleId: ObjectId;
  createdAt: Date;
}

interface VehicleRecord {
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
  image: string;
  description: string;
  trialAvailable: boolean;
}

interface CompanyRecord {
  _id: ObjectId;
  name: string;
  logo: string;
  status: 'ACTIVE' | 'INACTIVE';
}

interface AuthenticatedRequest extends Request {
  currentUser?: UserRecord;
}

function toObjectId(value: unknown): ObjectId | null {
  if (
    typeof value !== 'string' ||
    !/^[0-9a-fA-F]{24}$/.test(value)
  ) {
    return null;
  }

  return new ObjectId(value);
}

function toSlug(value: string): string {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

export async function createFavoritesRouter(
  db: Db,
  jwtSecret: string
) {
  const router = Router();

  const favorites = db.collection<FavoriteRecord>('favorites');
  const users = db.collection<UserRecord>('users');
  const vehicles = db.collection<VehicleRecord>('vehicles');
  const companies = db.collection<CompanyRecord>('companies');

  await favorites.createIndex(
    {
      userId: 1,
      vehicleId: 1
    },
    {
      unique: true
    }
  );

  await favorites.createIndex({
    userId: 1,
    createdAt: -1
  });

  const asyncHandler = (
    handler: (
      req: AuthenticatedRequest,
      res: Response
    ) => Promise<unknown>
  ) => (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    Promise.resolve(
      handler(req as AuthenticatedRequest, res)
    ).catch(next);
  };

  const requireCustomer = (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    const request = req as AuthenticatedRequest;

    const authorization =
      req.headers.authorization || '';

    const token = authorization.match(
      /^Bearer\s+(.+)$/i
    )?.[1];

    if (!token) {
      res.status(401).json({
        error: 'Please sign in to manage your favorites.'
      });
      return;
    }

    let userId: ObjectId | null = null;

    try {
      const decoded = jwt.verify(token, jwtSecret);

      if (typeof decoded === 'string') {
        res.status(401).json({
          error: 'Invalid authentication token.'
        });
        return;
      }

      userId = toObjectId(decoded.sub);
    } catch {
      res.status(401).json({
        error: 'Your session has expired. Please sign in again.'
      });
      return;
    }

    if (!userId) {
      res.status(401).json({
        error: 'Invalid authentication token.'
      });
      return;
    }

    users.findOne({ _id: userId })
      .then(user => {
        if (!user) {
          res.status(401).json({
            error: 'User account not found.'
          });
          return;
        }

        if (user.role !== 'CUSTOMER') {
          res.status(403).json({
            error: 'Favorites are available for customer accounts.'
          });
          return;
        }

        request.currentUser = user;
        next();
      })
      .catch(next);
  };

  // ---------- GET ALL CUSTOMER FAVORITES ----------

  router.get(
    '/',
    requireCustomer,
    asyncHandler(async (req, res) => {
      const user = req.currentUser!;

      const records = await favorites
        .find({ userId: user._id })
        .sort({ createdAt: -1 })
        .toArray();

      const vehicleIds = records.map(
        favorite => favorite.vehicleId
      );

      const vehicleRecords = vehicleIds.length
        ? await vehicles.find({
            _id: { $in: vehicleIds }
          }).toArray()
        : [];

      const companyIds = [
        ...new Map(
          vehicleRecords.map(vehicle => [
            vehicle.companyId.toString(),
            vehicle.companyId
          ])
        ).values()
      ];

      const companyRecords = companyIds.length
        ? await companies.find({
            _id: { $in: companyIds }
          }).toArray()
        : [];

      const vehicleMap = new Map(
        vehicleRecords.map(vehicle => [
          vehicle._id.toString(),
          vehicle
        ])
      );

      const companyMap = new Map(
        companyRecords.map(company => [
          company._id.toString(),
          company
        ])
      );

      const result = records.flatMap(favorite => {
        const vehicle = vehicleMap.get(
          favorite.vehicleId.toString()
        );

        if (!vehicle) return [];

        const company = companyMap.get(
          vehicle.companyId.toString()
        );

        return [{
          id: favorite._id.toString(),
          vehicleId: vehicle._id.toString(),
          companyId: vehicle.companyId.toString(),
          name: vehicle.name,
          category: vehicle.category,
          type: vehicle.type,
          price: vehicle.price,
          image: vehicle.image,
          engine: vehicle.engine,
          mileage: vehicle.mileage,
          transmission: vehicle.transmission,
          fuelType: vehicle.fuelType,
          description: vehicle.description,
          availableForTrial:
            vehicle.trialAvailable &&
            company?.status === 'ACTIVE',
          brandName: company?.name || 'Unknown Brand',
          brandId: company ? toSlug(company.name) : '',
          createdAt: favorite.createdAt
        }];
      });

      return res.json(result);
    })
  );

  // ---------- CHECK IF A VEHICLE IS FAVORITED ----------

  router.get(
    '/check/:vehicleId',
    requireCustomer,
    asyncHandler(async (req, res) => {
      const user = req.currentUser!;
      const vehicleId = toObjectId(req.params.vehicleId);

      if (!vehicleId) {
        return res.status(400).json({
          error: 'Invalid vehicle ID.'
        });
      }

      const favorite = await favorites.findOne({
        userId: user._id,
        vehicleId
      });

      return res.json({
        vehicleId: vehicleId.toString(),
        isFavorite: Boolean(favorite)
      });
    })
  );

  // ---------- ADD TO FAVORITES ----------

  router.post(
    '/',
    requireCustomer,
    asyncHandler(async (req, res) => {
      const user = req.currentUser!;
      const vehicleId = toObjectId(req.body?.vehicleId);

      if (!vehicleId) {
        return res.status(400).json({
          error: 'Please provide a valid vehicle ID.'
        });
      }

      const vehicle = await vehicles.findOne({
        _id: vehicleId
      });

      if (!vehicle) {
        return res.status(404).json({
          error: 'Vehicle not found.'
        });
      }

      const company = await companies.findOne({
        _id: vehicle.companyId
      });

      if (!company || company.status !== 'ACTIVE') {
        return res.status(409).json({
          error: 'This vehicle is not currently available.'
        });
      }

      const existing = await favorites.findOne({
        userId: user._id,
        vehicleId
      });

      if (existing) {
        return res.json({
          message: 'Vehicle is already in your favorites.',
          isFavorite: true,
          favoriteId: existing._id.toString()
        });
      }

      const favorite: FavoriteRecord = {
        _id: new ObjectId(),
        userId: user._id,
        vehicleId,
        createdAt: new Date()
      };

      try {
        await favorites.insertOne(favorite);
      } catch (error) {
        if (
          error instanceof MongoServerError &&
          error.code === 11000
        ) {
          return res.json({
            message: 'Vehicle is already in your favorites.',
            isFavorite: true
          });
        }

        throw error;
      }

      return res.status(201).json({
        message: 'Vehicle added to favorites successfully.',
        isFavorite: true,
        favoriteId: favorite._id.toString(),
        vehicleId: vehicleId.toString()
      });
    })
  );

  // ---------- REMOVE FROM FAVORITES ----------

  router.delete(
    '/:vehicleId',
    requireCustomer,
    asyncHandler(async (req, res) => {
      const user = req.currentUser!;
      const vehicleId = toObjectId(req.params.vehicleId);

      if (!vehicleId) {
        return res.status(400).json({
          error: 'Invalid vehicle ID.'
        });
      }

      const result = await favorites.deleteOne({
        userId: user._id,
        vehicleId
      });

      if (result.deletedCount === 0) {
        return res.status(404).json({
          error: 'This vehicle is not in your favorites.'
        });
      }

      return res.json({
        message: 'Vehicle removed from favorites.',
        isFavorite: false,
        vehicleId: vehicleId.toString()
      });
    })
  );

  return router;
}
