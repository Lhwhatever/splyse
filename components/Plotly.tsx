import { makeStyles } from '@material-ui/core';
import clsx from 'clsx';
import dynamic from 'next/dynamic';
import React from 'react';
import { PlotParams } from 'react-plotly.js';
import { withSize } from 'react-sizeme';
import theme from 'theme';

const useStyles = makeStyles({
    root: { width: '100%' },
});

const PlotlyPlot = dynamic(import('react-plotly.js'), {
    ssr: false,
});

export type PlotProps = Omit<PlotParams, 'layout'> & {
    size: { width: number; height: number };
    layout?: PlotParams['layout'];
};

const defaultLayout = {
    autosize: true,
    paper_bgcolor: 'rgba(0, 0, 0, 0)',
    font: {
        family: 'Roboto, "Open Sans", Arial, sans-serif',
        color: theme.palette.text.primary,
    },
    legend: {
        orientation: 'h' as const,
    },
    margin: { l: theme.spacing(3), r: theme.spacing(2), b: theme.spacing(3), t: theme.spacing(5) },
};

const Plot = (props: PlotProps) => {
    const classes = useStyles();
    const { layout = {}, className, config, size, ...other } = props;

    return (
        <PlotlyPlot
            layout={{
                ...defaultLayout,
                ...layout,
                width: size.width,
                height: size.width * 0.75,
            }}
            className={clsx(classes.root, className)}
            config={{ responsive: true, displaylogo: true, ...config }}
            {...other}
        />
    );
};

export default withSize()(Plot);
