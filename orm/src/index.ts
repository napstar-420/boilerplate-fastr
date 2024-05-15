import { connect, type Connection } from '@planetscale/database';
import { drizzle, type PlanetScaleDatabase } from 'drizzle-orm/planetscale-serverless';
import { Config } from 'sst/node/config';

import * as schema from './schema';

declare global {
  var ormConnection: ReturnType<typeof connect> | null;
  var ormDrizzle: PlanetScaleDatabase<typeof schema> | null;
}

global.ormConnection = null;
global.ormDrizzle = null;

export function connection(customConnection?: Connection) {
  if (!global.ormConnection) {
    global.ormConnection =
      customConnection ??
      connect({
        host: Config.PLANETSCALE_HOST,
        username: Config.PLANETSCALE_USERNAME,
        password: Config.PLANETSCALE_PASSWORD,
      });
  }

  return global.ormConnection;
}

export function db(customConnection?: Connection) {
  if (!global.ormDrizzle) {
    global.ormDrizzle = drizzle(connection(customConnection), { schema });
  }

  return global.ormDrizzle;
}

export * from './enums';
export * from './helpers';
export * from './objects';
export * from './schema';
export * from './types';

export {
  not,
  and,
  sql,
  eq,
  gt,
  lt,
  lte,
  gte,
  isNull,
  asc,
  desc,
  like,
  inArray,
  isNotNull,
  exists,
  or,
  aliasedTable,
  type SQL,
} from 'drizzle-orm';
export * from 'drizzle-orm/planetscale-serverless';
