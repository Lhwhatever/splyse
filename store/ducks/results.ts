import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { AudioFeatures, TrackSimplified } from 'classes/SpotifyObjects';
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
    advanced?: AdvancedData;
}

export type ContinuousKey =
    | 'acousticness'
    | 'danceability'
    | 'energy'
    | 'instrumentalness'
    | 'liveness'
    | 'loudness'
    | 'speechiness'
    | 'tempo'
    | 'valence';

const continuousKeys: ContinuousKey[] = [
    'acousticness',
    'danceability',
    'energy',
    'instrumentalness',
    'liveness',
    'loudness',
    'speechiness',
    'tempo',
    'valence',
];

export type ContinuousData = Record<ContinuousKey, number[]>;

export interface DiscreteData {
    timeSignature: Record<number, number>;
    mode: { major: number; minor: number; unknown: number };
    key: Record<number, number>;
}

export type AdvancedData = ContinuousData & DiscreteData;

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
        populateAdvancedData: {
            prepare: (audioFeatures: AudioFeatures[]) => ({
                payload: audioFeatures,
            }),
            reducer: (state, action: PayloadAction<AudioFeatures[]>) => {
                if (state.state.complete) {
                    const { payload } = action;
                    const data: AdvancedData = {
                        acousticness: [],
                        danceability: [],
                        energy: [],
                        instrumentalness: [],
                        liveness: [],
                        loudness: [],
                        speechiness: [],
                        tempo: [],
                        valence: [],

                        timeSignature: {},
                        mode: {
                            major: 0,
                            minor: 0,
                            unknown: 0,
                        },
                        key: {},
                    };

                    payload.forEach((features) => {
                        data.timeSignature[features.time_signature] =
                            1 + (data.timeSignature[features.time_signature] ?? 0);

                        switch (features.mode) {
                            case 1:
                                ++data.mode.major;
                                break;
                            case 0:
                                ++data.mode.minor;
                                break;
                            default:
                                ++data.mode.unknown;
                                break;
                        }

                        data.key[features.key] = 1 + (data.key[features.key] ?? 0);

                        continuousKeys.forEach((key) => {
                            data[key]!.push(features[key]);
                        });
                    });

                    console.log(data);

                    state.state.advanced = data;
                }
            },
        },
    },
});

export default slice.reducer;
const { resetState, populateBasicData, populateAdvancedData } = slice.actions;
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

export const splyse = (
    stagedPlaylists: StagedPlaylist[],
    removeDupes: boolean,
    fetchAudioFeatures: (ids: string[]) => Promise<AudioFeatures[]>
): AppThunk<void> => async (dispatch) => {
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
    dispatch(populateAdvancedData(await fetchAudioFeatures(tracks.map((track) => track.track.id))));
};
