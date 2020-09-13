import { Box, Checkbox, FormControlLabel, makeStyles, MenuItem, TextField } from '@material-ui/core';
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setRemoveDupes } from 'store/ducks/TrackManager';
import { RootState } from 'store/store';

const useStyles = makeStyles((theme) => ({
    viewByModeSelect: {
        marginTop: theme.spacing(1),
        width: 120,
    },
}));

export type TrackManagerViewByMode = 'playlist';

export interface TrackManagerControlsProps {
    viewByMode: 'playlist';
    onViewByModeChange: (newMode: TrackManagerViewByMode) => void;
}

const TrackManagerControls = (props: TrackManagerControlsProps): JSX.Element => {
    const { viewByMode, onViewByModeChange } = props;

    const { removeDupes } = useSelector((state: RootState) => state.trackManager);
    const dispatch = useDispatch();

    const handleCheckRemoveDupes = (event: React.ChangeEvent<HTMLInputElement>) => {
        dispatch(setRemoveDupes(event.target.checked));
    };

    const handleViewByModeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        onViewByModeChange(event.target.value as TrackManagerViewByMode);
    };

    const classes = useStyles();

    return (
        <Box p={1}>
            <FormControlLabel
                control={<Checkbox checked={removeDupes} onChange={handleCheckRemoveDupes} />}
                label="Remove duplicate tracks"
            />
            <TextField
                select
                label="View by..."
                variant="outlined"
                size="small"
                className={classes.viewByModeSelect}
                value={viewByMode}
                onChange={handleViewByModeChange}
            >
                <MenuItem value="playlist">Playlist</MenuItem>
            </TextField>
        </Box>
    );
};

export default TrackManagerControls;
