import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { TrackSimplified } from 'classes/SpotifyObjects';
import { AppThunk } from 'store/store';
import { setAlert } from './alert';
import { StagedPlaylist } from './TrackManager';

interface NoResults {
    complete: false;
}

export interface HasResults {
    complete: true;
    explicit: {
        true: number;
        false: number;
    };
    durations: number[];
    popularities: number[];
    artists: Record<string, number>;
}

export interface ResultState {
    state: NoResults | HasResults;
}

const initialState: ResultState = { state: { complete: false } };

const slice = createSlice({
    name: 'results',
    initialState,
    reducers: {
        resetState(state) {
            state.state = { complete: false };
        },
        populateBasicData: {
            prepare: (data: Omit<HasResults, 'complete'>) => ({
                payload: {
                    complete: true,
                    ...data,
                } as HasResults,
            }),
            reducer: (state, action: PayloadAction<HasResults>) => {
                state.state = action.payload;
            },
        },
    },
});

export default slice.reducer;
const { resetState, populateBasicData } = slice.actions;
export { resetState };

const getTracks = (stagedPlaylists: StagedPlaylist[], removeDupes: boolean): TrackSimplified[] => {
    if (!removeDupes)
        return stagedPlaylists
            .flatMap((playlist) => Object.values(playlist.tracks).filter((track) => track.selected))
            .map((track) => track.data);

    const record: Record<string, TrackSimplified> = {};

    stagedPlaylists
        .flatMap((playlist) => Object.entries(playlist.tracks))
        .forEach(([uri, track]) => {
            if (track.selected) {
                record[uri] = track.data;
            }
        });

    return Object.values(record);
};

export const splyse = (stagedPlaylists: StagedPlaylist[], removeDupes: boolean): AppThunk<void> => async (dispatch) => {
    const tracks = getTracks(stagedPlaylists, removeDupes);

    if (!tracks.length) {
        dispatch(setAlert({ severity: 'error', message: 'Could not find any tracks. Add some tracks and try again.' }));
        return;
    }

    const simpleData: Omit<HasResults, 'complete'> = {
        explicit: { true: 0, false: 0 },
        durations: [],
        popularities: [],
        artists: {},
    };

    // count stuff
    tracks.forEach(({ track }) => {
        const { explicit, duration_ms, popularity, artists } = track;
        if (explicit) {
            ++simpleData.explicit.true;
        } else {
            ++simpleData.explicit.false;
        }

        simpleData.durations.push(duration_ms);
        simpleData.popularities.push(popularity);

        artists.forEach((artist) => {
            simpleData.artists[artist.name] = 1 + (simpleData.artists[artist.name] ?? 0);
        });
    });

    dispatch(populateBasicData(simpleData));
};
