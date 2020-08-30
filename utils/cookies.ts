import { CookieSerializeOptions, serialize } from 'cookie';
import { NextApiResponse } from 'next';

export type SetCookieOptions = CookieSerializeOptions & {
    expires?: Date;
    maxAge?: number;
};

export function setCookie(res: NextApiResponse, name: string, value: unknown, options: SetCookieOptions = {}): void {
    const stringValue = typeof value === 'object' ? JSON.stringify(value) : String(value);

    if (options.maxAge !== undefined) {
        options.expires = new Date(Date.now() + options.maxAge);
        options.maxAge /= 1000;
    }

    res.setHeader('Set-Cookie', serialize(name, stringValue, options));
}

export function clearCookie(res: NextApiResponse, name: string): void {
    setCookie(res, name, '', { expires: new Date(0) });
}
