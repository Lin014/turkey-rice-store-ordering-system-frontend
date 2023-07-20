import { createTheme } from '@mui/material/styles';
import { orange } from '@mui/material/colors';

export const theme = createTheme({
    palette: {
        primary: {
            main: orange[300],
            light: orange[600],
            dark: orange[900]
        }
    },
});
