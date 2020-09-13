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
import React from 'react';
import { StagedPlaylist } from 'store/ducks/TrackManager';
import ResponsiveWizardHeader from './ResponsiveWizardHeader';

export interface TrackDialogProps {
    active: StagedPlaylist | null;
    onClose: () => void;
}

const TrackDialog = (props: TrackDialogProps): JSX.Element => {
    const { active, onClose } = props;

    const handleQuit = () => {
        onClose();
    };

    const mobile = useMediaQuery(useTheme().breakpoints.down('xs'));

    return (
        <Dialog open={active !== null} onClose={handleQuit} fullScreen={mobile}>
            <ResponsiveWizardHeader mobile={mobile} onQuit={handleQuit}>
                {active?.data.name}
            </ResponsiveWizardHeader>
            <DialogContent>
                <DialogContentText>Select tracks to analyze.</DialogContentText>
                <TableContainer>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell padding="checkbox">
                                    <Checkbox />
                                </TableCell>
                                <TableCell>Track</TableCell>
                                <TableCell>Album</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody></TableBody>
                    </Table>
                </TableContainer>
            </DialogContent>
        </Dialog>
    );
};

export default TrackDialog;
