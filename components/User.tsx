import { Box, Link, Typography } from '@material-ui/core';
import React from 'react';
import { UserProfile } from 'utils/spotify';
import { SpotifyAvatar } from './Spotify';

export interface UserProps {
    userProfile: UserProfile;
}

const User = (props: UserProps): JSX.Element => {
    const { userProfile } = props;

    return (
        <Box display="flex">
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
    );
};

export default User;
