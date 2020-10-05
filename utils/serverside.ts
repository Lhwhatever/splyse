const hosts = {
    development: 'http://to.localhost:3000',
    preview: 'https://splyse.lhwhatever.vercel.app',
    production: `https://${process.env.VERCEL_URL}`,
} as Record<string, string>;

export const stateKey = 'splyse-state';
export const accessTokenKey = 'splyse-spotify-access-token';
export const refreshTokenKey = 'splyse-spotify-refresh-token';
export const errorKey = 'splyse-error';
export const cookieAcknowledgementKey = 'splyse-cookie-acknowledgement';

export const redirectUri = hosts[process.env.DEPLOYMENT_ENV || 'development'] + '/api/callback';
