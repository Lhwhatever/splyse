import axios, { AxiosRequestConfig, AxiosResponse } from 'axios';

const apiHost = 'https://api.spotify.com';
const apiVersion = 'v1';
const apiRoot = `${apiHost}/${apiVersion}`;

export type FetchConfig = Omit<AxiosRequestConfig, 'url'>;
export type MethodConfig = Omit<FetchConfig, 'method'>;

export interface FetchResult {
    data: any;
    status: number;
}

export interface Images {
    width: number;
    height: number;
    url: string;
}

export interface UserProfile {
    display_name: string;
    external_urls: { spotify: string };
    followers: { href: null; total: number };
    href: string;
    id: string;
    images: Images[];
    type: 'user';
    uri: string;
}

export default class SpotifyConnection {
    public constructor(public accessToken: string, public refreshToken: string) {}

    protected async fetch(endpoint: string, config: FetchConfig = {}): Promise<FetchResult> {
        const headers = { ...config.headers, Authorization: `Bearer ${this.accessToken}` };
        const { data, status } = await axios(apiRoot + endpoint, { ...config, headers });
        console.log(data);
        console.log(status);
        if (status >= 400) throw status;
        return { data, status };
    }

    protected async get(endpoint: string, config: MethodConfig = {}): Promise<FetchResult> {
        return this.fetch(endpoint, { ...config, method: 'get' });
    }

    public async getUserProfile() {
        const { data, status } = await this.get('/me');
        if (status !== 200) throw status;
        return data as UserProfile;
    }
}
