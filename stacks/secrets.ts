import { Config, type StackContext } from 'sst/constructs';

export async function secrets({ app, stack }: StackContext) {
  const isProduction = app.stage === 'production';

  /**
   * Generic.
   */
  const WEBSITE_URL = new Config.Parameter(stack, 'WEBSITE_URL', {
    value: isProduction ? 'https://fastr.health' : 'http://localhost:3000',
  });
  const AUTH_COOKIE_NAME = new Config.Parameter(stack, 'AUTH_COOKIE_NAME', {
    value: isProduction ? 'fastr_auth' : `fastr_auth_${app.stage}`,
  });

  /**
   * PlanetScale.
   */
  const PLANETSCALE_HOST = new Config.Parameter(stack, 'PLANETSCALE_HOST', {
    value: 'aws.connect.psdb.cloud',
  });
  const PLANETSCALE_USERNAME = new Config.Secret(stack, 'PLANETSCALE_USERNAME');
  const PLANETSCALE_PASSWORD = new Config.Secret(stack, 'PLANETSCALE_PASSWORD');

  /**
   * Google.
   */
  const GOOGLE_CLIENT_ID = new Config.Parameter(stack, 'GOOGLE_CLIENT_ID', {
    value: '458722054427-c24at8kktripujukkeseihfagdt3i90d.apps.googleusercontent.com',
  });

  return {
    WEBSITE_URL,
    AUTH_COOKIE_NAME,

    PLANETSCALE_HOST,
    PLANETSCALE_USERNAME,
    PLANETSCALE_PASSWORD,

    GOOGLE_CLIENT_ID,
  };
}
