import { Config, type StackContext } from 'sst/constructs';

export async function flags({ app, stack }: StackContext) {
  const FLAG_MAINTENANCE_MODE = new Config.Parameter(stack, 'FLAG_MAINTENANCE_MODE', {
    value: 'false',
  });

  const FLAG_INVITE_ONLY = new Config.Parameter(stack, 'FLAG_INVITE_ONLY', {
    value: app.stage === 'production' ? 'true' : 'false',
  });

  return {
    FLAG_MAINTENANCE_MODE,
    FLAG_INVITE_ONLY,
  };
}
