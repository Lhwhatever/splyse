const hosts = {
    development: 'http://to.localhost:3000',
    preview: 'https://splyse.lhwhatever.vercel.app',
    production: `https://${process.env.VERCEL_URL}`,
} as Record<string, string>;

export const stateKey = 'splyse-state';
export const redirectUri = hosts[process.env.DEPLOYMENT_ENV || 'development'] + '/api/callback';
