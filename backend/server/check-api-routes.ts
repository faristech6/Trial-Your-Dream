
import { readFile } from 'node:fs/promises';
import { resolve } from 'node:path';

const files = [
  {
    name: 'Main Server',
    path: 'backend/server/index.ts'
  },
  {
    name: 'Booking Routes',
    path: 'backend/server/bookingRoutes.ts'
  },
  {
    name: 'Favorites Routes',
    path: 'backend/server/favoritesRoutes.ts'
  },
  {
    name: 'Messages Routes',
    path: 'backend/server/messageRoutes.ts'
  },
  {
    name: 'Booking Frontend',
    path: 'frontend/src/pages/BookingPage.tsx'
  },
  {
    name: 'Booking API',
    path: 'frontend/src/services/bookingApi.ts'
  },
  {
    name: 'Marketplace',
    path: 'frontend/src/pages/MarketplacePage.tsx'
  },
  {
    name: 'Dashboard',
    path: 'frontend/src/pages/DashboardPage.tsx'
  }
];

const keywords = [
  '/api/bookings',
  '/api/favorites',
  '/api/messages',
  'router.get(',
  'router.post(',
  'router.patch(',
  'router.put(',
  'router.delete(',
  'bookingRouter',
  'favoritesRouter',
  'messageRouter'
];

async function main() {
  console.log('TRIAL YOUR DREAM - API ROUTE CHECK');
  console.log('===================================');

  for (const file of files) {
    console.log(`\n${file.name}`);
    console.log('-'.repeat(45));

    try {
      const content = await readFile(
        resolve(file.path),
        'utf8'
      );

      const lines = content.split(/\r?\n/);

      let matches = 0;

      for (let index = 0; index < lines.length; index++) {
        const line = lines[index];

        if (
          keywords.some(keyword =>
            line.includes(keyword)
          )
        ) {
          console.log(
            `${index + 1}: ${line.trim()}`
          );
          matches++;
        }
      }

      if (matches === 0) {
        console.log(
          'No matching route definitions found.'
        );
      }
    } catch {
      console.log(
        'File not found at the expected path.'
      );
    }
  }

  console.log('\n===================================');
  console.log('Route inspection completed.');
  console.log('No data was modified.');
}

main().catch(error => {
  console.error(error);
  process.exitCode = 1;
});
