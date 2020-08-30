import {createMuiTheme, responsiveFontSizes} from "@material-ui/core";
import {cyan, green} from "@material-ui/core/colors";

export default responsiveFontSizes(createMuiTheme({
    palette: {
        primary: green,
        secondary: cyan
    }
}))
