import React from 'react';
import { Box, Button, Container, makeStyles, Paper, Typography, withStyles } from '@material-ui/core';
import { Logo, SpotifyStyleButton } from 'components/Spotify';
import Link from 'next/link';

export default function Home(): JSX.Element {
    return (
        <Container>
            <Box my={1}>
                <Typography variant="h3">Splyse</Typography>
                <Typography variant="body1">Analyze the music you listen to in Spotify.</Typography>
                <Box p={2} display="flex" justifyContent="center">
                    <Link href="/api/auth" passHref>
                        <SpotifyStyleButton startIcon={<Logo sideLength={21} />}>
                            Connect to Spotify <span style={{ paddingRight: 11 }} />
                        </SpotifyStyleButton>
                    </Link>
                </Box>
                <Paper>
                    <Box p={2}>
                        <Typography variant="h5">Manage Songs</Typography>
                    </Box>
                </Paper>
            </Box>
        </Container>
    );
}
