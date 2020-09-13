import { Card, CardActions, CardHeader, Checkbox, Link, makeStyles } from '@material-ui/core';
import React from 'react';
import { ImportedPlaylist } from 'store/ducks/ImportWizard';

const useStyles = makeStyles((theme) => ({
    playlistCard: {
        marginBottom: theme.spacing(1),
        padding: theme.spacing(1),
    },
    cardHeader: {
        paddingTop: theme.spacing(1),
        paddingBottom: theme.spacing(1),
        paddingLeft: 0,
        paddingRight: 0,
    },
    playlistDescription: {
        paddingTop: 0,
        paddingBottom: 0,
        paddingLeft: theme.spacing(3),
        paddingRight: 0,
    },
    actionBar: {
        display: 'flex',
        justifyContent: 'flex-end',
        padding: 0,
    },
}));

export type PlaylistCardProps = ImportedPlaylist & {
    onSelect: (selected: boolean) => void;
    actionBar?: React.ReactNode;
};

const PlaylistCard = (props: PlaylistCardProps): JSX.Element => {
    const { playlist, selected, onSelect, actionBar } = props;

    const classes = useStyles();

    const handleSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
        onSelect(event.target.checked);
    };

    return (
        <Card variant="outlined" className={classes.playlistCard}>
            <CardHeader
                avatar={<Checkbox name={`select-playlist-${playlist.id}`} checked={selected} onChange={handleSelect} />}
                title={
                    <React.Fragment>
                        <Link href={playlist.external_urls.spotify}>{playlist.name}</Link> ({playlist.tracks.total}{' '}
                        tracks)
                    </React.Fragment>
                }
                subheader={
                    <React.Fragment>
                        Created by{' '}
                        <Link href={playlist.owner.external_urls.spotify} target="_blank">
                            {playlist.owner.display_name}
                        </Link>
                    </React.Fragment>
                }
                className={classes.cardHeader}
            />
            {actionBar}
        </Card>
    );
};

export default PlaylistCard;
