<div align="center">
  <h3>Fastr.health Monorepo</h3>
</div>

Hi! Welcome to the Fastr.health Monorepo. 🎉

## What's in it?

- [SST](https://sst.dev) - Infrastructure-as-Code for AWS as well as runtime helpers for Lambda & Secret/Config handling.
- [TypeScript](https://www.typescriptlang.org/) - JavaScript, but better (static typing).
- [PNPM](https://pnpm.io/) - NPM, but better (again).
- [Turborepo](https://turbo.build/repo) - Task runner & cacher for monorepos - helps in dev, but is incredibly useful in CI/CD (Caches
  unchanged outputs).
- [Nuxt.js 3](https://nuxt.com/) - React sucks [ :( ], but as long as it's an SPA, it's gonna work great!
- [GraphQL](https://pothos-graphql.dev/) - REST is old, but GraphQL is insanely good for client-side caching, type-safe APIs and overall
  improvements to relationship management. This boilerplate uses Pothos to build schema - if you've ever used GraphQL before, you'll
  appreciate this. It uses the SST GraphqlHandler helper, which uses `graphql-yoga` underneith, giving access to a
  [wide array of awesome plugins](https://the-guild.dev/graphql/envelop).
- [GitHub Actions](https://docs.github.com/en/actions) - Amazing CI/CD platform integrated directly in to GitHub - want to deploy to
  production? Click a single button!
- [AWS](https://aws.amazon.com/) - The biggest cloud provider with insanely active support for serverless infrastructure (and beyond).
- [Drizzle ORM](https://orm.drizzle.team/) - A TypeScript-first, schema-only (no migrations!) ORM with zero codegen needed - almost zero
  overhead (close to the speed of running _raw_ string queries)
- [GraphQL-Codegen](https://the-guild.dev/graphql/codegen) - The only reason local build command exist, GraphQL still needs some low-level
  codegen - but with [recent changes to the ecosystem](https://gql-tada.0no.co/), this will soon be replaced by a completely dynamic typing
  system!
- `fastr.health` - One of my "super-premium domains", on-loan for DNS to showcase how SST handles SSL & domains for local development (Using
  _actual_ AWS Certificates and URLs) - happy to leave it there until you guys are sorted on DNS.

## Requirements

- [Node 20+](https://github.com/Schniz/fnm)
- [AWS CLI](https://docs.aws.amazon.com/cli/latest/userguide/getting-started-install.html)
- [PNPM](https://pnpm.io/)

## Set-up

Install NodeJS & PNPM:

```bash
fnm install v20
npm install -g pnpm
```

Install dependencies:

```bash
pnpm i
```

Build all initial packages:

```bash
pnpm build-packages
```

TODO: Configure AWS Credentials locally. Ping @Sophie on Slack for credentials in the mean-time.

## Development

Run `pnpm sst dev` to deploy your development stacks to AWS - these stacks are either full set-ups for you to develop on, or they proxy to
your machine from a production environment (Such as Lambda Functions). This will take a few minutes the first time you run it - be patient!

For things that require local development (i.e. `app`), you'll need to separately run the dev commands for these things.

```bash
pnpm --filter app dev
```

> Yep, no Docker, docker-compose or any other requirements beyond what's needed to run `pnpm sst dev`

### Accessing the Database

Since you guys are on PlanetScale _Free_ Database, you only get 1 Production branch and 1 Development branch. Upgrading (Which you'd want
eventually anyway) will allow multiple dev databases, and you can also just make multiple databases based on purpose to help with this
restriction.

Meaning, for now, everything in local dev is using the same database branch (development). Shouldn't be an issue at all right now, and if
nothing else helps enforce some common methods of making smaller, more targetted commits as part of larger issues.

**To get connection details for `development` (That you can use in any local DB client - i.e. TablePlus)**, ping @Sophie on Slack!

### Useful Commands/Workflows

- `pnpm sanity` - Will use Turborepo to run linting, typechecking and unit tests in parallel and with caching.
- `pnpm build-packages` - Builds all non-service packages that have code generation, mainly for GraphQL Schema changes to sync with
  `@fastr/hooks`.
- `pnpm commit` - A locally installed replacement to `git commit -m`, use this to be given a UI for constructing a commit message.

## Structure

### Top-level Services/Systems

- `.github/workflows` - [GitHub Actions](https://github.com/features/actions) CI/CD definitions.
- `app` - A [Nuxt.js 3](https://nuxt.com/) Application set-up for building to a completely front-end SPA.
- `cron` - Serverless Cronjob Task runner/scheduler.
- `graphql` - TypeScript code-first GraphQL service using [Pothos](https://pothos-graphql.dev/).
- `orm` - [Drizzle ORM](https://orm.drizzle.team/) Schema and [PlanetScale](https://planetscale.com/) Serverless Client.
  - `seeders` - Table seeders for local development.
- `queue` - Serverless SQS Queue.
- `stacks` - Individual [AWS CDK](https://aws.amazon.com/cdk/) Stacks built using [SST](https://sst.dev/).
- `sst.config.ts` - Overall [SST](https://sst.dev/) Stack composition/structure.

### Important Packages

- `packages/common` - Generic package exporting common helper functions that can be used in backends & frontends.
- `packages/eslint` - ESLint config used by all packages and services in the monorepo.
- `packages/flags` - [SST](https://sst.dev/)-powered Feature Flags.
- `packages/hooks` - Front/Backend SDK generation based on `graphql` schema.
- `packages/jobs` - Typed Jobs and SQS Client for interacting with `queue`.
- `packages/tsconfig` - TypeScript config shared between all libraries, frontend & backend services.

## To-do

- What AWS region to use? Just using `us-east-2` at the moment.
- AWS SSO _is_ set-up, but there are some permission issues I don't want to spend too long on right now - will just use credentials for now.

## Notes

- This is an **ESM-first monorepo**.
