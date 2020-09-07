import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import Paged from 'classes/Paged';
import { Playlist, Track } from 'classes/SpotifyObjects';
import { AppThunk } from 'store/store';

export interface StagedPlaylist {
    playlist: Playlist;
    selected: boolean;
    tracks?: Track[];
}

export interface WizardState {
    playlists: Record<string, StagedPlaylist>;
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
            reducer: (state, action: PayloadAction<StagedPlaylist[]>) => {
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
            reducer: (state, action: PayloadAction<StagedPlaylist[]>) => {
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

export const loadNextPage = (playlistContainer: Paged<Playlist>, onConnectionFailure: () => void): AppThunk => async (
    dispatch
) => {
    try {
        dispatch(concatPage(await playlistContainer.fetchNext()));
    } catch (error) {
        onConnectionFailure();
        throw error;
    }
};

export const loadAll = (
    playlistContainer: Paged<Playlist>,
    onConnectionFailure: () => void,
    onSuccess: () => void = () => undefined
): AppThunk<Promise<void>> => (dispatch) => {
    return playlistContainer.fetchAll().then(
        (playlists) => {
            dispatch(concatPage(playlists));
            onSuccess();
        },
        () => onConnectionFailure()
    );
};
