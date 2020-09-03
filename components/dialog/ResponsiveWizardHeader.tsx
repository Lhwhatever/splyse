import { DialogTitle, IconButton, makeStyles, Step, StepLabel, Stepper } from '@material-ui/core';
import { Close } from '@material-ui/icons';
import React from 'react';

const useStyles = makeStyles((theme) => ({
    mobileCloseBtn: {
        marginLeft: theme.spacing(-2),
    },
}));

export interface ResponsiveDialogHeaderProps {
    mobile?: boolean;
    onQuit?: () => void;
    children?: React.ReactNode;
    activeStepIndex?: number;
    stepLabels?: string[];
}

const ResponsiveWizardHeader = (props: ResponsiveDialogHeaderProps): JSX.Element => {
    const { mobile, onQuit = () => undefined, children, activeStepIndex, stepLabels } = props;
    const classes = useStyles();

    if (mobile) {
        return (
            <DialogTitle>
                <IconButton aria-label="quit" className={classes.mobileCloseBtn} onClick={onQuit}>
                    <Close />
                </IconButton>
                {children || 'Quit'}
            </DialogTitle>
        );
    } else {
        return (
            <React.Fragment>
                <DialogTitle>{children}</DialogTitle>
                {stepLabels && (
                    <Stepper activeStep={activeStepIndex} alternativeLabel>
                        {stepLabels.map((stepLabel) => (
                            <Step key={stepLabel}>
                                <StepLabel>{stepLabel}</StepLabel>
                            </Step>
                        ))}
                    </Stepper>
                )}
            </React.Fragment>
        );
    }
};

export default ResponsiveWizardHeader;
