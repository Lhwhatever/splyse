import axios, { AxiosRequestConfig } from 'axios';
import Paged, { SpotifyPage } from 'classes/Paged';
import { Playlist } from 'classes/SpotifyObjects';
import querystring from 'querystring';

const apiHost = 'https://api.spotify.com';
const apiVersion = 'v1';
const apiRoot = `${apiHost}/${apiVersion}`;

export type FetchConfig = Omit<AxiosRequestConfig, 'url'>;
export type MethodConfig = Omit<FetchConfig, 'method'>;

export interface FetchResult<T = unknown> {
    data: T;
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

interface EstablishOptions {
    accessToken: string;
    refreshToken: string;

    /**
     * An optional callback to be run if the user profile is
     * successfully gotten.
     */
    onGettingUserProfile?: (profile: UserProfile) => void;

    /**
     * An optional callback to be run whenever the access token
     * changes.
     */
    onAccessTokenChange?: (newToken: string) => void;
}

/**
 * Represents an authorized connection to a user's Spotify account, with the
 * ability to refresh its access token if it has expired. It can use Spotify's
 * RESTful API to fetch information about the user and music on Spotify's
 * database.
 */
export default class SpotifyConnection {
    private constructor(
        private _accessToken: string,
        public readonly refreshToken: string,
        private readonly onAccessTokenChange: (newToken: string) => void
    ) {}

    /**
     * Instantiates SpotifyConnection with the given tokens and verifies
     * whether the tokens work.
     *
     * @param options An object containing the inputs to try establishing the
     * connection with.
     * @returns A Promise of the SpotifyConnection. Rejects if there was an
     * error establishing the connection, e.g. HTTP 401 for invalid tokens.
     */
    public static async establish(options: EstablishOptions): Promise<SpotifyConnection> {
        const {
            accessToken,
            refreshToken,
            onGettingUserProfile = () => undefined,
            onAccessTokenChange = () => undefined,
        } = options;

        const connection = new SpotifyConnection(accessToken, refreshToken, onAccessTokenChange);
        onGettingUserProfile(await connection.fetchUserProfile());
        return connection;
    }

    public get accessToken(): string {
        return this._accessToken;
    }

    protected async fetch<T>(endpoint: string, config: FetchConfig = {}): Promise<FetchResult<T>> {
        const headers = { ...config.headers, Authorization: `Bearer ${this.accessToken}` };
        const { data, status } = await axios(apiRoot + endpoint, { ...config, headers });
        return { data, status };
    }

    /**
     * Attempts to refresh the connection with the given refresh token.
     * Rejects with the Axios error if there is a failure.
     *
     * @returns A Promise of the new access token. _accessToken is
     * automatically replaced with the new access token.
     */
    public async tryRefresh(): Promise<string> {
        const response = await axios({
            url:
                '/api/refresh?' +
                querystring.stringify({
                    refresh_token: this.refreshToken,
                }),
            method: 'GET',
        });

        if (response.status !== 200) throw response;
        this._accessToken = response.data.access_token;
        return this.accessToken;
    }

    protected async get<T>(endpoint: string, config: MethodConfig = {}): Promise<FetchResult<T>> {
        try {
            return this.fetch(endpoint, { ...config, method: 'get' });
        } catch (error) {
            if (error.isAxiosError && error.response.status === 401) {
                this.onAccessTokenChange(await this.tryRefresh());
                return this.fetch(endpoint, { ...config, method: 'get' });
            }

            throw error;
        }
    }

    /**
     * Gets the user's profile from Spotify's database.
     *
     * @returns A Promise of the user's profile. Rejects on HTTP failure
     * statuses.
     */
    public async fetchUserProfile(): Promise<UserProfile> {
        const { data, status } = await this.get<UserProfile>('/me');
        if (status !== 200) throw status;
        return data;
    }

    /**
     * Gets the user's playlists from Spotify's database.
     *
     * @returns A Paged container of the user's playlists.
     */
    public async fetchUserPlaylists(perPage = 50): Promise<Paged<Playlist>> {
        const fetcher = async (limit: number, offset: number) =>
            (
                await this.get<SpotifyPage<Playlist>>('/me/playlists', {
                    params: { limit, offset },
                })
            ).data;

        return Paged.create(perPage, fetcher);
    }
}
