import { Navigate, useNavigate } from "react-router-dom";
import { Formik, Field, Form } from "formik";
import * as Yup from "yup";
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import "../commons/auth.css"
import { createTheme } from '@mui/material/styles';

import AuthService from "../../services/auth.service";
import { TextField } from "@mui/material";
import ThemeProvider from "@mui/material/styles/ThemeProvider";
import React from "react"

const theme = createTheme({
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

const validationSchema = () => { 
    return Yup.object({
    username: Yup.string().required("Please enter name"),
    password: Yup.string()
      .required("Please enter password")
})}

const LoginPage = () => {
    const navigate = useNavigate();

    const [redirect, setRedirect] = React.useState<string | null>(null);
    const [username, setUsername] = React.useState<string>("");
    const [password, setPassword] = React.useState<string>("");
    const [message, setMessage] = React.useState<string>("");
    const [loading, setLoading] = React.useState(false);


    React.useEffect(() => {
      let currentUser = AuthService.getCurrentUser();
      if (currentUser) {
          console.log(currentUser);
          setRedirect("/home");
      };
    });

    const handleRedirect = () => {
      navigate("/register");
    }

    const handleOther = () => {
      console.log(redirect);
    }

    const handleLogin = (formValue: { username: string; password: string }) => {
      const { username, password } = formValue;
      setMessage("");
      setLoading(true);
      setUsername(username);
      setPassword(password);

      AuthService.login(username, password).then(
        () => {
          setRedirect("/home");
        },
        error => {
          const resMessage =
            (error.response &&
              error.response.data &&
              error.response.data.message) ||
            error.message ||
            error.toString();
          
          setMessage(resMessage);
          setLoading(false)
        }
      );
    }

    const initialValues = {
      username: "",
      password: "",
    };

    return (
      <>
          {!redirect ?
           <ThemeProvider theme={theme}>
           <div>
             <Formik
             initialValues={initialValues}
             validationSchema={validationSchema}
             onSubmit={handleLogin}>
             {({ errors, isValid, touched, dirty }) => (
               <Form>
                 <Box 
                   style={{backgroundColor:"#FCFCFC"}}
                   display={"flex"} 
                   flexDirection={"column"} 
                   maxWidth={400} alignItems="center" 
                   justifyContent={"center"} 
                   margin="auto" 
                   mt={10}
                   padding={6}
                   borderRadius={5}
                   boxShadow={"5px 5px 10px black"}
                   sx={{
                     ":hover":{
                         boxShadow: "10px 10px 20px black"
                     },
                   }}
                 >
                   <Typography sx={{marginBottom:5}} variant="h3" fontFamily={"Raleway, sans-serif"} fontWeight={800} >
                     GanntApp
                   </Typography>
                   <Field
                       fullWidth
                       as={TextField}
                       id="username"
                       name="username"
                       InputLabelProps={{
                         shrink: true,
                       }}
                       label="Username"
                       variant="standard"
                       type={"text"}
                       margin={"normal"}
                       error={Boolean(errors.username) && Boolean(touched.username)}
                       helperText={Boolean(touched.username) && errors.username}
                     />
                     <Field
                       fullWidth
                       as={TextField}
                       id="password"
                       name="password"
                       InputLabelProps={{
                         shrink: true,
                       }}
                       label="Password"
                       variant="standard"
                       type={"password"}
                       margin={"normal"}
                       error={Boolean(errors.password) && Boolean(touched.password)}
                       helperText={Boolean(touched.password) && errors.password}
                     />
                     <Button 
                       sx={{marginTop:10}} 
                       variant="contained" 
                       size="large" 
                       style={{borderRadius:25}} 
                       color="primary" 
                       type="submit"
                     >
                       Login
                     </Button>
                     <Button sx={{marginTop:3}} onClick={handleRedirect}>or Sign Up</Button>
                   </Box>
                   </Form>
                   )}
                 </Formik>
           </div>
         </ThemeProvider>
                      :
         <Navigate to={redirect} />
          }
      </>
  );

    
}

export default LoginPage;