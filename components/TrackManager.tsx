import { Box, Button, Paper, Typography } from '@material-ui/core';
import Paged from 'classes/Paged';
import SpotifyConnection from 'classes/SpotifyConnection';
import { Playlist } from 'classes/SpotifyObjects';
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { loadFirstPage } from 'store/ducks/ImportWizard';
import { splyse } from 'store/ducks/results';
import { importPlaylists } from 'store/ducks/TrackManager';
import { AppDispatch, RootState } from 'store/store';
import search from 'utils/search';
import ImportWizard from './ImportWizard';
import StagedPlaylistsOverview from './StagedPlaylistsOverview';
import TrackManagerControls, { TrackManagerViewByMode } from './TrackManagerControls';
import TrackTable from './TrackTable';

export interface TrackManagerProps {
    connection: SpotifyConnection;
    onConnectionFailure: () => void;
}

const TrackManager = (props: TrackManagerProps): JSX.Element => {
    const { connection, onConnectionFailure } = props;

    const [wizardOpen, setWizardOpen] = React.useState(false);
    const [searchString, setSearchString] = React.useState('');
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

    const handleSplyse = () => {
        dispatch(splyse(stagedPlaylists, trackManager.removeDupes));
    };

    const stagedPlaylists = Object.values(trackManager.playlists);
    const results = search(stagedPlaylists, searchString, ['data.name', 'data.owner.display_name']);

    return (
        <Paper>
            <Box p={2}>
                <Typography variant="h5">Manage Songs</Typography>
                <Box p={1}>
                    <Button variant="contained" onClick={handleImportPlaylistWizardOpen}>
                        Import Playlists
                    </Button>
                </Box>
                <TrackManagerControls
                    viewByMode={viewByMode}
                    onViewByModeChange={setViewByMode}
                    searchString={searchString}
                    onSearchStringChange={setSearchString}
                />
                <ImportWizard
                    open={wizardOpen}
                    onClose={handleImportPlaylistWizardClose}
                    playlistContainer={importedPlaylistContainer}
                    onConnectionFailure={onConnectionFailure}
                    onImport={handleImportPlaylistWizardImport}
                />
                {viewByMode === 'playlist' ? (
                    <StagedPlaylistsOverview playlists={results} />
                ) : (
                    <Box py={1}>
                        <TrackTable
                            tracks={search(
                                stagedPlaylists.flatMap(({ data, tracks }) =>
                                    Object.entries(tracks).map(([playlistUri, track]) => ({
                                        playlistName: data.name,
                                        playlistUri,
                                        artistNames: track.data.track.artists.map((artist) => artist.name).join(', '),
                                        ...track,
                                    }))
                                ),
                                searchString,
                                ['artistNames', 'playlistName', 'data.track.name']
                            )}
                        />
                    </Box>
                )}
                <Box display="flex" justifyContent="flex-end">
                    <Button variant="contained" color="primary" onClick={handleSplyse}>
                        Splyse
                    </Button>
                </Box>
            </Box>
        </Paper>
    );
};

export default TrackManager;
