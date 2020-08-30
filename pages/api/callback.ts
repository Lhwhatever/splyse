import axios from 'axios';
import cookie from 'cookie';
import { NextApiRequest, NextApiResponse } from 'next';
import querystring from 'querystring';
import { clearCookie } from 'utils/cookies';
import { redirectUri, stateKey } from 'utils/serverside';

export default async (req: NextApiRequest, res: NextApiResponse): Promise<void> => {
    const code = req.query.code || null;
    const state = req.query.state || null;
    const storedState = req.headers && req.headers.cookie ? cookie.parse(req.headers.cookie)[stateKey] : null;

    if (state === null || state !== storedState) {
        res.redirect('/#' + querystring.stringify({ error: 'state_mismatch' }));
        return;
    }

    if (code === null) {
        res.redirect('/#' + querystring.stringify({ error: req.query.error }));
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

        res.redirect(
            '/#' +
                querystring.stringify({
                    access_token: response.data.access_token,
                    refresh_token: response.data.refresh_token,
                })
        );
    } catch (error) {
        res.redirect('/#' + querystring.stringify({ error: 'invalid_token' }));
    }
};
