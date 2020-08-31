import { Box, Container, Link, Paper, SvgIcon, Typography } from '@material-ui/core';
import Alert, { AlertState } from 'components/Alert';
import ContentHeader from 'components/ContentHeader';
import { SpotifyAvatar, SpotifyConnectButton } from 'components/Spotify';
import { useRouter } from 'next/dist/client/router';
import React from 'react';
import { handleAuthError, handleAuthSuccess } from 'utils/auth';
import SpotifyConnection, { UserProfile } from 'utils/spotify';

export default function Home(): JSX.Element {
    const [alert, setAlert] = React.useState<AlertState | null>(null);
    const [connection, setConnection] = React.useState<SpotifyConnection | null>(null);
    const [userProfile, setUserProfile] = React.useState<UserProfile | null>(null);
    const router = useRouter();

    React.useEffect(() => {
        if ('error' in router.query) {
            handleAuthError(router.query.error, setAlert);
            setConnection(null);
        } else if (typeof router.query.access_token === 'string' && typeof router.query.refresh_token === 'string') {
            console.log(router.query);
            const connection = new SpotifyConnection(router.query.access_token, router.query.refresh_token);
            handleAuthSuccess(connection, setAlert, setConnection, setUserProfile);
        }
    }, [router]);

    const handleAlertClose = () => {
        setAlert(null);
    };

    return (
        <Container>
            <Box my={1}>
                <ContentHeader />
                {connection ? (
                    <Box py={2} display="flex">
                        <Typography variant="body1">Logged in as </Typography>
                        <Box mx="0.5rem">
                            <SpotifyAvatar
                                url={userProfile?.images.length ? userProfile?.images[0].url : undefined}
                                sideLength={24}
                            />
                        </Box>
                        <Link href={userProfile?.external_urls.spotify} variant="body1" target="_blank">
                            {userProfile?.display_name}
                        </Link>
                    </Box>
                ) : (
                    <Box py={2} display="flex" justifyContent="center">
                        <SpotifyConnectButton />
                    </Box>
                )}
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
