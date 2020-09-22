import {
    Checkbox,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableFooter,
    TableHead,
    TablePagination,
    TableRow,
} from '@material-ui/core';
import { Pagination } from '@material-ui/lab';
import TrackRow, { TrackRowProps } from 'components/TrackRow';
import React from 'react';
import { useDispatch } from 'react-redux';
import { selectTracks } from 'store/ducks/TrackManager';

interface TrackTableProps {
    tracks: TrackRowProps[];
}

const TrackTable = (props: TrackTableProps): JSX.Element => {
    const { tracks } = props;

    const [page, setPage] = React.useState(0);
    const [tracksPerPage, setTracksPerPage] = React.useState(5);

    const dispatch = useDispatch();

    const hasSelectedTracks = tracks.some((track) => track.selected);
    const hasUnselectedTracks = tracks.some((track) => !track.selected);

    const start = page * tracksPerPage;
    const end = (page + 1) * tracksPerPage;

    const displayedTracks = () =>
        tracksPerPage === -1 ? '' : `${start + 1}-${Math.min(end, tracks.length)} of ${tracks.length}`;

    const handleMasterCheck = (event: React.ChangeEvent<HTMLInputElement>) => {
        dispatch(
            selectTracks(
                tracks.map(({ data, playlistUri }) => ({ playlistUri, trackUri: data.track.uri })),
                event.target.checked
            )
        );
    };

    const handlePageChange = (_: unknown, newPage: number) => {
        setPage(newPage - 1);
    };

    const handleTracksPerPageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const newTracksPerPage = parseInt(event.target.value, 10);
        setTracksPerPage(newTracksPerPage);
        setPage(Math.floor((page * tracksPerPage) / newTracksPerPage));
    };

    const Actions = () => <div />;

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
                        (tracksPerPage === -1 ? tracks : tracks.slice(start, end)).map((track) => (
                            <TrackRow key={track.data.track.uri} {...track} />
                        ))
                    ) : (
                        <TableRow>
                            <TableCell colSpan={3}>No tracks were found.</TableCell>
                        </TableRow>
                    )}
                </TableBody>
                <TableFooter>
                    <TableRow>
                        <TablePagination
                            rowsPerPageOptions={[5, 10, 25, { label: 'All', value: -1 }]}
                            colSpan={3}
                            count={tracks.length}
                            rowsPerPage={tracksPerPage}
                            page={page}
                            SelectProps={{ inputProps: { 'aria-label': 'rows per page' } }}
                            onChangePage={handlePageChange}
                            onChangeRowsPerPage={handleTracksPerPageChange}
                            labelDisplayedRows={displayedTracks}
                            ActionsComponent={Actions}
                        />
                    </TableRow>
                    {tracksPerPage === -1 || (
                        <TableRow>
                            <TableCell colSpan={3}>
                                <Pagination
                                    count={Math.ceil(tracks.length / tracksPerPage)}
                                    page={page + 1}
                                    onChange={handlePageChange}
                                />
                            </TableCell>
                        </TableRow>
                    )}
                </TableFooter>
            </Table>
        </TableContainer>
    );
};

export default TrackTable;
