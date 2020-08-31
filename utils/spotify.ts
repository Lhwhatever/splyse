import axios, { AxiosRequestConfig, AxiosResponse } from 'axios';
import querystring from 'querystring';

const apiHost = 'https://api.spotify.com';
const apiVersion = 'v1';
const apiRoot = `${apiHost}/${apiVersion}`;

export type FetchConfig = Omit<AxiosRequestConfig, 'url'>;
export type MethodConfig = Omit<FetchConfig, 'method'>;

export interface FetchResult {
    data: unknown;
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
        return { data, status };
    }

    protected async get(endpoint: string, config: MethodConfig = {}): Promise<FetchResult> {
        return this.fetch(endpoint, { ...config, method: 'get' });
    }

    public async getUserProfile(): Promise<UserProfile> {
        const { data, status } = await this.get('/me');
        if (status !== 200) throw status;
        return data as UserProfile;
    }

    public async verify(): Promise<UserProfile> {
        try {
            return await this.getUserProfile();
        } catch (error) {
            // Authorization failed, try getting a refresh token
            if (error.isAxiosError && error.response.status === 401) {
                const response = await axios({
                    url:
                        '/api/refresh?' +
                        querystring.stringify({
                            refresh_token: this.refreshToken,
                        }),
                    method: 'GET',
                });

                // Successfully got refresh token
                if (response.status === 200) {
                    this.accessToken = response.data.access_token;
                    return this.verify();
                }

                throw response.status;
            }

            throw error;
        }
    }
}
