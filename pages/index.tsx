import { Box, CircularProgress, Container } from '@material-ui/core';
import SpotifyConnection, { UserProfile } from 'classes/SpotifyConnection';
import Alert from 'components/Alert';
import ContentHeader from 'components/ContentHeader';
import TrackManager from 'components/TrackManager';
import { SpotifyConnectButton } from 'components/Spotify';
import User from 'components/User';
import { useRouter } from 'next/dist/client/router';
import querystring from 'querystring';
import React from 'react';
import { useDispatch } from 'react-redux';
import { Alert as NonNullAlertState, setAlert } from 'store/ducks/alert';
import { handleAuthError, verifyAuthTokens } from 'utils/auth';

export default function Home(): JSX.Element {
    const [connection, setConnection] = React.useState<SpotifyConnection | null | undefined>(undefined);
    const [userProfile, setUserProfile] = React.useState<UserProfile | null>(null);
    const router = useRouter();

    const dispatch = useDispatch();

    const dispatchAlert = (alert: NonNullAlertState) => {
        dispatch(setAlert(alert));
    };

    React.useEffect(() => {
        if (typeof router.query.access_token === 'string' && typeof router.query.refresh_token === 'string') {
            verifyAuthTokens({
                accessToken: router.query.access_token,
                refreshToken: router.query.refresh_token,
                onNewAlert: dispatchAlert,
                onConnectionVerification: setConnection,
                onGettingUserProfile: setUserProfile,
                onAccessTokenChange: (newToken) =>
                    router.push(
                        '/?' +
                            querystring.stringify({ access_token: newToken, refreshToken: router.query.refresh_token })
                    ),
            });
        } else if ('error' in router.query) {
            handleAuthError(router.query.error, dispatchAlert);
            setConnection(null);
        } else {
            setConnection(null);
        }
    }, [router, dispatch]);

    const handleConnectionFailure = () => {
        setConnection(null);
        setUserProfile(null);
        router.push('/');
        dispatchAlert({ severity: 'error', message: 'The connection to Spotify failed. Try logging in again.' });
    };

    const handleLogout = () => {
        setConnection(null);
        setUserProfile(null);
        router.push('/');
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
