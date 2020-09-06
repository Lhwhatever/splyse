import { Snackbar } from '@material-ui/core';
import { Alert as MuiAlert } from '@material-ui/lab';
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { clearAlert } from 'store/ducks/alert';
import { RootState } from 'store/store';

export type AlertState = {
    severity: 'error' | 'success';
    message: React.ReactNode;
};

export interface AlertProps {
    autoHideDuration: number;
}

const Alert = (props: AlertProps): JSX.Element => {
    const { ...other } = props;

    const alertState = useSelector((state: RootState) => state.alertReducer);
    const dispatch = useDispatch();

    const handleClose = () => {
        dispatch(clearAlert());
    };

    if (alertState.severity === null) return <Snackbar open={false} onClose={handleClose} />;

    return (
        <Snackbar open={true} onClose={handleClose} {...other}>
            <MuiAlert severity={alertState.severity}>{alertState.message}</MuiAlert>
        </Snackbar>
    );
};

export default Alert;
