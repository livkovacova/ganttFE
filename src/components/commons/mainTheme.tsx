import { createTheme, responsiveFontSizes } from "@mui/material";

const mainTheme = createTheme({
    palette:{
      primary: {
        main: '#B03066',
        contrastText: "white",
      },
      secondary: {
        light: '#E0E0E0',
        main: '#828282',
        dark: '#27252D',
        contrastText: '#000',
      },
    }
})

export default mainTheme;