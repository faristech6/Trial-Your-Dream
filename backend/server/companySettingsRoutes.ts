
import {
  Router,
  type Request,
  type Response,
  type NextFunction
} from 'express';
import { Db, ObjectId } from 'mongodb';
import jwt from 'jsonwebtoken';

interface Company {
  _id: ObjectId;
  name: string;
  status?: string;
  description?: string;
  contactEmail?: string;
  contactPhone?: string;
  website?: string;
  address?: string;
  city?: string;
  state?: string;
  updatedAt?: Date;
}

interface User {
  _id: ObjectId;
  role: string;
  companyId?: ObjectId | null;
}

interface AuthRequest extends Request {
  companyId?: ObjectId;
}

function validId(value: unknown): ObjectId | null {
  if (
    typeof value !== 'string' ||
    !/^[0-9a-fA-F]{24}$/.test(value)
  ) {
    return null;
  }

  return new ObjectId(value);
}

function clean(value: unknown, maxLength = 200): string {
  return typeof value === 'string'
    ? value.trim().slice(0, maxLength)
    : '';
}

function serialize(company: Company) {
  return {
    id: company._id.toString(),
    name: company.name,
    status: company.status || '',
    description: company.description || '',
    contactEmail: company.contactEmail || '',
    contactPhone: company.contactPhone || '',
    website: company.website || '',
    address: company.address || '',
    city: company.city || '',
    state: company.state || ''
  };
}

export function createCompanySettingsRouter(
  db: Db,
  jwtSecret: string
) {
  const router = Router();

  const companies = db.collection<Company>('companies');
  const users = db.collection<User>('users');

  async function requireCompany(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    const authorization = req.headers.authorization || '';
    const token = authorization.match(
      /^Bearer\s+(.+)$/i
    )?.[1];

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
          error: 'Invalid session.'
        });
        return;
      }

      const userId = validId(decoded.sub);

      if (!userId) {
        res.status(401).json({
          error: 'Invalid user ID.'
        });
        return;
      }

      const user = await users.findOne({ _id: userId });

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

      (req as AuthRequest).companyId = user.companyId;
      next();
    } catch (error) {
      next(
        error instanceof jwt.JsonWebTokenError
          ? Object.assign(
              new Error('Invalid or expired session.'),
              { status: 401 }
            )
          : error
      );
    }
  }

  router.get(
    '/',
    requireCompany,
    async (req: AuthRequest, res, next) => {
      try {
        const company = await companies.findOne({
          _id: req.companyId!
        });

        if (!company) {
          res.status(404).json({
            error: 'Company not found.'
          });
          return;
        }

        res.json(serialize(company));
      } catch (error) {
        next(error);
      }
    }
  );

  router.patch(
    '/',
    requireCompany,
    async (req: AuthRequest, res, next) => {
      try {
        const body = req.body || {};

        const name = clean(body.name, 120);
        const description = clean(body.description, 2000);
        const contactEmail = clean(body.contactEmail, 160);
        const contactPhone = clean(body.contactPhone, 30);
        const website = clean(body.website, 300);
        const address = clean(body.address, 300);
        const city = clean(body.city, 100);
        const state = clean(body.state, 100);

        if (!name) {
          res.status(400).json({
            error: 'Company name is required.'
          });
          return;
        }

        if (
          contactEmail &&
          !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(contactEmail)
        ) {
          res.status(400).json({
            error: 'Enter a valid contact email.'
          });
          return;
        }

        if (
          website &&
          !/^https?:\/\/[^\s]+$/i.test(website)
        ) {
          res.status(400).json({
            error: 'Website must start with http:// or https://.'
          });
          return;
        }

        const result = await companies.findOneAndUpdate(
          { _id: req.companyId! },
          {
            $set: {
              name,
              description,
              contactEmail,
              contactPhone,
              website,
              address,
              city,
              state,
              updatedAt: new Date()
            }
          },
          { returnDocument: 'after' }
        );

        if (!result) {
          res.status(404).json({
            error: 'Company not found.'
          });
          return;
        }

        res.json({
          message: 'Company settings saved successfully.',
          company: serialize(result)
        });
      } catch (error) {
        next(error);
      }
    }
  );

  return router;
}
