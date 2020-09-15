import { DialogContent, DialogContentProps, withStyles } from '@material-ui/core';

export type StickyDialogHeaderProps = DialogContentProps;

const StickyDialogHeader = withStyles((theme) => ({
    root: {
        flex: '0 0 auto',
        paddingTop: 0,
        paddingBottom: theme.spacing(3),
    },
}))(DialogContent);

export default StickyDialogHeader;
