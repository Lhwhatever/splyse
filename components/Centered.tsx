import { makeStyles } from '@material-ui/core';
import clsx from 'clsx';
import React from 'react';

export interface CenteredProps {
    children: React.ReactNode;
    className?: string;
}

const useStyles = makeStyles({
    centered: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
    },
});

const Centered = ({ children, className }: CenteredProps): JSX.Element => (
    <div className={clsx(useStyles().centered, className)}>{children}</div>
);

export default Centered;
