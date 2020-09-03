import React from 'react';
import {
    Box,
    Card,
    CardActions,
    CardContent,
    CardHeader,
    Checkbox,
    IconButton,
    Link,
    makeStyles,
    Typography,
} from '@material-ui/core';
import LinkIcon from '@material-ui/icons/Link';
import { Playlist } from 'classes/SpotifyObjects';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from 'store/store';
import Paged from 'classes/Paged';
import { selectPlaylist, StagedPlaylist } from 'store/ducks/ImportWizard';

const useStyles = makeStyles((theme) => ({
    loadMoreBtn: {
        textTransform: 'uppercase',
        textAlign: 'center',
        padding: theme.spacing(1),
        color: theme.palette.primary.main,
        fontWeight: 'bold',
    },
    playlistCard: {
        marginBottom: theme.spacing(1),
        padding: theme.spacing(1),
    },
}));

type PlaylistCardProps = StagedPlaylist & {
    onSelect: (selected: boolean) => void;
};

const PlaylistCard = (props: PlaylistCardProps): JSX.Element => {
    const { playlist, selected, onSelect } = props;

    const classes = useStyles();

    const handleSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
        onSelect(event.target.checked);
    };

    return (
        <Card variant="outlined" className={classes.playlistCard}>
            <Box display="flex" alignItems="center">
                <Checkbox name={`select-playlist-${playlist.id}`} checked={selected} onChange={handleSelect} />
                <div>
                    <Typography variant="h5">{playlist.name}</Typography>
                </div>
            </Box>
            <Box pl={3}>
                <Typography variant="body2">
                    Created by{' '}
                    <Link href={playlist.owner.external_urls.spotify} target="_blank">
                        {playlist.owner.display_name}
                    </Link>
                </Typography>
                <Typography variant="body2">{playlist.tracks.total} songs</Typography>
            </Box>
            <CardActions disableSpacing>
                <IconButton href={playlist.external_urls.spotify} target="_blank" aria-label="view in spotify">
                    <LinkIcon />
                </IconButton>
            </CardActions>
        </Card>
    );
};

export interface PlaylistsOverviewProps {
    pagedPlaylists: Paged<Playlist>;
}

const PlaylistsOverview = (props: PlaylistsOverviewProps): JSX.Element => {
    const { pagedPlaylists } = props;

    const classes = useStyles();

    const { playlists } = useSelector((state: RootState) => state.importWizard);
    const dispatch = useDispatch();

    return (
        <Box display="flex" flexDirection="column" overflow="scroll">
            {playlists &&
                playlists.map((playlist, index) => {
                    const handleSelection = (selected: boolean) => {
                        dispatch(selectPlaylist(index, selected));
                    };

                    return <PlaylistCard {...playlist} onSelect={handleSelection} key={index} />;
                })}
            <Box className={classes.loadMoreBtn}>Load more items</Box>
        </Box>
    );
};

export default PlaylistsOverview;
