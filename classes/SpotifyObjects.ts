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

export interface Artist {
    external_urls: ExternalUrls;
    href: string;
    id: string;
    uri: string;
    name: string;
    type: 'artist';
}

export interface Track {
    duration_ms: number;
    external_urls: ExternalUrls;
    id: string;
    uri: string;
    name: string;
    popularity: number;
    artists: Artist[];
    type: 'track';
}

export interface TrackSimplified {
    added_at: string;
    is_local: boolean;
    track: Track;
}
