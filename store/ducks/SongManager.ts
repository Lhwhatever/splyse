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
    tracks: StagedTrack[];
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
    name: 'songManager',
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
                    state.playlists[playlist.uri] = {
                        data: playlist,
                        tracks: tracks.map((track) => ({ data: track, selected: true })),
                    };
                });
            },
        },
    },
});

export default slice.reducer;
const { importPlaylists: _importPlaylists, setRemoveDupes } = slice.actions;
export { setRemoveDupes };

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
