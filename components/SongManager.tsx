import { Box, Button, Paper, Typography } from '@material-ui/core';
import Paged from 'classes/Paged';
import SpotifyConnection from 'classes/SpotifyConnection';
import { Playlist } from 'classes/SpotifyObjects';
import React from 'react';

export interface SongManagerProps {
    connection: SpotifyConnection;
    onConnectionFailure: () => void;
}

const SongManager = (props: SongManagerProps): JSX.Element => {
    const { connection, onConnectionFailure } = props;

    const handleImportPlaylists = async () => {
        try {
            const playlists = await connection.fetchUserPlaylists();
            console.log(playlists.fetchNext());
        } catch (error) {
            onConnectionFailure();
        }
    };

    return (
        <Paper>
            <Box p={2}>
                <Typography variant="h5">Manage Songs</Typography>
                <Button variant="contained" onClick={handleImportPlaylists}>
                    Import Playlists
                </Button>
            </Box>
        </Paper>
    );
};

export default SongManager;
