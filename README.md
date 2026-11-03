# Trial Your Dream — Vehicle Trial Booking Platform

**Project type:** full-stack web application for exploring vehicles, viewing company showrooms, and requesting vehicle trial bookings. This source bundle consolidates the October 23 project upload and Corrections 65–70. **Vehicle pictures are optional**: existing picture URLs display where available, and missing/failed pictures show a "Vehicle image unavailable" placeholder.

## Technology stack

- **Frontend:** React 19, TypeScript, Vite, React Router, Tailwind CSS; Radix UI components and Lucide icons
- **Backend:** Node.js, Express 5, TypeScript (`tsx`)
- **Database:** MongoDB (official `mongodb` driver)
- **Authentication:** JWT and `bcryptjs`, with CUSTOMER, COMPANY_ADMIN and SUPER_ADMIN roles
- **Development checks:** TypeScript, ESLint and Vite production build

This is a **local demonstration app**. Booking payment method selection is a mock UI; no live payment gateway, money collection, or refund processing is integrated. Showrooms are entered by company administrators and should not be presented as independently verified or official dealerships.

## Quick start (Windows / VS Code)

Prerequisites: Node.js, npm and MongoDB Server running locally.

1. Run `npm install` from the project root.
2. Copy `.env.example` to `.env.local`, configure MongoDB and a long, unique `JWT_SECRET`. Never commit or share actual secrets.
3. Terminal 1: `npm run server` — API on `http://localhost:3001`.
4. Terminal 2: `npm run dev` — website on `http://localhost:5173`.
5. Terminal 3: `npm run lint`, `npm run build`, `npx tsc --noEmit -p backend/server/tsconfig.json`.
6. Test the API and MongoDB connection: `http://localhost:3001/health` (returns JSON with `ok`, `service`, and `database`).

Company Admin accounts are created by the Super Admin. Do not share real admin credentials in project reports or uploaded ZIP files.

## Roles and major capabilities

- **Customer:** browse brands and vehicles, manage Favorites, choose an active showroom, select a date/time, create a trial booking, see or cancel eligible bookings, view private messages, edit profile.
- **Company Admin:** manage its own vehicles and showrooms, review/approve/reject eligible trial bookings, view customers associated with company bookings, reply to its own showroom inquiries, edit company settings.
- **Super Admin:** manage companies and company admin accounts, view platform inventory and bookings, access analytics, respond to **platform** contact messages (not private customer-to-showroom correspondence).

### Booking rules

Trial slots are scoped by **vehicle + showroom + date + time**; separate showrooms can accept bookings for the same vehicle model at the same time. Existing unscoped booking records are treated conservatively by the migration logic. Paid-fee bookings remain pending unless a separate payment process records payment; do not label a mock method selection a real transaction.

## Frontend routes (main)

- Public: `/`, `/brands`, `/brands/:brandId`, `/vehicles`, `/vehicles/:id`, `/dealers`, `/contact`, `/booking`, `/signin`, `/signup`
- Customer: `/dashboard`, `/dashboard/bookings`, `/dashboard/favourites`, `/dashboard/profile`, `/dashboard/messages`
- Company: `/company/dashboard`, `/company/vehicles`, `/company/vehicles/new`, `/company/showrooms`, `/company/bookings`, `/company/customers`, `/company/settings`, `/company/messages`
- Super Admin: `/admin/dashboard`, `/admin/companies`, `/admin/vehicles`, `/admin/bookings`, `/admin/reports`, `/admin/messages`
- Old login and brand URLs are handled as compatibility redirects. Direct links to other roles' dashboards should not grant access.

## Key API routes

- Health: `GET /health`
- Vehicle catalog: `GET /api/vehicles`, `GET /api/vehicles/:id`
- Company catalog: `GET /api/companies`
- Booking: `GET /api/bookings/slots`, `GET /api/bookings/my`, `GET /api/bookings/company`, `GET /api/bookings/all`, `POST /api/bookings`, `PATCH /api/bookings/:id/cancel`, `PATCH /api/bookings/:id/status`
- Favorites: `/api/favorites` and its vehicle-specific routes
- Showrooms: `/api/showrooms/public`, company-scoped CRUD routes under `/api/showrooms`
- Messaging: company/showroom conversations under `/api/messages` and platform support messages under `/api/messages/platform`

Protected APIs require bearer-token authentication and role authorization. MongoDB is accessed by the backend, not directly by browser code.

## Images — postponed until after functional completion

Missing images **do not prevent booking or browsing**. Existing image components show a friendly placeholder on missing or failed URLs. Do not change `.png` / `.webp` file extensions to `.jpg` just by renaming them.

Image import will be implemented/validated separately when images are ready. The `vehicle-images` folder can hold uniquely named downloaded files (using a `brand-model--MongoDBID.ext` convention), but simply dropping files into that folder does **not** automatically update the vehicle records or website. That later step requires a validated copy-and-database-update import process. Preserve attribution and image usage rights for any third-party images.

## Final testing / limitations

The original app has been used locally with authenticated accounts, and previous conversations reported successful frontend builds, lint, role redirects, bookings, cancellations and messages. **This ZIP has not been independently executed against your local MongoDB or all three logged-in roles**. Run the commands above and test cross-company data isolation, protected API requests, booking slot conflicts, and showroom ownership before describing the entire system as error-free.

Never include `.env.local`, tokens, private data, `node_modules` or MongoDB backups in a ZIP shared for generating a report.