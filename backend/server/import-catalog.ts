
import dotenv from 'dotenv';
import { existsSync } from 'node:fs';
import { resolve, sep } from 'node:path';
import { ObjectId } from 'mongodb';

import { connectDB, closeDB } from '../config/db.js';
import { brands } from '../../frontend/src/data/vehicles.js';

dotenv.config({ path: ['.env.local', '.env'] });

const publicFolder = resolve('frontend/public');
const imageFolder = resolve(publicFolder, 'images');

function cleanPrice(price: string): string {
  return price
    .replace(/â‚¹/g, '₹')
    .replace(/Rs\.?/gi, '₹')
    .trim();
}

function validLocalImage(image: string): boolean {
  if (!image || !image.startsWith('/images/')) {
    return false;
  }

  const fullPath = resolve(
    publicFolder,
    image.replace(/^\/+/, '')
  );

  if (
    fullPath !== imageFolder &&
    !fullPath.startsWith(imageFolder + sep)
  ) {
    return false;
  }

  return existsSync(fullPath);
}

function getFuelType(engine: string): string {
  const value = engine.toLowerCase();

  if (value.includes('electric')) return 'Electric';
  if (value.includes('hybrid')) return 'Hybrid';
  if (value.includes('diesel')) return 'Diesel';

  return 'Petrol';
}

async function importCatalog() {
  const db = await connectDB();

  const companies = db.collection('companies');
  const vehicles = db.collection('vehicles');

  let companiesCreated = 0;
  let vehiclesCreated = 0;
  let vehiclesMatched = 0;
  let missingImages = 0;

  const missingImageList: string[] = [];

  console.log('----------------------------------');
  console.log('TRIAL YOUR DREAM - CATALOG IMPORT');
  console.log('----------------------------------');

  for (const brand of brands) {
    let company = await companies.findOne({
      name: {
        $regex: `^${brand.name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}$`,
        $options: 'i'
      }
    });

    if (!company) {
      const companyId = new ObjectId();

      await companies.insertOne({
        _id: companyId,
        name: brand.name,
        slug: brand.id,
        logo: brand.logo,
        description: brand.description,
        location: '',
        status: 'ACTIVE',
        createdAt: new Date()
      });

      company = await companies.findOne({
        _id: companyId
      });

      companiesCreated++;
    }

    if (!company) {
      throw new Error(
        `Unable to create company: ${brand.name}`
      );
    }

    const companyId = company._id as ObjectId;

    for (const vehicle of brand.vehicles) {
      const imageAvailable = validLocalImage(vehicle.image);

      if (!imageAvailable) {
        missingImages++;

        missingImageList.push(
          `${brand.name} - ${vehicle.name}`
        );
      }

      const existing = await vehicles.findOne({
        companyId,
        name: vehicle.name
      });

      if (existing) {
        vehiclesMatched++;

        const updates: Record<string, unknown> = {
          legacyId: vehicle.id
        };

        if (
          !existing.image &&
          imageAvailable
        ) {
          updates.image = vehicle.image;
        }

        await vehicles.updateOne(
          { _id: existing._id },
          { $set: updates }
        );

        continue;
      }

      await vehicles.insertOne({
        _id: new ObjectId(),
        legacyId: vehicle.id,
        companyId,
        name: vehicle.name,
        category: vehicle.category,
        type: vehicle.type,
        price: cleanPrice(vehicle.price),
        engine: vehicle.engine || '',
        power: vehicle.power || '',
        mileage: vehicle.mileage || '',
        transmission:
          vehicle.category === 'bike'
            ? 'Manual'
            : 'Automatic',
        fuelType: getFuelType(vehicle.engine || ''),
        seatingCapacity:
          vehicle.category === 'bike' ? 2 : 5,
        image: imageAvailable ? vehicle.image : '',
        description: vehicle.description,
        trialAvailable: true,
        featured: Boolean(vehicle.featured),
        createdAt: new Date()
      });

      vehiclesCreated++;
    }

    console.log(
      `${brand.name}: ${brand.vehicles.length} catalog vehicles checked`
    );
  }

  const totalCompanies = await companies.countDocuments();
  const totalVehicles = await vehicles.countDocuments();

  console.log('');
  console.log('IMPORT COMPLETED');
  console.log('----------------------------------');
  console.log(`New brands created: ${companiesCreated}`);
  console.log(`New vehicles created: ${vehiclesCreated}`);
  console.log(`Existing vehicles matched: ${vehiclesMatched}`);
  console.log(`Total MongoDB brands: ${totalCompanies}`);
  console.log(`Total MongoDB vehicles: ${totalVehicles}`);
  console.log(`Catalog entries missing images: ${missingImages}`);

  if (missingImageList.length > 0) {
    console.log('');
    console.log('VEHICLES NEEDING IMAGES');
    console.log('----------------------------------');

    for (const name of missingImageList) {
      console.log(`- ${name}`);
    }
  }

  console.log('');
  console.log('Existing records have been preserved.');
}

importCatalog()
  .catch(error => {
    console.error('Catalog import failed:', error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await closeDB();
  });
