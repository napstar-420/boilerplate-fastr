import { connect } from '@planetscale/database';

import { db as rawDb } from '@fastr/orm';

import { seeders } from './seeders';

(async function () {
  const connection = connect({
    host: process.env.DATABASE_HOST ?? 'aws.connect.psdb.cloud',
    username: process.env.DATABASE_USERNAME,
    password: process.env.DATABASE_PASSWORD,
  });

  const db = rawDb(connection);

  console.log('starting seeders...');

  await seeders.reduce<Promise<void>>(async (promise, seeder) => {
    await promise;

    try {
      await seeder(db);
    } catch (e) {
      console.error('failed to seed', e);
    }
  }, Promise.resolve());

  console.log('done');
})();
