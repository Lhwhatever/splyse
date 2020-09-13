import { Box, Button, CardActions, withStyles } from '@material-ui/core';
import React from 'react';
import { useDispatch } from 'react-redux';
import { selectEntirePlaylist, StagedPlaylist } from 'store/ducks/TrackManager';
import TrackDialog from './dialog/TrackDialog';
import PlaylistCard from './PlaylistCard';

export interface StagedPlaylistsOverviewProps {
    playlists: StagedPlaylist[];
}

const RightAlignedCardActions = withStyles({
    root: {
        display: 'flex',
        justifyContent: 'flex-end',
    },
})(CardActions);

const StagedPlaylistsOverview = (props: StagedPlaylistsOverviewProps): JSX.Element => {
    const { playlists } = props;

    const [activePlaylist, setActivePlaylist] = React.useState<string | null>(null);

    const dispatch = useDispatch();

    const handleClose = () => {
        setActivePlaylist(null);
    };

    return (
        <Box py={1}>
            {playlists.length
                ? playlists.map((playlist) => {
                      const handleSelect = (selected: boolean) => {
                          dispatch(selectEntirePlaylist(playlist.data.uri, selected));
                      };

                      const handleViewTracks = () => {
                          setActivePlaylist(playlist.data.uri);
                      };

                      return (
                          <PlaylistCard
                              key={playlist.data.uri}
                              playlist={playlist.data}
                              selected={Object.values(playlist.tracks).some((track) => track.selected)}
                              onSelect={handleSelect}
                              actionBar={
                                  <RightAlignedCardActions>
                                      <Button onClick={handleViewTracks}>View Tracks</Button>
                                  </RightAlignedCardActions>
                              }
                          />
                      );
                  })
                : 'No tracks have been imported yet.'}
            <TrackDialog active={activePlaylist} onClose={handleClose} />
        </Box>
    );
};

export default StagedPlaylistsOverview;
