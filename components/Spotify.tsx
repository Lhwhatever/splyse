import { Button, ButtonProps, makeStyles } from '@material-ui/core';
import clsx from 'clsx';
import React from 'react';

const useStylesLogo = makeStyles({
    logo: {
        margin: ({ sideLength }: LogoProps) => Math.ceil(Math.min(sideLength, 21) / 2),
    },
});

const useStyles = makeStyles({
    spotifyBtn: {
        backgroundColor: '#1db954',
        color: '#fff',
        fontFamily: 'Circular, Helvetica, Arial, sans-serif',
        borderRadius: 999,
    },
});

export interface LogoProps {
    sideLength: number;
}

const Logo = (props: LogoProps): JSX.Element => {
    const classes = useStylesLogo(props);
    const sideLength = Math.min(props.sideLength, 21);

    return (
        <img
            src="/Spotify_Icon_RGB_White.png"
            alt="Spotify Logo"
            width={sideLength}
            height={sideLength}
            className={classes.logo}
        />
    );
};

const SpotifyStyleButton = (props: ButtonProps): JSX.Element => {
    const classes = useStyles();
    const { className, ...other } = props;
    return <Button className={clsx(classes.spotifyBtn, className)} {...other} />;
};

export { Logo, SpotifyStyleButton };
