import { createTheme, responsiveFontSizes } from "@mui/material";

const mainTheme = createTheme({
    palette:{
      primary: {
        main: '#B03066',
        contrastText: "white",
      },
      secondary: {
        light: '#ff7961',
        main: '#f44336',
        dark: '#ba000d',
        contrastText: '#000',
      },
    }
})

export default mainTheme;