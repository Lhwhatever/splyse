import {
    Button,
    CircularProgress,
    Dialog,
    DialogActions,
    DialogContent,
    InputAdornment,
    TextField,
    useMediaQuery,
    useTheme,
} from '@material-ui/core';
import SearchIcon from '@material-ui/icons/Search';
import Paged from 'classes/Paged';
import { Playlist } from 'classes/SpotifyObjects';
import React from 'react';
import { useDispatch } from 'react-redux';
import { loadAll } from 'store/ducks/ImportWizard';
import { AppDispatch } from 'store/store';
import Centered from './Centered';
import ResponsiveWizardHeader from './dialog/ResponsiveWizardHeader';
import StickyDialogHeader from './dialog/StickyDialogHeader';
import PlaylistsOverview from './PlaylistsOverview';
import SearchField from './SearchField';

export interface ImportWizardProps {
    open: boolean;
    onClose: () => void;
    playlistContainer: Paged<Playlist> | undefined;
    onConnectionFailure: () => void;
    onImport: () => void;
}

const ImportWizard = (props: ImportWizardProps): JSX.Element => {
    const { open, onClose, playlistContainer, onConnectionFailure, onImport } = props;

    const [isLoading, setLoadingState] = React.useState(false);
    const [searchString, setSearchString] = React.useState('');

    const dispatch: AppDispatch = useDispatch();

    const mobile = useMediaQuery(useTheme().breakpoints.down('xs'));

    const handleQuit = () => {
        onClose();
        setSearchString('');
    };

    const handleFocus = async () => {
        if (playlistContainer !== undefined) {
            setLoadingState(true);
            try {
                await dispatch(loadAll(playlistContainer));
                setLoadingState(false);
            } catch (error) {
                onConnectionFailure();
            }
        }
    };

    return (
        <Dialog open={open} onClose={handleQuit} fullScreen={mobile}>
            <ResponsiveWizardHeader mobile={mobile} onQuit={handleQuit}>
                Select playlists to import
            </ResponsiveWizardHeader>
            <StickyDialogHeader>
                <SearchField value={searchString} onChange={setSearchString} onFocus={handleFocus} />
            </StickyDialogHeader>
            <DialogContent>
                {(isLoading || playlistContainer === undefined) && (
                    <Centered>
                        <CircularProgress />
                    </Centered>
                )}
                {playlistContainer !== undefined && (
                    <PlaylistsOverview
                        playlistContainer={playlistContainer}
                        onConnectionFailure={onConnectionFailure}
                        searchString={searchString}
                    />
                )}
            </DialogContent>
            <DialogActions>
                <Button variant="contained" color="primary" onClick={onImport}>
                    Import
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default ImportWizard;
