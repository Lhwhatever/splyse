import { Typography } from '@material-ui/core';
import React from 'react';

const ContentHeader = (): JSX.Element => {
    return (
        <React.Fragment>
            <Typography variant="h3">Splyse</Typography>
            <Typography variant="body1">Analyze the music you listen to in Spotify.</Typography>
        </React.Fragment>
    );
};

export default ContentHeader;
