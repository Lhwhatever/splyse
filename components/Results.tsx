import { Box } from '@material-ui/core';
import React from 'react';
import { HasResults } from 'store/ducks/results';

export interface ResultsProp {
    results: HasResults;
}

const Results = (props: ResultsProp): JSX.Element => {
    const { results } = props;

    if (results.complete) return <div />;
    else return <Box></Box>;
};

export default Results;
