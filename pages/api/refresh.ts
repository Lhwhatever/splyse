import axios from 'axios';
import { NextApiRequest, NextApiResponse } from 'next';
import querystring from 'querystring';

export default async (req: NextApiRequest, res: NextApiResponse): Promise<void> => {
    const refresh_token = req.query.refresh_token || null;

    if (refresh_token === null) {
        res.redirect('/?' + querystring.stringify({ error: 'no_refresh_token' }));
        return;
    }

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
                grant_type: 'refresh_token',
                refresh_token: refresh_token,
            }),
        });

        if (response.status !== 200) {
            throw response.status;
        }

        res.status(200).json({
            access_token: response.data.access_token,
        });
    } catch (error) {
        res.status(400).json({ error: 'invalid_refresh_token' });
    }
};
