import { useParserCache } from '@envelop/parser-cache';
import { useValidationCache } from '@envelop/validation-cache';
import { GraphQLHandler } from 'sst/node/graphql';

import { context } from './context';
import { schema } from './schema';

const isProduction = process.env.NODE_ENV === 'production';

export const handler = GraphQLHandler({
  plugins: isProduction ? [useValidationCache(), useParserCache()] : [],
  maskedErrors: isProduction,
  landingPage: !isProduction,
  parserCache: isProduction,
  graphqlEndpoint: '/',
  logging: true,
  context,
  schema,
});
