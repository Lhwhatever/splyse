import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import Paged from 'classes/Paged';
import { Playlist } from 'classes/SpotifyObjects';
import { AppThunk, ChainableThunk } from 'store/store';

export interface ImportedPlaylist {
    playlist: Playlist;
    selected: boolean;
}

export interface WizardState {
    playlists: Record<string, ImportedPlaylist>;
}

const initialState: WizardState = {
    playlists: {},
};

const slice = createSlice({
    name: 'importWizard',
    initialState,
    reducers: {
        loadFirstPage: {
            prepare: (playlists: Playlist[]) => ({
                payload: playlists.map((playlist) => ({ playlist, selected: false })),
            }),
            reducer: (state, action: PayloadAction<ImportedPlaylist[]>) => {
                state.playlists = {};
                action.payload.forEach((playlist) => {
                    state.playlists[playlist.playlist.uri] = playlist;
                });
            },
        },
        concatPage: {
            prepare: (playlists: Playlist[]) => ({
                payload: playlists.map((playlist) => ({ playlist, selected: false })),
            }),
            reducer: (state, action: PayloadAction<ImportedPlaylist[]>) => {
                action.payload.forEach((playlist) => {
                    state.playlists[playlist.playlist.uri] = playlist;
                });
            },
        },
        selectPlaylist: {
            prepare: (uri: string, selected: boolean) => ({ payload: { uri, selected } }),
            reducer: (state, action: PayloadAction<{ uri: string; selected: boolean }>) => {
                const { uri, selected } = action.payload;
                state.playlists[uri].selected = selected;
            },
        },
    },
});

export default slice.reducer;

const { loadFirstPage, selectPlaylist, concatPage } = slice.actions;
export { loadFirstPage, selectPlaylist };

export const loadNextPage = (playlistContainer: Paged<Playlist>): ChainableThunk<ImportedPlaylist[]> => {
    return async (dispatch) => dispatch(concatPage(await playlistContainer.fetchNext()));
};

export const loadAll = (playlistContainer: Paged<Playlist>): ChainableThunk<ImportedPlaylist[]> => {
    return async (dispatch) => dispatch(concatPage(await playlistContainer.fetchAll()));
};
