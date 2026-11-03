
import {
  Router,
  type Request,
  type Response,
  type NextFunction
} from 'express';
import { Db, ObjectId } from 'mongodb';
import jwt from 'jsonwebtoken';

type Role = 'CUSTOMER' | 'COMPANY_ADMIN' | 'SUPER_ADMIN';

interface AppUser {
  _id: ObjectId;
  name: string;
  email: string;
  role: Role;
  companyId: ObjectId | null;
}

interface Company {
  _id: ObjectId;
  name: string;
}

interface Inquiry {
  _id: ObjectId;
  customerId: ObjectId;
  companyId: ObjectId;
  dealerId: string;
  dealerName: string;
  companyName: string;
  subject: string;
  message: string;
  reply: string;
  status: 'OPEN' | 'REPLIED' | 'CLOSED';
  createdAt: Date;
  updatedAt: Date;
  repliedAt: Date | null;
}


interface PlatformMessage {
  _id: ObjectId;
  customerId: ObjectId | null;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  subject: string;
  message: string;
  reply: string;
  status: 'OPEN' | 'REPLIED' | 'CLOSED';
  createdAt: Date;
  updatedAt: Date;
  repliedAt: Date | null;
}

function viewPlatform(item: PlatformMessage) {
  return {
    id: String(item._id),
    customerId: item.customerId?.toString() || '',
    companyId: '', dealerId: '', dealerName: '',
    companyName: 'Trial Your Dream Support',
    customerName: item.customerName,
    customerEmail: item.customerEmail,
    customerPhone: item.customerPhone,
    subject: item.subject, message: item.message,
    reply: item.reply, status: item.status,
    createdAt: item.createdAt, updatedAt: item.updatedAt,
    repliedAt: item.repliedAt,
    channel: 'PLATFORM'
  };
}

interface AuthedRequest extends Request {
  currentUser?: AppUser;
}

function asId(value: unknown): ObjectId | null {
  return typeof value === 'string' &&
    /^[a-f0-9]{24}$/i.test(value)
      ? new ObjectId(value)
      : null;
}

function clean(value: unknown, limit: number): string {
  return typeof value === 'string'
    ? value.trim().slice(0, limit)
    : '';
}

function slug(value: string): string {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

function viewInquiry(inquiry: Inquiry) {
  return {
    id: String(inquiry._id),
    customerId: String(inquiry.customerId),
    companyId: String(inquiry.companyId),
    dealerId: inquiry.dealerId,
    dealerName: inquiry.dealerName,
    companyName: inquiry.companyName,
    subject: inquiry.subject,
    message: inquiry.message,
    reply: inquiry.reply,
    status: inquiry.status,
    createdAt: inquiry.createdAt,
    updatedAt: inquiry.updatedAt,
    repliedAt: inquiry.repliedAt
  };
}

export async function createMessageRouter(
  db: Db,
  jwtSecret: string
) {
  const router = Router();

  const users = db.collection<AppUser>('users');
  const companies = db.collection<Company>('companies');
  const inquiries = db.collection<Inquiry>('dealer_messages');
  const platformMessages = db.collection<PlatformMessage>('platform_messages');

  await inquiries.createIndex({
    customerId: 1,
    createdAt: -1
  });

  await inquiries.createIndex({
    companyId: 1,
    createdAt: -1
  });

  await platformMessages.createIndex({ createdAt: -1 });
  await platformMessages.createIndex({ customerId: 1, createdAt: -1 });

  function asyncRoute(
    fn: (
      req: AuthedRequest,
      res: Response
    ) => Promise<unknown>
  ) {
    return (
      req: Request,
      res: Response,
      next: NextFunction
    ) => {
      Promise.resolve(fn(req as AuthedRequest, res))
        .catch(next);
    };
  }

  function requireUser(...roles: Role[]) {
    return (
      req: Request,
      res: Response,
      next: NextFunction
    ) => {
      const token = req.headers.authorization
        ?.match(/^Bearer\s+(.+)$/i)?.[1];

      if (!token) {
        res.status(401).json({
          error: 'Please sign in to continue.'
        });
        return;
      }

      let userId: ObjectId | null = null;

      try {
        const payload = jwt.verify(token, jwtSecret);

        if (typeof payload !== 'string') {
          userId = asId(payload.sub);
        }
      } catch {
        res.status(401).json({
          error: 'Your session has expired.'
        });
        return;
      }

      if (!userId) {
        res.status(401).json({
          error: 'Invalid session.'
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

          if (!roles.includes(user.role)) {
            res.status(403).json({
              error: 'You cannot access these messages.'
            });
            return;
          }

          (req as AuthedRequest).currentUser = user;
          next();
        })
        .catch(next);
    };
  }


  // About / Contact Us: platform support only (never a company inbox).
  router.post('/platform', asyncRoute(async (req, res) => {
    const name = clean(req.body?.name, 80);
    const email = clean(req.body?.email, 160).toLowerCase();
    const phone = clean(req.body?.phone, 30);
    const subject = clean(req.body?.subject, 140);
    const message = clean(req.body?.message, 3000);
    if (!name || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || !subject || message.length < 10) {
      return res.status(400).json({ error: 'Enter your name, a valid email, subject and a message of at least 10 characters.' });
    }
    // Never trust a userId supplied in the request body.
    let customerId: ObjectId | null = null;
    const token = req.headers.authorization?.match(/^Bearer\s+(.+)$/i)?.[1];
    if (token) {
      try {
        const payload = jwt.verify(token, jwtSecret);
        const uid = typeof payload === 'string' ? null : asId(payload.sub);
        const user = uid ? await users.findOne({ _id: uid }) : null;
        if (user?.role === 'CUSTOMER' && user.email.toLowerCase() === email) customerId = user._id;
      } catch { /* Anonymous support submissions are permitted. */ }
    }
    const now = new Date();
    const item: PlatformMessage = {
      _id: new ObjectId(), customerId, customerName: name,
      customerEmail: email, customerPhone: phone,
      subject, message, reply: '', status: 'OPEN',
      createdAt: now, updatedAt: now, repliedAt: null
    };
    await platformMessages.insertOne(item);
    return res.status(201).json({ message: 'Your message was saved for platform support.', inquiry: viewPlatform(item) });
  }));

  // Customer can see only their own platform inquiries made while signed in.
  router.get('/platform/mine', requireUser('CUSTOMER'), asyncRoute(async (req, res) => {
    const rows = await platformMessages.find({ customerId: req.currentUser!._id }).sort({ createdAt: -1 }).toArray();
    return res.json(rows.map(viewPlatform));
  }));

  router.get('/platform/admin', requireUser('SUPER_ADMIN'), asyncRoute(async (_req, res) => {
    const rows = await platformMessages.find().sort({ createdAt: -1 }).limit(500).toArray();
    return res.json(rows.map(viewPlatform));
  }));

  router.patch('/platform/admin/:id/reply', requireUser('SUPER_ADMIN'), asyncRoute(async (req, res) => {
    const id = asId(req.params.id);
    const reply = clean(req.body?.reply, 3000);
    if (!id || reply.length < 2) return res.status(400).json({ error: 'Enter a valid reply.' });
    const now = new Date();
    const updated = await platformMessages.findOneAndUpdate(
      { _id: id, status: { $ne: 'CLOSED' } },
      { $set: { reply, status: 'REPLIED', updatedAt: now, repliedAt: now } },
      { returnDocument: 'after' }
    );
    if (!updated) return res.status(404).json({ error: 'Open platform message not found.' });
    return res.json(viewPlatform(updated));
  }));

  router.patch('/platform/admin/:id/close', requireUser('SUPER_ADMIN'), asyncRoute(async (req, res) => {
    const id = asId(req.params.id);
    if (!id) return res.status(400).json({ error: 'Invalid message ID.' });
    const updated = await platformMessages.findOneAndUpdate(
      { _id: id }, { $set: { status: 'CLOSED', updatedAt: new Date() } },
      { returnDocument: 'after' }
    );
    if (!updated) return res.status(404).json({ error: 'Platform message not found.' });
    return res.json(viewPlatform(updated));
  }));

  // Customers: send an inquiry to a company.
  router.post(
    '/',
    requireUser('CUSTOMER'),
    asyncRoute(async (req, res) => {
      const customer = req.currentUser!;

      const companyId = asId(req.body?.companyId);
      const brand = clean(req.body?.brand, 100);
      const dealerId = clean(req.body?.dealerId, 100);
      const dealerName = clean(req.body?.dealerName, 120);
      const subject = clean(req.body?.subject, 120);
      const message = clean(req.body?.message, 2000);

      if (!subject || message.length < 10) {
        return res.status(400).json({
          error: 'Enter a subject and a message of at least 10 characters.'
        });
      }

      if (!companyId && !brand) {
        return res.status(400).json({
          error: 'Please select a company.'
        });
      }

      let company: Company | null = companyId
        ? await companies.findOne({ _id: companyId })
        : null;

      if (!company && brand) {
        const allCompanies = await companies
          .find({})
          .toArray();

        company = allCompanies.find(
          item =>
            slug(item.name) === slug(brand)
        ) ?? null;
      }

      if (!company) {
        return res.status(404).json({
          error: 'Company not found.'
        });
      }

      const now = new Date();

      const inquiry: Inquiry = {
        _id: new ObjectId(),
        customerId: customer._id,
        companyId: company._id,
        companyName: company.name,
        dealerId,
        dealerName: dealerName || company.name,
        subject,
        message,
        reply: '',
        status: 'OPEN',
        createdAt: now,
        updatedAt: now,
        repliedAt: null
      };

      await inquiries.insertOne(inquiry);

      return res.status(201).json({
        message: 'Your inquiry was sent to the company dashboard.',
        inquiry: viewInquiry(inquiry)
      });
    })
  );

  // Customers: see their own inquiries and replies.
  router.get(
    '/mine',
    requireUser('CUSTOMER'),
    asyncRoute(async (req, res) => {
      const customer = req.currentUser!;

      const rows = await inquiries
        .find({ customerId: customer._id })
        .sort({ createdAt: -1 })
        .toArray();

      return res.json(rows.map(viewInquiry));
    })
  );

  // Company admins: view messages addressed to their company.
  router.get(
    '/company',
    requireUser('COMPANY_ADMIN'),
    asyncRoute(async (req, res) => {
      const admin = req.currentUser!;

      if (!admin.companyId) {
        return res.status(403).json({
          error: 'Your account has no assigned company.'
        });
      }

      const rows = await inquiries
        .find({ companyId: admin.companyId })
        .sort({ createdAt: -1 })
        .toArray();

      return res.json(rows.map(viewInquiry));
    })
  );

  // Company admins: reply to a customer.
  router.patch(
    '/company/:id/reply',
    requireUser('COMPANY_ADMIN'),
    asyncRoute(async (req, res) => {
      const admin = req.currentUser!;

      if (!admin.companyId) {
        return res.status(403).json({
          error: 'Your account has no assigned company.'
        });
      }

      const inquiryId = asId(req.params.id);
      const reply = clean(req.body?.reply, 2000);

      if (!inquiryId || reply.length < 2) {
        return res.status(400).json({
          error: 'Provide a valid inquiry and reply.'
        });
      }

      const now = new Date();

      const result = await inquiries.findOneAndUpdate(
        {
          _id: inquiryId,
          companyId: admin.companyId
        },
        {
          $set: {
            reply,
            status: 'REPLIED',
            repliedAt: now,
            updatedAt: now
          }
        },
        {
          returnDocument: 'after'
        }
      );

      if (!result) {
        return res.status(404).json({
          error: 'Inquiry not found for your company.'
        });
      }

      return res.json(viewInquiry(result));
    })
  );

  // Company admins: close an inquiry.
  router.patch(
    '/company/:id/close',
    requireUser('COMPANY_ADMIN'),
    asyncRoute(async (req, res) => {
      const admin = req.currentUser!;
      const inquiryId = asId(req.params.id);

      if (!admin.companyId || !inquiryId) {
        return res.status(400).json({
          error: 'Invalid inquiry.'
        });
      }

      const result = await inquiries.findOneAndUpdate(
        {
          _id: inquiryId,
          companyId: admin.companyId
        },
        {
          $set: {
            status: 'CLOSED',
            updatedAt: new Date()
          }
        },
        {
          returnDocument: 'after'
        }
      );

      if (!result) {
        return res.status(404).json({
          error: 'Inquiry not found.'
        });
      }

      return res.json(viewInquiry(result));
    })
  );

  // Never disclose private company inquiries to platform administrators.
  router.get('/admin', requireUser('SUPER_ADMIN'), asyncRoute(async (_req, res) => {
    return res.status(403).json({ error: 'Showroom messages are private. Use the platform support inbox.' });
  }));

  return router;
}
