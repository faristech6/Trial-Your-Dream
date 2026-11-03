
import { Router, type Request, type Response, type NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { Db, ObjectId } from 'mongodb';

type Role = 'CUSTOMER' | 'COMPANY_ADMIN' | 'SUPER_ADMIN';

interface UserRecord {
  _id: ObjectId;
  name: string;
  role: Role;
  companyId?: ObjectId | null;
}

interface Showroom {
  _id: ObjectId;
  companyId: ObjectId;
  name: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
  contactEmail: string;
  contactPhone: string;
  openingHours: string;
  active: boolean;
  createdAt: Date;
  updatedAt: Date;
}

type AuthRequest = Request & {
  currentUser?: UserRecord;
};

function clean(value: unknown, maxLength = 200): string {
  return typeof value === 'string'
    ? value.trim().slice(0, maxLength)
    : '';
}

function objectId(value: unknown): ObjectId | null {
  if (
    typeof value !== 'string' ||
    !/^[0-9a-fA-F]{24}$/.test(value)
  ) {
    return null;
  }

  return new ObjectId(value);
}

function serialize(showroom: Showroom) {
  return {
    id: showroom._id.toString(),
    companyId: showroom.companyId.toString(),
    name: showroom.name,
    address: showroom.address,
    city: showroom.city,
    state: showroom.state,
    pincode: showroom.pincode,
    contactEmail: showroom.contactEmail,
    contactPhone: showroom.contactPhone,
    openingHours: showroom.openingHours,
    active: showroom.active,
    createdAt: showroom.createdAt,
    updatedAt: showroom.updatedAt
  };
}

function asyncHandler(
  handler: (
    req: AuthRequest,
    res: Response
  ) => Promise<unknown>
) {
  return (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    Promise.resolve(
      handler(req as AuthRequest, res)
    ).catch(next);
  };
}

export async function createShowroomRouter(
  db: Db,
  jwtSecret: string
) {
  const router = Router();

  const showrooms = db.collection<Showroom>('showrooms');
  const users = db.collection<UserRecord>('users');

  await showrooms.createIndex({
    companyId: 1,
    createdAt: -1
  });

  async function requireCompany(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    const request = req as AuthRequest;

    const authorization = req.headers.authorization || '';

    const token = authorization.startsWith('Bearer ')
      ? authorization.slice(7)
      : '';

    if (!token) {
      res.status(401).json({
        error: 'Please sign in to continue.'
      });
      return;
    }

    try {
      const decoded = jwt.verify(token, jwtSecret);

      if (
        typeof decoded === 'string' ||
        typeof decoded.sub !== 'string'
      ) {
        res.status(401).json({
          error: 'Invalid authentication token.'
        });
        return;
      }

      const userId = objectId(decoded.sub);

      if (!userId) {
        res.status(401).json({
          error: 'Invalid user ID.'
        });
        return;
      }

      const user = await users.findOne({
        _id: userId
      });

      if (
        !user ||
        user.role !== 'COMPANY_ADMIN' ||
        !user.companyId
      ) {
        res.status(403).json({
          error: 'Company administrator access required.'
        });
        return;
      }

      request.currentUser = user;
      next();
    } catch {
      res.status(401).json({
        error: 'Your session is invalid or expired.'
      });
    }
  }

  function readFields(body: Record<string, unknown>) {
    return {
      name: clean(body.name, 120),
      address: clean(body.address, 300),
      city: clean(body.city, 100),
      state: clean(body.state, 100),
      pincode: clean(body.pincode, 12),
      contactEmail: clean(body.contactEmail, 150),
      contactPhone: clean(body.contactPhone, 25),
      openingHours: clean(body.openingHours, 150),
      active:
        typeof body.active === 'boolean'
          ? body.active
          : true
    };
  }

  function validate(
    fields: ReturnType<typeof readFields>
  ): string | null {
    if (
      !fields.name ||
      !fields.address ||
      !fields.city ||
      !fields.state
    ) {
      return 'Name, address, city, and state are required.';
    }

    if (
      fields.contactEmail &&
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(
        fields.contactEmail
      )
    ) {
      return 'Please enter a valid email address.';
    }

    if (
      fields.contactPhone &&
      !/^[0-9+\-()\s]{7,25}$/.test(
        fields.contactPhone
      )
    ) {
      return 'Please enter a valid contact number.';
    }

    return null;
  }


  // GET ACTIVE SHOWROOMS FOR THE PUBLIC DIRECTORY

  router.get(
    '/public',
    asyncHandler(async (_req, res) => {
      const records = await showrooms
        .find({ active: true })
        .sort({ name: 1 })
        .toArray();

      const companyIds = [
        ...new Set(
          records.map(record => record.companyId.toString())
        )
      ].map(id => new ObjectId(id));

      const companies = await db
        .collection<{
          _id: ObjectId;
          name: string;
          status: string;
        }>('companies')
        .find({
          _id: { $in: companyIds },
          status: 'ACTIVE'
        })
        .toArray();

      const companyNames = new Map(
        companies.map(company => [
          company._id.toString(),
          company.name
        ])
      );

      return res.json(
        records
          .filter(record =>
            companyNames.has(record.companyId.toString())
          )
          .map(record => ({
            ...serialize(record),
            companyName:
              companyNames.get(record.companyId.toString())
          }))
      );
    })
  );


  // GET COMPANY SHOWROOMS

  router.get(
    '/company',
    requireCompany,
    asyncHandler(async (req, res) => {
      const companyId = req.currentUser!.companyId!;

      const records = await showrooms
        .find({ companyId })
        .sort({ createdAt: -1 })
        .toArray();

      return res.json(records.map(serialize));
    })
  );

  // ADD SHOWROOM

  router.post(
    '/company',
    requireCompany,
    asyncHandler(async (req, res) => {
      const fields = readFields(req.body || {});
      const error = validate(fields);

      if (error) {
        return res.status(400).json({ error });
      }

      const now = new Date();

      const showroom: Showroom = {
        _id: new ObjectId(),
        companyId: req.currentUser!.companyId!,
        ...fields,
        createdAt: now,
        updatedAt: now
      };

      await showrooms.insertOne(showroom);

      return res.status(201).json({
        message: 'Showroom added successfully.',
        showroom: serialize(showroom)
      });
    })
  );

  // EDIT SHOWROOM

  router.put(
    '/company/:id',
    requireCompany,
    asyncHandler(async (req, res) => {
      const id = objectId(req.params.id);

      if (!id) {
        return res.status(400).json({
          error: 'Invalid showroom ID.'
        });
      }

      const companyId = req.currentUser!.companyId!;

      const existing = await showrooms.findOne({
        _id: id,
        companyId
      });

      if (!existing) {
        return res.status(404).json({
          error: 'Showroom not found.'
        });
      }

      const fields = readFields({
        ...existing,
        ...req.body
      });

      const error = validate(fields);

      if (error) {
        return res.status(400).json({ error });
      }

      await showrooms.updateOne(
        {
          _id: id,
          companyId
        },
        {
          $set: {
            ...fields,
            updatedAt: new Date()
          }
        }
      );

      const updated = await showrooms.findOne({
        _id: id,
        companyId
      });

      return res.json({
        message: 'Showroom updated successfully.',
        showroom: serialize(updated!)
      });
    })
  );

  // DELETE SHOWROOM

  router.delete(
    '/company/:id',
    requireCompany,
    asyncHandler(async (req, res) => {
      const id = objectId(req.params.id);

      if (!id) {
        return res.status(400).json({
          error: 'Invalid showroom ID.'
        });
      }

      const result = await showrooms.deleteOne({
        _id: id,
        companyId: req.currentUser!.companyId!
      });

      if (result.deletedCount === 0) {
        return res.status(404).json({
          error: 'Showroom not found.'
        });
      }

      return res.json({
        message: 'Showroom deleted successfully.'
      });
    })
  );

  return router;
}
