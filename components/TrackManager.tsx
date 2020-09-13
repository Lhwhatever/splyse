import { Box, Button, Paper, Typography } from '@material-ui/core';
import Paged from 'classes/Paged';
import SpotifyConnection from 'classes/SpotifyConnection';
import { Playlist } from 'classes/SpotifyObjects';
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { loadFirstPage } from 'store/ducks/ImportWizard';
import { importPlaylists } from 'store/ducks/SongManager';
import { AppDispatch, RootState } from 'store/store';
import ImportWizard from './ImportWizard';
import SongManagerControls, { SongManagerViewByMode } from './TrackManagerControls';

export interface SongManagerProps {
    connection: SpotifyConnection;
    onConnectionFailure: () => void;
}

const TrackManager = (props: SongManagerProps): JSX.Element => {
    const { connection, onConnectionFailure } = props;

    const [wizardOpen, setWizardOpen] = React.useState(false);
    const [importedPlaylistContainer, setImportedPlaylistContainer] = React.useState<Paged<Playlist> | undefined>(
        undefined
    );

    const [viewByMode, setViewByMode] = React.useState<SongManagerViewByMode>('playlist');

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

    const stagedPlaylists = Object.values(songManager.playlists);

    return (
        <Paper>
            <Box p={2}>
                <Typography variant="h5">Manage Songs</Typography>
                <Box p={1}>
                    <Button variant="contained" onClick={handleImportPlaylistWizardOpen}>
                        Import Playlists
                    </Button>
                </Box>
                <SongManagerControls viewByMode={viewByMode} onViewByModeChange={setViewByMode} />
                <ImportWizard
                    open={wizardOpen}
                    onClose={handleImportPlaylistWizardClose}
                    playlistContainer={importedPlaylistContainer}
                    onConnectionFailure={onConnectionFailure}
                    onImport={handleImportPlaylistWizardImport}
                />
            </Box>
        </Paper>
    );
};

export default TrackManager;
