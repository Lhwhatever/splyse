import {
    Checkbox,
    Dialog,
    DialogContent,
    DialogContentText,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    useMediaQuery,
    useTheme,
} from '@material-ui/core';
import SearchField from 'components/SearchField';
import TrackRow from 'components/TrackRow';
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { selectEntirePlaylist } from 'store/ducks/TrackManager';
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
    const dispatch = useDispatch();

    const handleQuit = () => {
        onClose();
    };

    const mobile = useMediaQuery(useTheme().breakpoints.down('xs'));

    const tracks =
        playlist &&
        Object.values(playlist.tracks).map((track) => ({
            ...track,
            artistNames: track.data.track.artists.map((artist) => artist.name).join(', '),
        }));

    const results = tracks ? search(tracks, searchString, ['data.track.name', 'data.track.album', 'artistNames']) : [];

    const hasSelectedTracks = tracks ? tracks.some((track) => track.selected) : false;
    const hasUnselectedTracks = tracks ? tracks.some((track) => !track.selected) : false;

    const handleMasterCheck = active
        ? (event: React.ChangeEvent<HTMLInputElement>) => {
              dispatch(selectEntirePlaylist(active, event.target.checked));
          }
        : () => undefined;

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
                <TableContainer>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell padding="checkbox">
                                    <Checkbox
                                        checked={hasSelectedTracks}
                                        indeterminate={hasSelectedTracks && hasUnselectedTracks}
                                        color="primary"
                                        onChange={handleMasterCheck}
                                    />
                                </TableCell>
                                <TableCell>Track</TableCell>
                                <TableCell />
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {active && results?.length ? (
                                results.map((track) => (
                                    <TrackRow key={track.data.track.uri} {...track} activePlaylistUri={active} />
                                ))
                            ) : (
                                <TableRow>
                                    <TableCell colSpan={3}>No tracks were found.</TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </TableContainer>
            </DialogContent>
        </Dialog>
    );
};

export default TrackDialog;
