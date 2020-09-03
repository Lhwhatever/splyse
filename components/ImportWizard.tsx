import {
    Checkbox,
    CircularProgress,
    Dialog,
    DialogContent,
    DialogContentText,
    FormControlLabel,
    useMediaQuery,
    useTheme,
} from '@material-ui/core';
import Paged from 'classes/Paged';
import { Playlist } from 'classes/SpotifyObjects';
import React from 'react';
import Centered from './Centered';
import ResponsiveWizardHeader from './dialog/ResponsiveWizardHeader';
import PlaylistsOverview from './PlaylistsOverview';

export interface ImportWizardProps {
    open: boolean;
    onClose: () => void;
    pagedPlaylists: Paged<Playlist> | undefined;
}

const ImportWizard = (props: ImportWizardProps): JSX.Element => {
    const { open, onClose, pagedPlaylists } = props;

    const [keepDupes, setKeepDupes] = React.useState(false);

    const mobile = useMediaQuery(useTheme().breakpoints.down('xs'));

    const handleKeepDupesChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setKeepDupes(event.target.checked);
    };

    const handleQuit = () => {
        onClose();
    };

    console.log(pagedPlaylists);

    return (
        <Dialog open={open} onClose={handleQuit} fullScreen={mobile}>
            <ResponsiveWizardHeader mobile={mobile} onQuit={handleQuit}>
                Import Playlist
            </ResponsiveWizardHeader>
            <DialogContent>
                <DialogContentText>Select playlists to import.</DialogContentText>
                <FormControlLabel
                    control={
                        <Checkbox
                            name="keep-dupes"
                            color="secondary"
                            checked={keepDupes}
                            onChange={handleKeepDupesChange}
                        />
                    }
                    label="Keep duplicate tracks"
                />
                {pagedPlaylists === undefined ? (
                    <Centered>
                        <CircularProgress />
                    </Centered>
                ) : (
                    <PlaylistsOverview pagedPlaylists={pagedPlaylists} />
                )}
            </DialogContent>
        </Dialog>
    );
};

export default ImportWizard;
