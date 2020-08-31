import { createHash } from 'crypto';
import { NextApiRequest, NextApiResponse } from 'next';
import querystring from 'querystring';
import { setCookie } from 'utils/cookies';
import { redirectUri, stateKey } from 'utils/serverside';

export default (_: NextApiRequest, res: NextApiResponse): void => {
    const state = createHash('sha512').update(new Date().toISOString()).digest('base64');
    setCookie(res, stateKey, state, { maxAge: 300000, secure: process.env.NODE_ENV !== 'development' });

    const scope = ['playlist-read-private'].join(' ');
    const query = {
        response_type: 'code',
        client_id: process.env.SPOTIFY_CLIENT_ID,
        scope,
        state,
        redirect_uri: redirectUri,
        show_dialog: true,
    } as Record<string, string | boolean>;

    res.redirect(`https://accounts.spotify.com/authorize?${querystring.stringify(query)}`);
};
