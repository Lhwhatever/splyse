import { Box, Button, Paper, Typography } from '@material-ui/core';
import Paged from 'classes/Paged';
import SpotifyConnection from 'classes/SpotifyConnection';
import { Playlist } from 'classes/SpotifyObjects';
import React from 'react';
import { useDispatch } from 'react-redux';
import { loadFirstPage } from 'store/ducks/ImportWizard';
import ImportWizard from './ImportWizard';

export interface SongManagerProps {
    connection: SpotifyConnection;
    onConnectionFailure: () => void;
}

const SongManager = (props: SongManagerProps): JSX.Element => {
    const { connection, onConnectionFailure } = props;

    const [wizardOpen, setWizardOpen] = React.useState(false);
    const [pagedPlaylists, setPagedPlaylists] = React.useState<Paged<Playlist> | undefined>(undefined);

    const dispatch = useDispatch();

    const handleImportPlaylists = async () => {
        setWizardOpen(true);
        try {
            const playlists = await connection.fetchUserPlaylists();
            setPagedPlaylists(playlists);
            dispatch(loadFirstPage(await playlists.fetchNext()));
        } catch (error) {
            onConnectionFailure();
        }
    };

    const handleImportPlaylistWizardClose = () => {
        setWizardOpen(false);
    };

    return (
        <Paper>
            <Box p={2}>
                <Typography variant="h5">Manage Songs</Typography>
                <Button variant="contained" onClick={handleImportPlaylists}>
                    Import Playlists
                </Button>
                <ImportWizard
                    open={wizardOpen}
                    onClose={handleImportPlaylistWizardClose}
                    pagedPlaylists={pagedPlaylists}
                />
            </Box>
        </Paper>
    );
};

export default SongManager;
