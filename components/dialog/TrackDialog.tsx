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
import TrackRow from 'components/TrackRow';
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { selectEntirePlaylist, selectTrackInPlaylist, StagedPlaylist, StagedTrack } from 'store/ducks/TrackManager';
import { RootState } from 'store/store';
import ResponsiveWizardHeader from './ResponsiveWizardHeader';

export interface TrackDialogProps {
    active: string | null;
    onClose: () => void;
}

const TrackDialog = (props: TrackDialogProps): JSX.Element => {
    const { active, onClose } = props;

    const { playlists } = useSelector((state: RootState) => state.trackManager);
    const playlist = active ? playlists[active] : null;
    const dispatch = useDispatch();

    const handleQuit = () => {
        onClose();
    };

    const mobile = useMediaQuery(useTheme().breakpoints.down('xs'));

    const tracks = playlist && Object.values(playlist.tracks);

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
            <DialogContent>
                <DialogContentText>Select tracks to analyze.</DialogContentText>
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
                            {active &&
                                tracks?.map((track) => (
                                    <TrackRow key={track.data.track.uri} {...track} activePlaylistUri={active} />
                                ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            </DialogContent>
        </Dialog>
    );
};

export default TrackDialog;
