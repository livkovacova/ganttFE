import { createTheme, responsiveFontSizes } from "@mui/material";

const mainTheme = createTheme({
    palette:{
      primary: {
        main: '#B03066',
        contrastText: "white",
      },
      secondary: {
        light: '#E0E0E0',
        main: '#A0A0A0',
        dark: '#828282',
        contrastText: '#4F4F4F',
      },
    }
})

export default mainTheme;