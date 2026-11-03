/**
 * One-time import of the old SQLite data (data/trial.sqlite) into MongoDB.
 * Usage: npm run migrate:sqlite   (needs MONGODB_URI; optional SQLITE_PATH)
 * Safe to re-run: users are matched by email, companies by name, vehicles by company+name.
 */
import dotenv from 'dotenv';
import { resolve } from 'node:path';
import { DatabaseSync } from 'node:sqlite';
import { MongoClient, ObjectId } from 'mongodb';

dotenv.config({ path: ['.env.local', '.env'] });
const uri = process.env.MONGODB_URI;
if (!uri) throw new Error('MONGODB_URI is required');

const sqlite = new DatabaseSync(resolve(process.env.SQLITE_PATH || './data/trial.sqlite'), { readOnly: true });
const client = new MongoClient(uri);
await client.connect();
const db = client.db(process.env.MONGODB_DB || 'trial_your_dream');
const ci = { locale: 'en', strength: 2 } as const;

const companyIds = new Map<number, ObjectId>();
for (const row of sqlite.prepare('SELECT * FROM companies').all() as Record<string, unknown>[]) {
  const name = String(row.name);
  const existing = await db.collection('companies').findOne({ name }, { collation: ci });
  const _id = (existing?._id as ObjectId | undefined) ?? new ObjectId();
  if (!existing) await db.collection('companies').insertOne({ _id, name, logo: row.logo ?? '', description: row.description ?? '', location: row.location ?? '', status: row.status ?? 'ACTIVE' });
  companyIds.set(Number(row.id), _id);
}

let userCount = 0;
for (const row of sqlite.prepare('SELECT * FROM users').all() as Record<string, unknown>[]) {
  const email = String(row.email).toLowerCase();
  if (await db.collection('users').findOne({ email }, { collation: ci })) continue;
  await db.collection('users').insertOne({
    _id: new ObjectId(), name: row.name, email, phone: row.phone ?? '', passwordHash: row.password_hash, role: row.role,
    companyId: row.company_id ? companyIds.get(Number(row.company_id)) ?? null : null, createdAt: new Date(String(row.created_at).replace(' ', 'T') + 'Z'),
  });
  userCount += 1;
}

let vehicleCount = 0;
for (const row of sqlite.prepare('SELECT * FROM vehicles').all() as Record<string, unknown>[]) {
  const companyId = companyIds.get(Number(row.company_id));
  if (!companyId || (await db.collection('vehicles').findOne({ companyId, name: row.name }))) continue;
  await db.collection('vehicles').insertOne({
    _id: new ObjectId(), companyId, name: row.name, category: row.category, type: row.type, price: row.price, engine: row.engine ?? '', mileage: row.mileage ?? '',
    transmission: row.transmission ?? '', fuelType: row.fuel_type ?? '', seatingCapacity: Number(row.seating_capacity ?? 2), image: row.image ?? '',
    description: row.description ?? '', trialAvailable: Boolean(row.trial_available), createdAt: new Date(),
  });
  vehicleCount += 1;
}

console.log(`Imported ${userCount} users, ${vehicleCount} vehicles; ${companyIds.size} companies matched.`);
await client.close();
