import { builder } from '../builder';

import './account';
import './demo';
import './enums';
import './error';
import './field-error';
import './root';
import './user';

export const schema = builder.toSchema({});

/**
 * In development, generate the schema.graphql file.
 * Used for codegen and uploading to Apollo Studio.
 */
if (process.env.GENERATE_OUT === 'true') {
  const { lexicographicSortSchema, printSchema } = await import('graphql');
  const { writeFile } = await import('node:fs/promises');
  const { dirname, join } = await import('node:path');
  const { fileURLToPath } = await import('node:url');

  const schemaAsString = printSchema(lexicographicSortSchema(schema));

  await writeFile(join(dirname(fileURLToPath(import.meta.url)), '..', 'generated', 'schema.graphql'), schemaAsString);
}
