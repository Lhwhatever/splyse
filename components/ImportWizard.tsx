import {
    Button,
    CircularProgress,
    Dialog,
    DialogActions,
    DialogContent,
    InputAdornment,
    makeStyles,
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
import Centered from './Centered';
import ResponsiveWizardHeader from './dialog/ResponsiveWizardHeader';
import PlaylistsOverview from './PlaylistsOverview';

const useStyles = makeStyles((theme) => ({
    searchContainer: {
        flex: '0 0 auto',
        paddingTop: 0,
        paddingBottom: theme.spacing(3),
    },
}));

export interface ImportWizardProps {
    open: boolean;
    onClose: () => void;
    playlistContainer: Paged<Playlist> | undefined;
    onConnectionFailure: () => void;
}

const ImportWizard = (props: ImportWizardProps): JSX.Element => {
    const { open, onClose, playlistContainer, onConnectionFailure } = props;

    const [isLoading, setLoadingState] = React.useState(false);
    const [searchString, setSearchString] = React.useState<string | undefined>(undefined);

    const dispatch = useDispatch();

    const classes = useStyles();

    const mobile = useMediaQuery(useTheme().breakpoints.down('xs'));

    const handleQuit = () => {
        onClose();
    };

    const handleSearchStringChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSearchString(event.target.value);
    };

    const handleFocus = async () => {
        if (playlistContainer !== undefined) {
            setLoadingState(true);
            dispatch(loadAll(playlistContainer, onConnectionFailure, () => setLoadingState(false)));
        }
    };

    return (
        <Dialog open={open} onClose={handleQuit} fullScreen={mobile}>
            <ResponsiveWizardHeader mobile={mobile} onQuit={handleQuit}>
                Select playlists to import
            </ResponsiveWizardHeader>
            <DialogContent className={classes.searchContainer}>
                <TextField
                    variant="outlined"
                    placeholder="Search"
                    value={searchString}
                    onChange={handleSearchStringChange}
                    onFocus={handleFocus}
                    InputProps={{
                        startAdornment: (
                            <InputAdornment position="start">
                                <SearchIcon />
                            </InputAdornment>
                        ),
                    }}
                />
            </DialogContent>
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
                <Button variant="contained" color="primary">
                    Import
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default ImportWizard;
