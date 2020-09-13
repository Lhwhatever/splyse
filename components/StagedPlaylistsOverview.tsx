import { Box } from '@material-ui/core';
import React from 'react';
import { useDispatch } from 'react-redux';
import { selectEntirePlaylist, StagedPlaylist } from 'store/ducks/TrackManager';
import PlaylistCard from './PlaylistCard';

export interface StagedPlaylistsOverviewProps {
    playlists: StagedPlaylist[];
}

const StagedPlaylistsOverview = (props: StagedPlaylistsOverviewProps): JSX.Element => {
    const { playlists } = props;

    const dispatch = useDispatch();

    return (
        <Box p={1}>
            {playlists.length
                ? playlists.map((playlist) => {
                      const handleSelect = (selected: boolean) => {
                          dispatch(selectEntirePlaylist(playlist.data.uri, selected));
                      };

                      return (
                          <PlaylistCard
                              key={playlist.data.uri}
                              playlist={playlist.data}
                              selected={Object.values(playlist.tracks).some((track) => track.selected)}
                              onSelect={handleSelect}
                          />
                      );
                  })
                : 'No tracks have been imported yet.'}
        </Box>
    );
};

export default StagedPlaylistsOverview;
