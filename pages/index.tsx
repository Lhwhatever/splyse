import { Box, CircularProgress, Container } from '@material-ui/core';
import SpotifyConnection, { UserProfile } from 'classes/SpotifyConnection';
import Alert from 'components/Alert';
import ContentHeader from 'components/ContentHeader';
import { SpotifyConnectButton } from 'components/Spotify';
import TrackManager from 'components/TrackManager';
import User from 'components/User';
import React from 'react';
import { useCookies } from 'react-cookie';
import { useDispatch, useSelector } from 'react-redux';
import { Alert as NonNullAlertState, setAlert } from 'store/ducks/alert';
import { RootState } from 'store/store';
import { handleAuthError, verifyAuthTokens } from 'utils/auth';
import { accessTokenKey, cookieAcknowledgementKey, errorKey, refreshTokenKey } from 'utils/serverside';

export default function Home(): JSX.Element {
    const [connection, setConnection] = React.useState<SpotifyConnection | null | undefined>(undefined);
    const [userProfile, setUserProfile] = React.useState<UserProfile | null>(null);

    const dispatch = useDispatch();

    const dispatchAlert = (alert: NonNullAlertState) => {
        dispatch(setAlert(alert));
    };

    const [cookies, setCookie, removeCookie] = useCookies([
        accessTokenKey,
        refreshTokenKey,
        errorKey,
        cookieAcknowledgementKey,
    ]);

    const terminateConnection = () => {
        setConnection(null);
        setUserProfile(null);
        removeCookie(refreshTokenKey);
    };

    React.useEffect(() => {
        if (cookies[errorKey]) {
            // handle errors
            handleAuthError(cookies[errorKey], dispatchAlert);
            terminateConnection();
        } else if (connection === null && cookies[refreshTokenKey]) {
            // page load after authentication OR new page load with cookies

            verifyAuthTokens({
                accessToken: cookies[accessTokenKey],
                refreshToken: cookies[refreshTokenKey],
                onNewAlert: dispatchAlert,
                onConnectionVerification: (c: SpotifyConnection | null) => {
                    setConnection(c);
                    removeCookie(accessTokenKey);
                },
                onGettingUserProfile: setUserProfile,
            });
        } else if (connection === undefined) {
            // new page load
            setConnection(null);
            if (!cookies[cookieAcknowledgementKey]) {
                dispatchAlert({
                    severity: 'info',
                    message: 'This site uses cookies to manage the integration with Spotify.',
                });
                setCookie(cookieAcknowledgementKey, 'yes');
            }
        }
    }, [cookies, connection, dispatchAlert, removeCookie, setUserProfile, terminateConnection]);

    const handleConnectionFailure = () => {
        terminateConnection();
        dispatchAlert({ severity: 'error', message: 'The connection to Spotify failed. Try logging in again.' });
    };

    const handleLogout = () => {
        terminateConnection();
        dispatchAlert({ severity: 'success', message: 'Logged out.' });
    };

    return (
        <Container>
            <Box my={1}>
                <ContentHeader />
                <Box py={2} display="flex" flexDirection="column">
                    {userProfile ? (
                        <User userProfile={userProfile!} onLogout={handleLogout} />
                    ) : (
                        <Box alignSelf="center">
                            {connection === null ? <SpotifyConnectButton /> : <CircularProgress />}
                        </Box>
                    )}
                </Box>
                {connection && <TrackManager connection={connection} onConnectionFailure={handleConnectionFailure} />}
            </Box>
            <Alert autoHideDuration={6000} />
        </Container>
    );
}
