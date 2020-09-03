import { Box, Button, Paper, Typography } from '@material-ui/core';
import Paged from 'classes/Paged';
import SpotifyConnection from 'classes/SpotifyConnection';
import { Playlist } from 'classes/SpotifyObjects';
import React from 'react';

export interface SongManagerProps {
    connection: SpotifyConnection;
}

const SongManager = (props: SongManagerProps): JSX.Element => {
    const { connection } = props;

    const handleImportPlaylists = async () => {
        let playlists: Paged<Playlist>;

        try {
            playlists = await connection.fetchUserPlaylists();
        } catch (error) {
            console.log(error);
            throw error;
        }

        console.log(playlists.fetchNext());
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
