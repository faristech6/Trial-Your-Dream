/**
 * Trial Your Dream - local vehicle image import.
 * Run from the project root:
 *   npx tsx backend/server/importLocalVehicleImages.ts
 *   npx tsx backend/server/importLocalVehicleImages.ts --apply
 *
 * Preview does not modify MongoDB. --apply copies files to Vite's public folder
 * and updates ONLY the corresponding vehicle.image fields using MongoDB _id.
 */
import dotenv from 'dotenv';
import { ObjectId } from 'mongodb';
import { copyFileSync, existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { basename, extname, join, resolve } from 'node:path';
import { connectDB, closeDB } from '../config/db.js';

dotenv.config({ path: ['.env.local', '.env'] });

type Item = { brand: string; model: string; filename: string; id: string; source: string; target: string; url: string };
const root = process.cwd();
const sourceDir = resolve(root, 'vehicle-images');
const publicDir = resolve(root, 'frontend/public/vehicle-images');
const csvPath = resolve(root, 'missing-vehicle-images.csv');
const apply = process.argv.includes('--apply');

function csvCells(line: string): string[] {
  const parts: string[] = [];
  let cell = '';
  let inQuotes = false;
  for (let i = 0; i < line.length; i++) {
    const c = line[i];
    if (c === '"') {
      if (inQuotes && line[i + 1] === '"') { cell += '"'; i++; }
      else inQuotes = !inQuotes;
    } else if (c === ',' && !inQuotes) { parts.push(cell.trim()); cell = ''; }
    else cell += c;
  }
  if (inQuotes) throw new Error(`Malformed CSV row: ${line}`);
  parts.push(cell.trim());
  return parts;
}

async function main() {
  if (!existsSync(csvPath)) throw new Error(`Missing CSV: ${csvPath}`);
  if (!existsSync(sourceDir)) throw new Error(`Missing image folder: ${sourceDir}`);

  const lines = readFileSync(csvPath, 'utf8').replace(/^\uFEFF/, '').split(/\r?\n/).filter(line => line.trim());
  const first = csvCells(lines[0] ?? '');
  const hasHeader = first[0]?.toLowerCase() === 'brand' && first[1]?.toLowerCase() === 'vehicle';
  const dataLines = hasHeader ? lines.slice(1) : lines;
  const errors: string[] = [];
  const items: Item[] = [];
  const ids = new Set<string>();

  for (const [index, line] of dataLines.entries()) {
    const [brand, model, filename] = csvCells(line);
    const rowNumber = index + (hasHeader ? 2 : 1);
    if (!brand || !model || !filename) { errors.push(`CSV row ${rowNumber}: incomplete columns`); continue; }
    if (basename(filename) !== filename || !/\.(jpg|jpeg|png|webp)$/i.test(filename)) {
      errors.push(`CSV row ${rowNumber}: unsafe or unsupported filename ${filename}`); continue;
    }
    const match = filename.match(/--([a-f0-9]{24})\.(jpg|jpeg|png|webp)$/i);
    if (!match) { errors.push(`CSV row ${rowNumber}: filename has no valid MongoDB ID: ${filename}`); continue; }
    const id = match[1].toLowerCase();
    if (ids.has(id)) { errors.push(`CSV row ${rowNumber}: duplicate vehicle ID ${id}`); continue; }
    ids.add(id);
    const source = join(sourceDir, filename);
    if (!existsSync(source)) { errors.push(`Missing image: ${filename} (${brand} ${model})`); continue; }
    const imageBytes = readFileSync(source);
    if (imageBytes.length === 0) { errors.push(`Empty image file: ${filename}`); continue; }
    // Do not trust the extension alone: a .webp file renamed to .jpg won't render reliably.
    const extension = extname(filename).toLowerCase();
    const jpeg = imageBytes.length > 2 && imageBytes[0] === 0xff && imageBytes[1] === 0xd8 && imageBytes[2] === 0xff;
    const png = imageBytes.subarray(0, 8).equals(Buffer.from([137,80,78,71,13,10,26,10]));
    const webp = imageBytes.toString('ascii', 0, 4) === 'RIFF' && imageBytes.toString('ascii', 8, 12) === 'WEBP';
    if (!(extension === '.jpg' || extension === '.jpeg' ? jpeg : extension === '.png' ? png : webp)) {
      errors.push(`Image format does not match extension: ${filename}`); continue;
    }
    items.push({ brand, model, filename, id, source, target: join(publicDir, filename), url: `/vehicle-images/${encodeURIComponent(filename)}` });
  }

  console.log(`CSV vehicle records: ${dataLines.length}`);
  console.log(`Valid matching image files: ${items.length}`);
  if (errors.length) {
    console.error('\nProblems:\n' + errors.join('\n'));
    throw new Error('Import stopped; resolve problems first. Nothing was changed.');
  }
  if (!items.length) throw new Error('No valid images found');

  let connected = false;
  try {
    const db = await connectDB();
    connected = true;
    const vehicles = db.collection('vehicles');
    const snapshots: Array<{ id: string; name: string; oldImage: unknown; newImage: string }> = [];
    for (const item of items) {
      const vehicle = await vehicles.findOne({ _id: new ObjectId(item.id) }, { projection: { name: 1, image: 1 } });
      if (!vehicle) { errors.push(`Vehicle ID not in MongoDB: ${item.id} (${item.brand} ${item.model})`); continue; }
      if (String(vehicle.name).trim().toLowerCase() !== item.model.trim().toLowerCase()) {
        errors.push(`Name differs for ${item.id}: CSV '${item.model}' vs MongoDB '${vehicle.name}'`); continue;
      }
      snapshots.push({ id: item.id, name: item.model, oldImage: vehicle.image ?? '', newImage: item.url });
    }
    if (errors.length) throw new Error('Database comparison failed:\n' + errors.join('\n') + '\nNo changes were made.');

    console.log(`Verified against MongoDB: ${snapshots.length} vehicles`);
    console.log(apply ? 'MODE: APPLY' : 'MODE: PREVIEW ONLY');
    if (!apply) {
      console.log('To copy all images and update MongoDB, run:');
      console.log('npx tsx backend/server/importLocalVehicleImages.ts --apply');
      return;
    }

    const backupPath = resolve(root, `vehicle-image-backup-${new Date().toISOString().replace(/[:.]/g, '-')}.json`);
    writeFileSync(backupPath, JSON.stringify(snapshots, null, 2), 'utf8');
    console.log(`Previous image values backed up: ${backupPath}`);

    mkdirSync(publicDir, { recursive: true });
    for (const item of items) copyFileSync(item.source, item.target);
    const ops = items.map(item => ({
      updateOne: { filter: { _id: new ObjectId(item.id) }, update: { $set: { image: item.url } } }
    }));
    const result = await vehicles.bulkWrite(ops, { ordered: true });
    console.log(`Images copied: ${items.length}`);
    console.log(`MongoDB vehicles matched: ${result.matchedCount}`);
    console.log(`MongoDB vehicles changed: ${result.modifiedCount}`);
    console.log('Refresh your website. Newly imported image URLs are available under /vehicle-images/.');
  } finally {
    if (connected) await closeDB();
  }
}

main().catch(error => { console.error(error); process.exitCode = 1; });
