import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import SpotifyConnection from 'classes/SpotifyConnection';
import { Playlist, Track } from 'classes/SpotifyObjects';
import { AppThunk } from 'store/store';
import { ImportedPlaylist } from './ImportWizard';

export interface StagedTrack {
    data: Track;
    selected: boolean;
}

export interface StagedPlaylist {
    data: Playlist;
    tracks: Record<string, StagedTrack>;
}

export interface ManagerState {
    playlists: Record<string, StagedPlaylist>;
    removeDupes: boolean;
}

export interface PlaylistAndTracks {
    playlist: Playlist;
    tracks: Track[];
}

const initialState: ManagerState = {
    playlists: {},
    removeDupes: true,
};

const slice = createSlice({
    name: 'trackManager',
    initialState,
    reducers: {
        setRemoveDupes: {
            prepare: (removeDupes: boolean) => ({ payload: removeDupes }),
            reducer: (state, action: PayloadAction<boolean>) => {
                state.removeDupes = action.payload;
            },
        },
        importPlaylists: {
            prepare: (playlists: PlaylistAndTracks[]) => ({ payload: playlists }),
            reducer: (state, action: PayloadAction<PlaylistAndTracks[]>) => {
                action.payload.map(({ playlist, tracks }) => {
                    const playlistTracks: Record<string, StagedTrack> = {};
                    tracks.forEach((track) => {
                        playlistTracks[track.uri] = { data: track, selected: true };
                    });

                    state.playlists[playlist.uri] = {
                        data: playlist,
                        tracks: playlistTracks,
                    };
                });
            },
        },
        selectEntirePlaylist: {
            prepare: (playlistUri: string, selected: boolean) => ({ payload: { playlistUri, selected } }),
            reducer: (state, action: PayloadAction<{ playlistUri: string; selected: boolean }>) => {
                const { playlistUri, selected } = action.payload;
                Object.values(state.playlists[playlistUri].tracks).forEach((track) => {
                    track.selected = selected;
                });
            },
        },
    },
});

export default slice.reducer;
const { importPlaylists: _importPlaylists, setRemoveDupes, selectEntirePlaylist } = slice.actions;
export { setRemoveDupes, selectEntirePlaylist };

export const importPlaylists = (
    playlist: ImportedPlaylist[],
    connection: SpotifyConnection
): AppThunk<Promise<PayloadAction<PlaylistAndTracks[]>>> => async (dispatch) => {
    const results = await Promise.allSettled(
        playlist.map(async ({ playlist, selected }) => {
            if (!selected) throw 'not selected';
            return {
                playlist,
                tracks: await (await connection.fetchPlaylistTracks(playlist.id)).fetchAll(),
            };
        })
    );

    return dispatch(
        _importPlaylists(
            results.reduce((list, result) => {
                if (result.status === 'fulfilled') return list.concat(result.value);
                return list;
            }, [] as PlaylistAndTracks[])
        )
    );
};
