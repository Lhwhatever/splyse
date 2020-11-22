import { makeStyles, Paper, Typography } from '@material-ui/core';
import React from 'react';
import theme from 'theme';

const useStyles = makeStyles({
    root: {
        paddingTop: theme.spacing(1),
        paddingLeft: theme.spacing(2),
        paddingRight: theme.spacing(2),
    },
});

export interface PlotDisplayProps {
    children: React.ReactNode;
    title?: string;
}

const PlotDisplay = (props: PlotDisplayProps): JSX.Element => {
    const { children, title } = props;

    const classes = useStyles();

    return (
        <Paper className={classes.root}>
            {title && <Typography variant="h6">{title}</Typography>}
            {children}
        </Paper>
    );
};

export default PlotDisplay;
