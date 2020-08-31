import { Box, CircularProgress, Container, Paper, Typography } from '@material-ui/core';
import Alert, { AlertState } from 'components/Alert';
import ContentHeader from 'components/ContentHeader';
import { SpotifyConnectButton } from 'components/Spotify';
import User from 'components/User';
import { useRouter } from 'next/dist/client/router';
import React from 'react';
import { handleAuthError, handleAuthSuccess } from 'utils/auth';
import SpotifyConnection, { UserProfile } from 'utils/spotify';

export default function Home(): JSX.Element {
    const [alert, setAlert] = React.useState<AlertState | null>(null);
    const [connection, setConnection] = React.useState<SpotifyConnection | null | undefined>(undefined);
    const [userProfile, setUserProfile] = React.useState<UserProfile | null>(null);
    const router = useRouter();

    React.useEffect(() => {
        if (typeof router.query.access_token === 'string' && typeof router.query.refresh_token === 'string') {
            const connection = new SpotifyConnection(router.query.access_token, router.query.refresh_token);
            handleAuthSuccess(connection, setAlert, setConnection, setUserProfile);
        } else if ('error' in router.query) {
            handleAuthError(router.query.error, setAlert);
            setConnection(null);
        } else {
            setConnection(null);
        }
    }, [router]);

    const handleAlertClose = () => {
        setAlert(null);
    };

    const handleLogout = () => {
        setConnection(null);
        setUserProfile(null);
        router.push('/');
        setAlert({
            severity: 'success',
            message: 'Logged out.',
        });
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
                <Paper>
                    <Box p={2}>
                        <Typography variant="h5">Manage Songs</Typography>
                    </Box>
                </Paper>
            </Box>
            <Alert state={alert} autoHideDuration={6000} onClose={handleAlertClose} />
        </Container>
    );
}
