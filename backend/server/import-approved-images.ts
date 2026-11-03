
import dotenv from 'dotenv';
import { readFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { ObjectId } from 'mongodb';
import { connectDB, closeDB } from '../config/db.js';

dotenv.config({
  path: ['.env.local', '.env']
});

interface Vehicle {
  _id: ObjectId;
  name: string;
  image?: string;
}

const csvPath = resolve(
  'data/image-review/vehicle-image-candidates.csv'
);

interface ImageApproval {
  vehicleId: string;
  brand: string;
  model: string;
  title: string;
  imageUrl: string;
  license: string;
  licenseUrl: string;
  credit: string;
}

function parseCsv(content: string): string[][] {
  const rows: string[][] = [];
  let currentRow: string[] = [];
  let currentCell = '';
  let insideQuotes = false;

  for (let i = 0; i < content.length; i++) {
    const character = content[i];

    if (character === '"') {
      if (insideQuotes && content[i + 1] === '"') {
        currentCell += '"';
        i++;
      } else {
        insideQuotes = !insideQuotes;
      }
    } else if (character === ',' && !insideQuotes) {
      currentRow.push(currentCell);
      currentCell = '';
    } else if (
      (character === '\n' || character === '\r') &&
      !insideQuotes
    ) {
      if (
        character === '\r' &&
        content[i + 1] === '\n'
      ) {
        i++;
      }

      currentRow.push(currentCell);

      if (currentRow.some(value => value.trim())) {
        rows.push(currentRow);
      }

      currentRow = [];
      currentCell = '';
    } else {
      currentCell += character;
    }
  }

  if (insideQuotes) {
    throw new Error('CSV contains an unclosed quote.');
  }

  if (currentCell || currentRow.length) {
    currentRow.push(currentCell);
    rows.push(currentRow);
  }

  return rows;
}

function readApprovedRows(
  csvRows: string[][]
): ImageApproval[] {
  if (csvRows.length === 0) {
    throw new Error('CSV is empty.');
  }

  const header = csvRows[0].map(value => value.trim());

  const requiredColumns = [
    'Vehicle ID',
    'Brand',
    'Model',
    'Candidate Title',
    'Image URL',
    'License',
    'License URL',
    'Credit',
    'Approved'
  ];

  for (const column of requiredColumns) {
    if (!header.includes(column)) {
      throw new Error(`Missing CSV column: ${column}`);
    }
  }

  const index = (name: string) => header.indexOf(name);

  const approvals: ImageApproval[] = [];

  for (const row of csvRows.slice(1)) {
    const approved = (
      row[index('Approved')] || ''
    ).trim().toUpperCase();

    if (approved !== 'YES') continue;

    const vehicleId = (
      row[index('Vehicle ID')] || ''
    ).trim();

    const imageUrl = (
      row[index('Image URL')] || ''
    ).trim();

    const license = (
      row[index('License')] || ''
    ).trim();

    const credit = (
      row[index('Credit')] || ''
    ).trim();

    if (!ObjectId.isValid(vehicleId)) {
      throw new Error(
        `Invalid vehicle ID in approved row: ${vehicleId}`
      );
    }

    const url = new URL(imageUrl);

    if (
      url.protocol !== 'https:' ||
      ![
        'upload.wikimedia.org',
        'commons.wikimedia.org'
      ].includes(url.hostname)
    ) {
      throw new Error(
        `Unsupported image URL: ${imageUrl}`
      );
    }

    if (!license || !credit) {
      throw new Error(
        `Approved image for ${vehicleId} is missing license or credit.`
      );
    }

    approvals.push({
      vehicleId,
      brand: (row[index('Brand')] || '').trim(),
      model: (row[index('Model')] || '').trim(),
      title: (row[index('Candidate Title')] || '').trim(),
      imageUrl,
      license,
      licenseUrl:
        (row[index('License URL')] || '').trim(),
      credit
    });
  }

  const seen = new Set<string>();

  for (const approval of approvals) {
    if (seen.has(approval.vehicleId)) {
      throw new Error(
        `Multiple approved images for vehicle ${approval.vehicleId}. ` +
        'Keep only one YES for each vehicle.'
      );
    }

    seen.add(approval.vehicleId);
  }

  return approvals;
}

async function main() {
  const applyChanges = process.argv.includes('--apply');

  console.log(
    applyChanges
      ? 'MODE: APPLY APPROVED IMAGES'
      : 'MODE: PREVIEW ONLY'
  );

  const text = await readFile(csvPath, 'utf8');
  const approvals = readApprovedRows(parseCsv(text));

  console.log(
    `Approved image records: ${approvals.length}`
  );

  if (approvals.length === 0) {
    console.log(
      'No images approved. Change Approved from NO to YES ' +
      'for correctly matched and licensed images.'
    );
    return;
  }

  const db = await connectDB();
  const collection = db.collection<Vehicle>('vehicles');

  let updated = 0;
  let skipped = 0;

  for (const approval of approvals) {
    const vehicle = await collection.findOne({
      _id: new ObjectId(approval.vehicleId)
    });

    if (!vehicle) {
      console.log(
        `SKIPPED: Vehicle ID ${approval.vehicleId} not found.`
      );
      skipped++;
      continue;
    }

    if (
      vehicle.name.trim().toLowerCase() !==
      approval.model.toLowerCase()
    ) {
      console.log(
        `SKIPPED: Model mismatch — ${approval.model} / ${vehicle.name}`
      );
      skipped++;
      continue;
    }

    if (vehicle.image?.trim()) {
      console.log(
        `SKIPPED: ${vehicle.name} already has an image.`
      );
      skipped++;
      continue;
    }

    console.log(
      `${applyChanges ? 'IMPORT' : 'PREVIEW'}: ` +
      `${approval.brand} ${vehicle.name}`
    );

    console.log(`  Image: ${approval.imageUrl}`);
    console.log(`  License: ${approval.license}`);

    if (!applyChanges) continue;

    const result = await collection.updateOne(
      {
        _id: vehicle._id,
        $or: [
          { image: { $exists: false } },
          { image: '' },
        ]
      },
      {
        $set: {
          image: approval.imageUrl,
          imageAttribution: {
            title: approval.title,
            credit: approval.credit,
            license: approval.license,
            licenseUrl: approval.licenseUrl,
            sourceUrl: approval.imageUrl
          },
          updatedAt: new Date()
        }
      }
    );

    if (result.modifiedCount === 1) {
      updated++;
    } else {
      skipped++;
    }
  }

  console.log('');
  console.log(`Approved: ${approvals.length}`);
  console.log(`Updated: ${updated}`);
  console.log(`Skipped: ${skipped}`);

  if (!applyChanges) {
    console.log(
      'Preview finished. No MongoDB records changed.'
    );
  }
}

main()
  .catch(error => {
    console.error(
      error instanceof Error ? error.message : error
    );
    process.exitCode = 1;
  })
  .finally(async () => {
    await closeDB();
  });
