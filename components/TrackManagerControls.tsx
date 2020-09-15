import { Box, Checkbox, FormControlLabel, makeStyles, MenuItem, TextField } from '@material-ui/core';
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setRemoveDupes } from 'store/ducks/TrackManager';
import { RootState } from 'store/store';
import SearchField from './SearchField';

const useStyles = makeStyles((theme) => ({
    root: {
        display: 'flex',
        flexDirection: 'column',
        gap: `${theme.spacing(1)}px`,
        padding: theme.spacing(1),
    },
    viewByModeSelect: {
        marginTop: theme.spacing(1),
        width: 120,
    },
}));

export type TrackManagerViewByMode = 'playlist';

export interface TrackManagerControlsProps {
    viewByMode: 'playlist';
    onViewByModeChange: (newMode: TrackManagerViewByMode) => void;
    searchString: string;
    onSearchStringChange: (searchString: string) => void;
}

const TrackManagerControls = (props: TrackManagerControlsProps): JSX.Element => {
    const { viewByMode, onViewByModeChange, searchString, onSearchStringChange } = props;

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
        <Box className={classes.root}>
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
            <SearchField value={searchString} onChange={onSearchStringChange} />
        </Box>
    );
};

export default TrackManagerControls;
