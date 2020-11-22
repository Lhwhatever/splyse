import { AdvancedData, HasResults } from 'store/ducks/results';
import { PlotData } from 'plotly.js';

export interface BasicPlots {
    explicitPlot: PlotData[];
    popularityPlot: PlotData[];
    durationPlot: PlotData[];
}

export const generateBasicPlots = (results: HasResults): BasicPlots => ({
    explicitPlot: [
        {
            values: [results.explicit.true, results.explicit.false],
            labels: ['Explicit', 'Non-Explicit/Unknown'],
            type: 'pie',
        } as PlotData,
    ],
    popularityPlot: [
        {
            x: results.popularities,
            type: 'histogram',
        } as PlotData,
    ],
    durationPlot: [
        {
            x: results.durations,
            type: 'histogram',
        } as PlotData,
    ],
});

export interface AdvancedPlots {
    acousticnessPlot: PlotData[];
    danceabilityPlot: PlotData[];
    energyPlot: PlotData[];
    instrumentalnessPlot: PlotData[];
    livenessPlot: PlotData[];
    loudnessPlot: PlotData[];
    speechinessPlot: PlotData[];
    valencePlot: PlotData[];
    tempoPlot: PlotData[];
}

export const generateAdvancedPlots = (results: AdvancedData): AdvancedPlots => ({
    acousticnessPlot: [
        {
            x: results.acousticness,
            type: 'histogram',
        } as PlotData,
    ],
    danceabilityPlot: [
        {
            x: results.danceability,
            type: 'histogram',
        } as PlotData,
    ],
    energyPlot: [
        {
            x: results.energy,
            type: 'histogram',
        } as PlotData,
    ],
    instrumentalnessPlot: [
        {
            x: results.instrumentalness,
            type: 'histogram',
        } as PlotData,
    ],
    livenessPlot: [
        {
            x: results.liveness,
            type: 'histogram',
        } as PlotData,
    ],
    loudnessPlot: [
        {
            x: results.loudness,
            type: 'histogram',
        } as PlotData,
    ],
    speechinessPlot: [
        {
            x: results.speechiness,
            type: 'histogram',
        } as PlotData,
    ],
    valencePlot: [
        {
            x: results.valence,
            type: 'histogram',
        } as PlotData,
    ],
    tempoPlot: [
        {
            x: results.tempo,
            type: 'histogram',
        } as PlotData,
    ],
});
