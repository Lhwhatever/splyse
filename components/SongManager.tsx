import {
    Box,
    Button,
    Checkbox,
    FormControlLabel,
    makeStyles,
    MenuItem,
    Paper,
    TextField,
    Typography,
} from '@material-ui/core';
import Paged from 'classes/Paged';
import SpotifyConnection from 'classes/SpotifyConnection';
import { Playlist } from 'classes/SpotifyObjects';
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { loadFirstPage } from 'store/ducks/ImportWizard';
import { importPlaylists, setRemoveDupes } from 'store/ducks/SongManager';
import { AppDispatch, RootState } from 'store/store';
import ImportWizard from './ImportWizard';

const useStyles = makeStyles((theme) => ({
    viewByModeSelect: {
        marginTop: theme.spacing(1),
        width: 120,
    },
}));

export interface SongManagerProps {
    connection: SpotifyConnection;
    onConnectionFailure: () => void;
}

const SongManager = (props: SongManagerProps): JSX.Element => {
    const { connection, onConnectionFailure } = props;
    const classes = useStyles();

    const [wizardOpen, setWizardOpen] = React.useState(false);
    const [importedPlaylistContainer, setImportedPlaylistContainer] = React.useState<Paged<Playlist> | undefined>(
        undefined
    );

    const [viewByMode, setViewByMode] = React.useState<string>('playlist');

    const { importWizard, songManager } = useSelector((state: RootState) => state);
    const dispatch: AppDispatch = useDispatch();

    const handleImportPlaylistWizardOpen = async () => {
        setWizardOpen(true);
        try {
            const playlists = await connection.fetchUserPlaylists();
            setImportedPlaylistContainer(playlists);
            dispatch(loadFirstPage(await playlists.fetchNext()));
        } catch (error) {
            onConnectionFailure();
        }
    };

    const handleImportPlaylistWizardImport = async () => {
        const playlists = Object.values(importWizard.playlists);
        await dispatch(importPlaylists(playlists, connection));
        handleImportPlaylistWizardClose();
    };

    const handleImportPlaylistWizardClose = () => {
        setWizardOpen(false);
    };

    const handleCheckRemoveDupes = (event: React.ChangeEvent<HTMLInputElement>) => {
        dispatch(setRemoveDupes(event.target.checked));
    };

    const stagedPlaylists = Object.values(songManager.playlists);

    const handleViewByModeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setViewByMode(event.target.value);
    };

    return (
        <Paper>
            <Box p={2}>
                <Typography variant="h5">Manage Songs</Typography>
                <Box p={1}>
                    <Button variant="contained" onClick={handleImportPlaylistWizardOpen}>
                        Import Playlists
                    </Button>
                </Box>
                <Box p={1}>
                    <FormControlLabel
                        control={<Checkbox checked={songManager.removeDupes} onChange={handleCheckRemoveDupes} />}
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
                <ImportWizard
                    open={wizardOpen}
                    onClose={handleImportPlaylistWizardClose}
                    playlistContainer={importedPlaylistContainer}
                    onConnectionFailure={onConnectionFailure}
                    onImport={handleImportPlaylistWizardImport}
                />
                <Box p={1}>{stagedPlaylists.length || 'No tracks have been imported yet.'}</Box>
            </Box>
        </Paper>
    );
};

export default SongManager;
