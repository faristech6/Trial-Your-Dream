
import { Router, type Request, type Response, type NextFunction } from 'express';
import { Db, ObjectId, MongoServerError } from 'mongodb';
import jwt from 'jsonwebtoken';

type Role = 'CUSTOMER' | 'COMPANY_ADMIN' | 'SUPER_ADMIN';
type BookingStatus = 'Pending' | 'Approved' | 'Rejected' | 'Cancelled' | 'Completed';
type PaymentStatus = 'Not Required' | 'Pending' | 'Paid';

interface User {
  _id: ObjectId;
  name: string;
  email: string;
  phone: string;
  role: Role;
  companyId: ObjectId | null;
}

interface Vehicle {
  _id: ObjectId;
  companyId: ObjectId;
  name: string;
  category: 'car' | 'bike';
  price: string;
  trialAvailable: boolean;
}

interface Company {
  _id: ObjectId;
  name: string;
  status: 'ACTIVE' | 'INACTIVE';
}

interface Showroom {
  _id: ObjectId;
  companyId: ObjectId;
  name: string;
  active: boolean;
}

interface Booking {
  _id: ObjectId;
  bookingCode: string;
  userId: ObjectId;
  companyId: ObjectId;
  vehicleId: ObjectId;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  vehicleName: string;
  companyName: string;
  showroom: string;
  showroomId?: ObjectId;
  date: string;
  time: string;
  notes: string;
  bookingFee: number;
  currency: 'INR';
  paymentStatus: PaymentStatus;
  status: BookingStatus;
  createdAt: Date;
  updatedAt: Date;
}

interface AuthRequest extends Request {
  currentUser?: User;
}

const timeSlots = [
  '09:00 AM',
  '10:00 AM',
  '11:00 AM',
  '12:00 PM',
  '02:00 PM',
  '03:00 PM',
  '04:00 PM',
  '05:00 PM',
  '06:00 PM'
];

function validId(value: unknown): ObjectId | null {
  if (typeof value !== 'string') return null;
  if (!/^[0-9a-fA-F]{24}$/.test(value)) return null;
  return new ObjectId(value);
}

function cleanText(value: unknown, maximum = 200): string {
  return typeof value === 'string'
    ? value.trim().slice(0, maximum)
    : '';
}

function isValidDate(value: string): boolean {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;

  const date = new Date(`${value}T00:00:00.000Z`);

  return !Number.isNaN(date.getTime()) &&
    date.toISOString().slice(0, 10) === value;
}

function bookingDateTime(date: string, time: string): Date {
  const match = time.match(/^(\d{2}):(\d{2}) (AM|PM)$/);

  if (!match) return new Date(NaN);

  let hour = Number(match[1]);
  const minute = Number(match[2]);

  if (match[3] === 'PM' && hour !== 12) hour += 12;
  if (match[3] === 'AM' && hour === 12) hour = 0;

  return new Date(
    `${date}T${String(hour).padStart(2, '0')}:${String(minute).padStart(2, '0')}:00+05:30`
  );
}

function priceInLakhs(price: string): number {
  const match = price.replace(/,/g, '').match(/(\d+(?:\.\d+)?)/);
  if (!match) return 0;

  const number = Number(match[1]);
  const lower = price.toLowerCase();

  if (lower.includes('crore')) return number * 100;
  if (lower.includes('lakh')) return number;

  return number / 100000;
}

function calculateBookingFee(vehicle: Vehicle): number {
  const price = priceInLakhs(vehicle.price);

  if (vehicle.category === 'bike') {
    if (price < 1.5) return 0;
    if (price < 3) return 99;
    if (price < 8) return 299;
    return 599;
  }

  if (price < 6) return 0;
  if (price < 15) return 299;
  if (price < 50) return 699;

  return 1499;
}

function serializeBooking(booking: Booking) {
  return {
    id: booking._id.toString(),
    bookingCode: booking.bookingCode,
    userId: booking.userId.toString(),
    companyId: booking.companyId.toString(),
    vehicleId: booking.vehicleId.toString(),
    customerName: booking.customerName,
    customerEmail: booking.customerEmail,
    customerPhone: booking.customerPhone,
    vehicleName: booking.vehicleName,
    companyName: booking.companyName,
    showroom: booking.showroom,
    showroomId: booking.showroomId?.toString() || null,
    date: booking.date,
    time: booking.time,
    notes: booking.notes,
    bookingFee: booking.bookingFee,
    currency: booking.currency,
    paymentStatus: booking.paymentStatus,
    status: booking.status,
    createdAt: booking.createdAt,
    updatedAt: booking.updatedAt
  };
}

export async function createBookingRouter(db: Db, jwtSecret: string) {
  const router = Router();

  const bookings = db.collection<Booking>('bookings');
  const users = db.collection<User>('users');
  const vehicles = db.collection<Vehicle>('vehicles');
  const companies = db.collection<Company>('companies');
  const showrooms = db.collection<Showroom>('showrooms');

  await bookings.createIndex({ userId: 1, createdAt: -1 });
  await bookings.createIndex({ companyId: 1, createdAt: -1 });
  await bookings.createIndex({ bookingCode: 1 }, { unique: true });

  await bookings.createIndex(
    { vehicleId: 1, date: 1, time: 1 },
    {
      unique: true,
      partialFilterExpression: {
        status: { $in: ['Pending', 'Approved'] }
      }
    }
  );

  const asyncHandler = (
    handler: (req: AuthRequest, res: Response) => Promise<unknown>
  ) => (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    Promise.resolve(handler(req as AuthRequest, res)).catch(next);
  };

  const requireUser = (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    const request = req as AuthRequest;
    const authorization = req.headers.authorization || '';
    const token = authorization.match(/^Bearer\s+(.+)$/i)?.[1];

    if (!token) {
      res.status(401).json({
        error: 'Please log in to continue.'
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

      userId = validId(decoded.sub);
    } catch {
      res.status(401).json({
        error: 'Your session has expired. Please log in again.'
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

        request.currentUser = user;
        next();
      })
      .catch(next);
  };

  router.get('/slots', asyncHandler(async (req, res) => {
    const vehicleId = validId(req.query.vehicleId);
    const date = cleanText(req.query.date, 10);

    if (!vehicleId || !isValidDate(date)) {
      return res.status(400).json({
        error: 'A valid vehicleId and date are required.'
      });
    }

    const vehicle = await vehicles.findOne({
      _id: vehicleId,
      trialAvailable: true
    });

    if (!vehicle) {
      return res.status(404).json({
        error: 'Vehicle is unavailable.'
      });
    }

    const reserved = await bookings.find({
      vehicleId,
      date,
      status: { $in: ['Pending', 'Approved'] }
    }).toArray();

    const occupied = new Set(reserved.map(booking => booking.time));

    const slots = timeSlots.map(time => ({
      time,
      available:
        !occupied.has(time) &&
        bookingDateTime(date, time).getTime() > Date.now()
    }));

    return res.json({
      vehicleId: vehicleId.toString(),
      date,
      slots
    });
  }));

  router.get('/my', requireUser, asyncHandler(async (req, res) => {
    const user = req.currentUser!;

    const records = await bookings
      .find({ userId: user._id })
      .sort({ createdAt: -1 })
      .toArray();

    return res.json(records.map(serializeBooking));
  }));

  router.get('/company', requireUser, asyncHandler(async (req, res) => {
    const user = req.currentUser!;

    if (user.role !== 'COMPANY_ADMIN' || !user.companyId) {
      return res.status(403).json({
        error: 'Company administrator access required.'
      });
    }

    const records = await bookings
      .find({ companyId: user.companyId })
      .sort({ createdAt: -1 })
      .toArray();

    return res.json(records.map(serializeBooking));
  }));

  router.get('/all', requireUser, asyncHandler(async (req, res) => {
    if (req.currentUser!.role !== 'SUPER_ADMIN') {
      return res.status(403).json({
        error: 'Super administrator access required.'
      });
    }

    const records = await bookings
      .find()
      .sort({ createdAt: -1 })
      .limit(500)
      .toArray();

    return res.json(records.map(serializeBooking));
  }));

  router.post('/', requireUser, asyncHandler(async (req, res) => {
    const user = req.currentUser!;

    if (user.role !== 'CUSTOMER') {
      return res.status(403).json({
        error: 'Only customer accounts can book test drives.'
      });
    }

    const body = req.body ?? {};

    const vehicleId = validId(body.vehicleId);
    const date = cleanText(body.date, 10);
    const time = cleanText(body.time, 20);
    const customerName = cleanText(body.name, 80);
    const customerPhone = cleanText(body.phone, 30);
    const showroomName = cleanText(body.showroom, 160);
    const showroomId = validId(body.showroomId);
    const notes = cleanText(body.notes, 1000);

    if (
      !vehicleId ||
      !customerName ||
      !customerPhone ||
      (!showroomName && !showroomId) ||
      !isValidDate(date) ||
      !timeSlots.includes(time)
    ) {
      return res.status(400).json({
        error: 'Please provide valid customer, vehicle, showroom, date and time details.'
      });
    }

    if (!/^[0-9+\-()\s]{7,20}$/.test(customerPhone)) {
      return res.status(400).json({
        error: 'Please enter a valid phone number.'
      });
    }

    if (bookingDateTime(date, time).getTime() <= Date.now()) {
      return res.status(400).json({
        error: 'Please select a future booking slot.'
      });
    }

    const vehicle = await vehicles.findOne({
      _id: vehicleId,
      trialAvailable: true
    });

    if (!vehicle) {
      return res.status(404).json({
        error: 'This vehicle is not available for trials.'
      });
    }

    const company = await companies.findOne({
      _id: vehicle.companyId,
      status: 'ACTIVE'
    });

    if (!company) {
      return res.status(404).json({
        error: 'This vehicle company is unavailable.'
      });
    }

    // Validate the selected showroom against the same company as the vehicle.
    // The existing frontend sends the showroom name; newer clients may send
    // showroomId as well. Never trust either value without a database lookup.
    const showroomQuery = showroomId
      ? { _id: showroomId, companyId: company._id, active: true }
      : { name: showroomName, companyId: company._id, active: true };

    const selectedShowroom = await showrooms.findOne(showroomQuery);

    if (!selectedShowroom ||
        (showroomName && selectedShowroom.name !== showroomName)) {
      return res.status(400).json({
        error: 'The selected showroom is not active or does not belong to this vehicle company.'
      });
    }

    const fee = calculateBookingFee(vehicle);
    const now = new Date();
    const id = new ObjectId();

    const booking: Booking = {
      _id: id,
      bookingCode: `TYD-${id.toHexString().slice(-10).toUpperCase()}`,
      userId: user._id,
      companyId: company._id,
      vehicleId: vehicle._id,
      customerName,
      customerEmail: user.email,
      customerPhone,
      vehicleName: vehicle.name,
      companyName: company.name,
      showroom: selectedShowroom.name,
      showroomId: selectedShowroom._id,
      date,
      time,
      notes,
      bookingFee: fee,
      currency: 'INR',
      paymentStatus: fee === 0 ? 'Not Required' : 'Pending',
      status: 'Pending',
      createdAt: now,
      updatedAt: now
    };

    try {
      await bookings.insertOne(booking);

      return res.status(201).json({
        message: 'Your booking request has been submitted.',
        booking: serializeBooking(booking)
      });
    } catch (error) {
      if (error instanceof MongoServerError && error.code === 11000) {
        return res.status(409).json({
          error: 'This time slot is already booked. Please select another slot.'
        });
      }

      throw error;
    }
  }));

  router.patch('/:id/cancel', requireUser, asyncHandler(async (req, res) => {
    const id = validId(req.params.id);
    const user = req.currentUser!;

    if (!id) {
      return res.status(400).json({ error: 'Invalid booking ID.' });
    }

    const booking = await bookings.findOne({
      _id: id,
      userId: user._id
    });

    if (!booking) {
      return res.status(404).json({ error: 'Booking not found.' });
    }

    const updated = await bookings.findOneAndUpdate(
      {
        _id: id,
        userId: user._id,
        status: { $in: ['Pending', 'Approved'] }
      },
      {
        $set: {
          status: 'Cancelled',
          updatedAt: new Date()
        }
      },
      { returnDocument: 'after' }
    );

    if (!updated) {
      return res.status(409).json({
        error: 'This booking cannot be cancelled.'
      });
    }

    return res.json({
      message: 'Booking cancelled successfully.',
      booking: serializeBooking(updated)
    });
  }));

  router.patch('/:id/status', requireUser, asyncHandler(async (req, res) => {
    const user = req.currentUser!;
    const id = validId(req.params.id);
    const status = req.body?.status as BookingStatus;

    if (user.role !== 'COMPANY_ADMIN' || !user.companyId) {
      return res.status(403).json({
        error: 'Company administrator access required.'
      });
    }

    if (!id) {
      return res.status(400).json({ error: 'Invalid booking ID.' });
    }

    if (!['Approved', 'Rejected', 'Completed'].includes(status)) {
      return res.status(400).json({ error: 'Invalid booking status.' });
    }

    const booking = await bookings.findOne({
      _id: id,
      companyId: user.companyId
    });

    if (!booking) {
      return res.status(404).json({ error: 'Booking not found.' });
    }

    const allowed =
      (booking.status === 'Pending' &&
        ['Approved', 'Rejected'].includes(status)) ||
      (booking.status === 'Approved' && status === 'Completed');

    if (!allowed) {
      return res.status(409).json({
        error: 'This booking status cannot be changed.'
      });
    }

    if (
      status === 'Completed' &&
      bookingDateTime(booking.date, booking.time).getTime() > Date.now()
    ) {
      return res.status(409).json({
        error: 'A future appointment cannot be marked as completed.'
      });
    }

    if (
      status === 'Completed' &&
      booking.paymentStatus === 'Pending'
    ) {
      return res.status(409).json({
        error: 'Payment is still pending. Booking cannot be completed.'
      });
    }

    const updated = await bookings.findOneAndUpdate(
      {
        _id: id,
        companyId: user.companyId,
        status: booking.status
      },
      {
        $set: {
          status,
          updatedAt: new Date()
        }
      },
      { returnDocument: 'after' }
    );

    if (!updated) {
      return res.status(409).json({
        error: 'Booking was changed by another request. Please try again.'
      });
    }

    return res.json({
      message: `Booking status updated to ${status}.`,
      booking: serializeBooking(updated)
    });
  }));

  return router;
}
