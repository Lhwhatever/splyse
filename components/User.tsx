import { Box, IconButton, Link, Menu, MenuItem, Typography } from '@material-ui/core';
import React from 'react';
import { UserProfile } from 'utils/spotify';
import { SpotifyAvatar } from './Spotify';
import MoreVertIcon from '@material-ui/icons/MoreVert';

export interface UserProps {
    userProfile: UserProfile;
    onLogout: () => void;
}

const User = (props: UserProps): JSX.Element => {
    const { userProfile, onLogout } = props;

    const [logoutMenuAnchor, setLogoutMenuAnchor] = React.useState<HTMLElement | null>(null);

    const handleLogoutMenuButtonOpen = (event: React.MouseEvent<HTMLElement>) => {
        setLogoutMenuAnchor(event.currentTarget);
    };

    const handleLogoutMenuClose = () => {
        setLogoutMenuAnchor(null);
    };

    const handleLogout = () => {
        setLogoutMenuAnchor(null);
        onLogout();
    };

    return (
        <Box display="flex" alignItems="center">
            <IconButton href={userProfile.external_urls.spotify} target="_blank">
                <SpotifyAvatar
                    url={userProfile.images.length ? userProfile?.images[0].url : undefined}
                    sideLength={24}
                />
            </IconButton>
            <Link href={userProfile.external_urls.spotify} variant="body1" target="_blank">
                {userProfile?.display_name}
            </Link>
            <Box flexGrow={1} />
            <IconButton onClick={handleLogoutMenuButtonOpen}>
                <MoreVertIcon />
            </IconButton>
            <Menu
                id="spotify-logout-menu"
                open={Boolean(logoutMenuAnchor)}
                onClose={handleLogoutMenuClose}
                keepMounted
                anchorEl={logoutMenuAnchor}
            >
                <MenuItem onClick={handleLogout}>Logout</MenuItem>
                <MenuItem onClick={handleLogoutMenuClose}>Close</MenuItem>
            </Menu>
        </Box>
    );
};

export default User;
