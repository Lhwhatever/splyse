import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import Paged from 'classes/Paged';
import { Playlist } from 'classes/SpotifyObjects';

export interface StagedPlaylist {
    playlist: Playlist;
    selected: boolean;
}

export interface WizardState {
    playlists: StagedPlaylist[];
}

const initialState: WizardState = {
    playlists: [],
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
                state.playlists = action.payload;
            },
        },
        selectPlaylist: {
            prepare: (index: number, selected: boolean) => ({ payload: { index, selected } }),
            reducer: (state, action: PayloadAction<{ index: number; selected: boolean }>) => {
                const { index, selected } = action.payload;
                state.playlists[index].selected = selected;
            },
        },
    },
});

const { loadFirstPage, selectPlaylist } = slice.actions;
export { loadFirstPage, selectPlaylist };

export default slice.reducer;
