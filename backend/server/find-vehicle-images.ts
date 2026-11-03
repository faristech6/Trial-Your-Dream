
import dotenv from 'dotenv';
import { access, mkdir, writeFile } from 'node:fs/promises';
import { resolve, relative, sep } from 'node:path';
import { setTimeout as sleep } from 'node:timers/promises';
import { connectDB, closeDB } from '../config/db.js';

dotenv.config({ path: ['.env.local', '.env'] });

interface Vehicle {
  _id: unknown;
  companyId: unknown;
  name: string;
  image?: string;
}

interface Company {
  _id: unknown;
  name: string;
}

interface CommonsImage {
  title?: string;
  imageinfo?: Array<{
    url?: string;
    thumburl?: string;
    extmetadata?: Record<string, { value?: string }>;
  }>;
}

interface CommonsResult {
  query?: {
    pages?: CommonsImage[];
  };
  error?: {
    code?: string;
    info?: string;
  };
}

const outputFolder = resolve('data/image-review');
const outputFile = resolve(
  outputFolder,
  'vehicle-image-candidates.csv'
);
const publicFolder = resolve('frontend/public');

const header = [
  'Vehicle ID',
  'Brand',
  'Model',
  'Candidate Title',
  'Image URL',
  'Preview URL',
  'License',
  'License URL',
  'Credit',
  'Approved',
  'Search Status'
];

const rows: string[][] = [header];

function escapeCsv(value: unknown): string {
  return `"${String(value ?? '').replace(/"/g, '""')}"`;
}

function cleanHtml(value: string): string {
  return value
    .replace(/<[^>]+>/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&nbsp;/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

async function saveReport() {
  await mkdir(outputFolder, { recursive: true });

  await writeFile(
    outputFile,
    rows.map(row => row.map(escapeCsv).join(',')).join('\n'),
    'utf8'
  );
}

async function imageExists(image: string): Promise<boolean> {
  if (!image) return false;

  if (/^https?:\/\//i.test(image)) {
    return true;
  }

  if (
    !image.startsWith('/images/') &&
    !image.startsWith('/uploads/')
  ) {
    return false;
  }

  const path = resolve(publicFolder, image.slice(1));
  const rel = relative(publicFolder, path);

  if (
    rel === '..' ||
    rel.startsWith('..' + sep) ||
    resolve(rel) === path
  ) {
    return false;
  }

  try {
    await access(path);
    return true;
  } catch {
    return false;
  }
}

async function searchCommons(
  brand: string,
  model: string
): Promise<CommonsImage[]> {
  const params = new URLSearchParams({
    action: 'query',
    generator: 'search',
    gsrsearch: `intitle:${brand} ${model}`,
    gsrnamespace: '6',
    gsrlimit: '5',
    prop: 'imageinfo',
    iiprop: 'url|extmetadata',
    iiurlwidth: '700',
    format: 'json',
    formatversion: '2'
  });

  const url =
    'https://commons.wikimedia.org/w/api.php?' +
    params.toString();

  let lastError: Error | null = null;

  for (let attempt = 1; attempt <= 3; attempt++) {
    try {
      const response = await fetch(url, {
        headers: {
          Accept: 'application/json',
          'User-Agent':
            'TrialYourDreamImageResearch/1.0 (educational project; contact through project administrator)'
        },
        signal: AbortSignal.timeout(15000)
      });

      if (!response.ok) {
        const details = (
          await response.text()
        ).slice(0, 200);

        throw new Error(
          `HTTP ${response.status}: ${details}`
        );
      }

      const data =
        (await response.json()) as CommonsResult;

      if (data.error) {
        throw new Error(
          `API error ${data.error.code}: ${data.error.info}`
        );
      }

      return data.query?.pages ?? [];
    } catch (error) {
      lastError = error instanceof Error
        ? error
        : new Error(String(error));

      const cause = (lastError as Error & {
        cause?: unknown;
      }).cause;

      console.error(
        `  Attempt ${attempt}/3 failed:`,
        lastError.message,
        cause ? `Cause: ${String(cause)}` : ''
      );

      if (attempt < 3) {
        await sleep(attempt * 1200);
      }
    }
  }

  throw lastError ?? new Error('Unknown network error');
}

async function main() {
  const db = await connectDB();

  const [vehicles, companies] = await Promise.all([
    db.collection<Vehicle>('vehicles').find({}).toArray(),
    db.collection<Company>('companies').find({}).toArray()
  ]);

  const companyMap = new Map(
    companies.map(company => [
      String(company._id),
      company.name
    ])
  );

  const missing: Array<{
    id: string;
    brand: string;
    model: string;
  }> = [];

  for (const vehicle of vehicles) {
    if (!(await imageExists(vehicle.image || ''))) {
      missing.push({
        id: String(vehicle._id),
        brand:
          companyMap.get(String(vehicle.companyId)) ||
          'Unknown',
        model: vehicle.name
      });
    }
  }

  console.log(`Total MongoDB vehicles: ${vehicles.length}`);
  console.log(`Images needing review: ${missing.length}`);

  await saveReport();

  let found = 0;
  let consecutiveFailures = 0;

  for (let i = 0; i < missing.length; i++) {
    const vehicle = missing[i];

    console.log(
      `[${i + 1}/${missing.length}] ` +
      `${vehicle.brand} ${vehicle.model}`
    );

    try {
      const candidates = await searchCommons(
        vehicle.brand,
        vehicle.model
      );

      consecutiveFailures = 0;

      if (candidates.length === 0) {
        rows.push([
          vehicle.id,
          vehicle.brand,
          vehicle.model,
          '',
          '',
          '',
          '',
          '',
          '',
          'NO',
          'NO RESULTS'
        ]);
      }

      for (const candidate of candidates) {
        const info = candidate.imageinfo?.[0];

        if (!info?.url) continue;

        const metadata = info.extmetadata || {};

        rows.push([
          vehicle.id,
          vehicle.brand,
          vehicle.model,
          candidate.title || '',
          info.url,
          info.thumburl || info.url,
          cleanHtml(
            metadata.LicenseShortName?.value || ''
          ),
          metadata.LicenseUrl?.value || '',
          cleanHtml(
            metadata.Artist?.value ||
            metadata.Credit?.value ||
            ''
          ),
          'NO',
          'REVIEW REQUIRED'
        ]);

        found++;
      }
    } catch (error) {
      consecutiveFailures++;

      const reason = error instanceof Error
        ? error.message
        : String(error);

      rows.push([
        vehicle.id,
        vehicle.brand,
        vehicle.model,
        '',
        '',
        '',
        '',
        '',
        '',
        'NO',
        `SEARCH FAILED: ${reason}`
      ]);

      // Stop instead of making 151 unsuccessful requests.
      if (consecutiveFailures >= 3) {
        console.error('');
        console.error(
          'Stopped: three consecutive searches failed.'
        );
        console.error(
          'Check internet access, firewall, proxy, ' +
          'or Wikimedia API availability.'
        );

        await saveReport();
        break;
      }
    }

    // Save after every vehicle so progress is not lost.
    await saveReport();

    // Small delay to avoid excessive API requests.
    await sleep(1000);
  }

  console.log('');
  console.log('Search completed or stopped safely.');
  console.log(`Candidate images found: ${found}`);
  console.log(`Report: ${outputFile}`);
  console.log('MongoDB records were not modified.');
}

main()
  .catch(error => {
    console.error(
      'Image search failed:',
      error instanceof Error ? error.message : error
    );
    process.exitCode = 1;
  })
  .finally(async () => {
    await closeDB();
  });
