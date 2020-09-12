import { Box, Button } from '@material-ui/core';
import Paged from 'classes/Paged';
import { Playlist } from 'classes/SpotifyObjects';
import FuzzySearch from 'fuzzy-search';
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { loadNextPage, selectPlaylist } from 'store/ducks/ImportWizard';
import { AppDispatch, RootState } from 'store/store';
import PlaylistCard from './PlaylistCard';

export interface PlaylistsOverviewProps {
    searchString?: string;
    playlistContainer: Paged<Playlist>;
    onConnectionFailure: () => void;
}

const PlaylistsOverview = (props: PlaylistsOverviewProps): JSX.Element => {
    const { searchString, playlistContainer, onConnectionFailure } = props;

    const { playlists } = useSelector((state: RootState) => state.importWizard);
    const dispatch: AppDispatch = useDispatch();

    const values = Object.values(playlists);
    const itemsLeft = playlistContainer.length - values.length;

    const searcher = new FuzzySearch(values, ['playlist.name', 'playlist.owner.display_name'], { sort: true });
    const results = searchString === undefined ? values : searcher.search(searchString);

    const handleLoadNextPage = () => {
        try {
            dispatch(loadNextPage(playlistContainer));
        } catch (error) {
            onConnectionFailure();
        }
    };

    return (
        <Box display="flex" flexDirection="column">
            {results.length
                ? results.map((playlist) => {
                      const { uri } = playlist.playlist;
                      const handleSelection = (selected: boolean) => {
                          dispatch(selectPlaylist(uri, selected));
                      };

                      return <PlaylistCard {...playlist} onSelect={handleSelection} key={uri} />;
                  })
                : 'No results were found.'}
            {itemsLeft > 0 && (
                <Box display="flex" justifyContent="center">
                    <Button color="primary" onClick={handleLoadNextPage}>
                        Load {Math.min(itemsLeft, playlistContainer.perPage)} more ({itemsLeft} left)
                    </Button>
                </Box>
            )}
        </Box>
    );
};

export default PlaylistsOverview;
