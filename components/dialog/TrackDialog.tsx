import { Dialog, DialogContent, DialogContentText, useMediaQuery, useTheme } from '@material-ui/core';
import SearchField from 'components/SearchField';
import TrackTable from 'components/TrackTable';
import React from 'react';
import { useSelector } from 'react-redux';
import { RootState } from 'store/store';
import search from 'utils/search';
import ResponsiveWizardHeader from './ResponsiveWizardHeader';
import StickyDialogHeader from './StickyDialogHeader';

export interface TrackDialogProps {
    active: string | null;
    onClose: () => void;
}

const TrackDialog = (props: TrackDialogProps): JSX.Element => {
    const { active, onClose } = props;

    const [searchString, setSearchString] = React.useState('');

    const { playlists } = useSelector((state: RootState) => state.trackManager);
    const playlist = active ? playlists[active] : null;

    const handleQuit = () => {
        onClose();
    };

    const mobile = useMediaQuery(useTheme().breakpoints.down('xs'));

    const tracks =
        playlist &&
        Object.values(playlist.tracks).map((track) => ({
            ...track,
            artistNames: track.data.track.artists.map((artist) => artist.name).join(', '),
            playlistUri: active!,
        }));

    const results = tracks ? search(tracks, searchString, ['data.track.name', 'data.track.album', 'artistNames']) : [];

    return (
        <Dialog open={active !== null} onClose={handleQuit} fullScreen={mobile}>
            <ResponsiveWizardHeader mobile={mobile} onQuit={handleQuit}>
                {playlist?.data.name}
            </ResponsiveWizardHeader>
            <StickyDialogHeader>
                <DialogContentText>Select tracks to analyze.</DialogContentText>
                <SearchField value={searchString} onChange={setSearchString} />
            </StickyDialogHeader>
            <DialogContent>
                <TrackTable tracks={results} />
            </DialogContent>
        </Dialog>
    );
};

export default TrackDialog;
