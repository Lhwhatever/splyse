export type ExternalUrls = Record<string, string> & { spotify: string };

export interface User {
    display_name: string;
    uri: string;
    type: 'user';
    external_urls: ExternalUrls;
}

export interface PlaylistTracks {
    href: string;
    total: number;
}

export interface Playlist {
    external_urls: ExternalUrls;
    id: string;
    name: string;
    owner: User;
    tracks: PlaylistTracks;
    type: 'playlist';
    uri: string;
}
