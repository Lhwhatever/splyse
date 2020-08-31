import { Snackbar } from '@material-ui/core';
import { Alert as MuiAlert } from '@material-ui/lab';
import React from 'react';

export type AlertState = {
    severity: 'error' | 'success';
    message: React.ReactNode;
};

export interface AlertProps {
    state: AlertState | null;
    autoHideDuration: number;
    onClose: () => void;
}

const Alert = (props: AlertProps): JSX.Element => {
    const { state, ...other } = props;

    return (
        <Snackbar open={state !== null} {...other}>
            <MuiAlert severity={state?.severity}>{state?.message}</MuiAlert>
        </Snackbar>
    );
};

export default Alert;
