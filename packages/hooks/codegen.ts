import type { CodegenConfig } from '@graphql-codegen/cli';

const config: CodegenConfig = {
  overwrite: true,
  errorsOnly: true,
  schema: '../../graphql/generated/schema.graphql',
  documents: ['documents/**/*.graphql'],
  emitLegacyCommonJSImports: false,
  generates: {
    './generated/schema.graphql': {
      plugins: ['schema-ast'],
    },
    './src/index.ts': {
      plugins: ['typescript', 'typescript-operations', 'typescript-vue-apollo'],
    },
  },
  config: {
    avoidOptionals: false,
    useIndexSignature: true,
    useTypeImports: true,
    dedupeFragments: true,
    defaultScalarType: 'unknown',
    documentMode: 'documentNode',
    optimizeDocumentNode: true,
    strictScalars: true,
    skipTypename: true,
    pureMagicComment: true,
    enumPrefix: false,
    vueCompositionApiImportFrom: 'vue',
    namingConvention: {
      enumValues: 'change-case-all#constantCase',
    },
    scalars: {
      DateTime: 'Date',
      EmailAddress: 'string',
      Emoji: 'string',
      ID: 'string',
      URL: 'string',
    },
  },
};

export default config;
