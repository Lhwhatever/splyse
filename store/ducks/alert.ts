import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export const NO_ALERT = { severity: null };

export interface Alert {
    severity: 'error' | 'success' | 'info';
    message: string;
}

export type AlertState = typeof NO_ALERT | Alert;

const slice = createSlice({
    name: 'alerts',
    initialState: NO_ALERT as AlertState,
    reducers: {
        setAlert(state, action: PayloadAction<Alert>) {
            Object.assign(state, action.payload);
        },
        clearAlert(state) {
            Object.assign(state, NO_ALERT);
        },
    },
});

export default slice.reducer;

const { setAlert, clearAlert } = slice.actions;
export { setAlert, clearAlert };
