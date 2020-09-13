import { Box, Button, Paper, Typography } from '@material-ui/core';
import Paged from 'classes/Paged';
import SpotifyConnection from 'classes/SpotifyConnection';
import { Playlist } from 'classes/SpotifyObjects';
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { loadFirstPage } from 'store/ducks/ImportWizard';
import { importPlaylists } from 'store/ducks/TrackManager';
import { AppDispatch, RootState } from 'store/store';
import ImportWizard from './ImportWizard';
import TrackManagerControls, { TrackManagerViewByMode } from './TrackManagerControls';
import StagedPlaylistsOverview from './StagedPlaylistsOverview';

export interface TrackManagerProps {
    connection: SpotifyConnection;
    onConnectionFailure: () => void;
}

const TrackManager = (props: TrackManagerProps): JSX.Element => {
    const { connection, onConnectionFailure } = props;

    const [wizardOpen, setWizardOpen] = React.useState(false);
    const [importedPlaylistContainer, setImportedPlaylistContainer] = React.useState<Paged<Playlist> | undefined>(
        undefined
    );

    const [viewByMode, setViewByMode] = React.useState<TrackManagerViewByMode>('playlist');

    const { importWizard, trackManager } = useSelector((state: RootState) => state);
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

    const stagedPlaylists = Object.values(trackManager.playlists);

    return (
        <Paper>
            <Box p={2}>
                <Typography variant="h5">Manage Songs</Typography>
                <Box p={1}>
                    <Button variant="contained" onClick={handleImportPlaylistWizardOpen}>
                        Import Playlists
                    </Button>
                </Box>
                <TrackManagerControls viewByMode={viewByMode} onViewByModeChange={setViewByMode} />
                <ImportWizard
                    open={wizardOpen}
                    onClose={handleImportPlaylistWizardClose}
                    playlistContainer={importedPlaylistContainer}
                    onConnectionFailure={onConnectionFailure}
                    onImport={handleImportPlaylistWizardImport}
                />
                <StagedPlaylistsOverview playlists={stagedPlaylists} />
            </Box>
        </Paper>
    );
};

export default TrackManager;
