import axios from 'axios';
import cookie from 'cookie';
import { NextApiRequest, NextApiResponse } from 'next';
import querystring from 'querystring';
import { clearCookie, setCookie, setCookies } from 'utils/cookies';
import { accessTokenKey, errorKey, redirectUri, refreshTokenKey, stateKey } from 'utils/serverside';

export default async (req: NextApiRequest, res: NextApiResponse): Promise<void> => {
    const code = req.query.code || null;
    const state = req.query.state || null;
    const storedState = req.headers && req.headers.cookie ? cookie.parse(req.headers.cookie)[stateKey] : null;

    if (state === null || state !== storedState) {
        setCookie(res, errorKey, 'state_mismatch', { path: '/' });
        res.redirect('/');
        return;
    }

    if (code === null) {
        setCookie(res, errorKey, req.query.error, { path: '/' });
        res.redirect('/');
        return;
    }

    clearCookie(res, stateKey);

    try {
        const response = await axios({
            method: 'POST',
            url: 'https://accounts.spotify.com/api/token',
            headers: {
                'content-type': 'application/x-www-form-urlencoded',
                Authorization:
                    'Basic ' +
                    Buffer.from(`${process.env.SPOTIFY_CLIENT_ID}:${process.env.SPOTIFY_CLIENT_SECRET}`).toString(
                        'base64'
                    ),
            },
            data: querystring.stringify({
                grant_type: 'authorization_code',
                code,
                redirect_uri: redirectUri,
            }),
        });

        if (response.status !== 200) {
            throw response.status;
        }

        setCookies(res, [
            { name: accessTokenKey, value: response.data.access_token, options: { maxAge: 3600000, path: '/' } },
            { name: refreshTokenKey, value: response.data.refresh_token, options: { maxAge: 3600000, path: '/' } },
        ]);

        res.redirect('/');
    } catch (error) {
        setCookie(res, errorKey, 'invalid_token', { path: '/' });
        res.redirect('/');
    }
};
