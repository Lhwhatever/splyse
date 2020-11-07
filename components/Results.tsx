import { Box, makeStyles, Paper } from '@material-ui/core';
import React from 'react';
import { HasResults } from 'store/ducks/results';
import Plot from 'components/Plotly';
import theme from 'theme';
import { PlotData } from 'plotly.js';
import PlotDisplay from 'components/PlotDisplay';
import { formatDuration, getTicks } from 'utils/time';

const useStyles = makeStyles({
    root: {
        padding: theme.spacing(1),
        '& > div': {
            margin: theme.spacing(1),
            [theme.breakpoints.up('sm')]: {
                width: `calc(50% - ${theme.spacing(2)}px)`,
            },
            [theme.breakpoints.only('xs')]: {
                width: '100%',
            },
        },
    },
});

export interface ResultsProp {
    results: HasResults;
}

const Results = (props: ResultsProp): JSX.Element => {
    const { results } = props;

    const classes = useStyles();

    if (!results.complete) return <div />;

    const explicitPlot = [
        {
            values: [results.explicit.true, results.explicit.false],
            labels: ['Explicit', 'Non-Explicit/Unknown'],
            type: 'pie',
        } as PlotData,
    ];

    const popularityPlot = [
        {
            x: results.popularities,
            type: 'histogram',
        } as PlotData,
    ];

    const durationPlot = [
        {
            x: results.durations,
            type: 'histogram',
        } as PlotData,
    ];

    const durationTicks = getTicks(Math.min(...results.durations), Math.max(...results.durations));

    return (
        <Box display="flex" flexDirection="row" flexWrap="wrap" className={classes.root} width="100%">
            <PlotDisplay title="Explicit Songs">
                <Plot data={explicitPlot} />
            </PlotDisplay>
            <PlotDisplay title="Popularities">
                <Plot data={popularityPlot} />
            </PlotDisplay>
            <PlotDisplay title="Durations">
                <Plot
                    data={durationPlot}
                    layout={{
                        xaxis: {
                            tickmode: 'array',
                            tickvals: durationTicks,
                            ticktext: durationTicks.map(formatDuration),
                        },
                    }}
                />
            </PlotDisplay>
        </Box>
    );
};

export default Results;
