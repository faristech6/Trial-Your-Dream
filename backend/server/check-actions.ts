
import { readFile } from 'node:fs/promises';
import { resolve } from 'node:path';

interface Target {
  title: string;
  path: string;
  patterns: RegExp[];
}

const targets: Target[] = [
  {
    title: 'BOOKING BACKEND',
    path: 'backend/server/bookingRoutes.ts',
    patterns: [
      /router\.(get|post|patch|put|delete)\s*\(/,
      /status/i,
      /approve/i,
      /reject/i,
      /cancel/i,
      /complet/i
    ]
  },
  {
    title: 'FAVORITES BACKEND',
    path: 'backend/server/favoritesRoutes.ts',
    patterns: [
      /router\.(get|post|patch|put|delete)\s*\(/,
      /vehicleId/,
      /res\.json/,
      /isFavorite/,
      /favorite/
    ]
  },
  {
    title: 'BOOKING FRONTEND',
    path: 'frontend/src/services/bookingApi.ts',
    patterns: [
      /status/i,
      /cancel/i,
      /\/api\/bookings/,
      /approve/i,
      /reject/i
    ]
  },
  {
    title: 'DASHBOARD FRONTEND',
    path: 'frontend/src/pages/DashboardPage.tsx',
    patterns: [
      /api\/bookings/,
      /api\/favorites/,
      /updateBooking/,
      /removeFavorite/,
      /status:/,
      /favoriteResponse/
    ]
  },
  {
    title: 'MARKETPLACE FAVORITES',
    path: 'frontend/src/pages/MarketplacePage.tsx',
    patterns: [
      /api\/favorites/,
      /isFavorite/,
      /vehicleId:/
    ]
  }
];

async function inspect(target: Target) {
  console.log('\n' + '='.repeat(60));
  console.log(target.title);
  console.log(target.path);
  console.log('='.repeat(60));

  try {
    const content = await readFile(
      resolve(target.path),
      'utf8'
    );

    const lines = content.split(/\r?\n/);

    const matched = new Set<number>();

    for (let i = 0; i < lines.length; i++) {
      if (
        target.patterns.some(pattern =>
          pattern.test(lines[i])
        )
      ) {
        const start = Math.max(0, i - 2);
        const end = Math.min(lines.length, i + 5);

        for (let j = start; j < end; j++) {
          matched.add(j);
        }
      }
    }

    if (matched.size === 0) {
      console.log('No matching code found.');
      return;
    }

    let previous = -2;

    for (const index of [...matched].sort(
      (a, b) => a - b
    )) {
      if (index > previous + 1) {
        console.log('  ...');
      }

      console.log(
        `${String(index + 1).padStart(4)} | ${lines[index]}`
      );

      previous = index;
    }
  } catch (error) {
    console.log(
      'Could not read file:',
      error instanceof Error
        ? error.message
        : String(error)
    );
  }
}

async function main() {
  console.log('TRIAL YOUR DREAM');
  console.log('BOOKING AND FAVORITES ACTION CHECK');
  console.log('READ ONLY — NO DATABASE CHANGES');

  for (const target of targets) {
    await inspect(target);
  }

  console.log('\nInspection completed.');
}

main().catch(error => {
  console.error(error);
  process.exitCode = 1;
});
