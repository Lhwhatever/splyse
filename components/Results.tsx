import { Box, makeStyles, Typography } from '@material-ui/core';
import PlotDisplay from 'components/PlotDisplay';
import Plot from 'components/Plotly';
import React from 'react';
import { AdvancedData, HasResults } from 'store/ducks/results';
import theme from 'theme';
import { generateAdvancedPlots, generateBasicPlots } from 'utils/generatePlots';
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

export interface AdvancedDataProp {
    advanced: AdvancedData;
}

const percentageLayout = { tickformat: '%' };

const BasicResults = (props: ResultsProp): JSX.Element => {
    const { results } = props;

    const { explicitPlot, popularityPlot, durationPlot } = generateBasicPlots(results);
    const durationTicks = getTicks(Math.min(...results.durations), Math.max(...results.durations));

    return (
        <React.Fragment>
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
        </React.Fragment>
    );
};

const AdvancedResults = (props: AdvancedDataProp): JSX.Element => {
    const { advanced } = props;
    const {
        acousticnessPlot,
        danceabilityPlot,
        energyPlot,
        instrumentalnessPlot,
        livenessPlot,
        loudnessPlot,
        speechinessPlot,
        valencePlot,
        tempoPlot,
    } = generateAdvancedPlots(advanced);

    return (
        <React.Fragment>
            <PlotDisplay title="Acousticness">
                <Plot data={acousticnessPlot} layout={{ xaxis: percentageLayout }} />
            </PlotDisplay>
            <PlotDisplay title="Danceability">
                <Plot data={danceabilityPlot} layout={{ xaxis: percentageLayout }} />
            </PlotDisplay>
            <PlotDisplay title="Energy">
                <Plot data={energyPlot} layout={{ xaxis: percentageLayout }} />
            </PlotDisplay>
            <PlotDisplay title="Instrumentalness">
                <Plot data={instrumentalnessPlot} layout={{ xaxis: percentageLayout }} />
            </PlotDisplay>
            <PlotDisplay title="Liveness">
                <Plot data={livenessPlot} layout={{ xaxis: percentageLayout }} />
                <Typography variant="caption">
                    This refers to the probability that the track was performed live.
                </Typography>
            </PlotDisplay>
            <PlotDisplay title="Loudness in dB">
                <Plot data={loudnessPlot} />
            </PlotDisplay>
            <PlotDisplay title="Speechiness">
                <Plot data={speechinessPlot} layout={{ xaxis: percentageLayout }} />
            </PlotDisplay>
            <PlotDisplay title="Happiness">
                <Plot data={valencePlot} layout={{ xaxis: percentageLayout }} />
            </PlotDisplay>
            <PlotDisplay title="Tempo">
                <Plot data={tempoPlot} />
            </PlotDisplay>
        </React.Fragment>
    );
};

const Results = (props: ResultsProp): JSX.Element => {
    const { results } = props;

    const classes = useStyles();

    if (!results.complete) return <div />;

    return (
        <Box display="flex" flexDirection="row" flexWrap="wrap" className={classes.root} width="100%">
            <BasicResults results={results} />
            {results.advanced && <AdvancedResults advanced={results.advanced} />}
        </Box>
    );
};

export default Results;
