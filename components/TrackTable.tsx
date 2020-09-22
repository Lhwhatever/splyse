import { Checkbox, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@material-ui/core';
import TrackRow, { TrackRowProps } from 'components/TrackRow';
import React from 'react';
import { useDispatch } from 'react-redux';
import { selectTracks } from 'store/ducks/TrackManager';

interface TrackTableProps {
    tracks: TrackRowProps[];
}

const TrackTable = (props: TrackTableProps): JSX.Element => {
    const { tracks } = props;

    const dispatch = useDispatch();

    const hasSelectedTracks = tracks.some((track) => track.selected);
    const hasUnselectedTracks = tracks.some((track) => !track.selected);

    const handleMasterCheck = (event: React.ChangeEvent<HTMLInputElement>) => {
        dispatch(
            selectTracks(
                tracks.map(({ data, playlistUri }) => ({ playlistUri, trackUri: data.track.uri })),
                event.target.checked
            )
        );
    };

    return (
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
                    {tracks.length ? (
                        tracks.map((track) => <TrackRow key={track.data.track.uri} {...track} />)
                    ) : (
                        <TableRow>
                            <TableCell colSpan={3}>No tracks were found.</TableCell>
                        </TableRow>
                    )}
                </TableBody>
            </Table>
        </TableContainer>
    );
};

export default TrackTable;
