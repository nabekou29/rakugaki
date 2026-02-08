import { createMuiTheme } from '@material-ui/core/styles';

const theme = createMuiTheme({
  palette: {
    type: 'dark',
    primary: {
      light: '#005f56',
      main: '#00897b',
      dark: '#33a095',
      contrastText: '#fff',
    },
    secondary: {
      light: '#3a4cb1',
      main: '#536dfe',
      dark: '#758afe',
      contrastText: '#8f8f8f',
    },
    background: {
      default: '#616161',
      paper: '#424242',
    },
  },
});

export default theme;
