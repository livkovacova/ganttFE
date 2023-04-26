import { useNavigate } from "react-router-dom";
import { Formik, Field, Form} from "formik";
import * as Yup from "yup";
import YupPassword from 'yup-password'
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import "../commons/auth.css"
import { createTheme } from '@mui/material/styles';

import AuthService from "../../services/AuthService";
import { TextField, Alert, Select, MenuItem, SelectChangeEvent, InputLabel, FormControl} from "@mui/material";
import ThemeProvider from "@mui/material/styles/ThemeProvider";
import React from "react"

YupPassword(Yup)

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
    return Yup.object().shape({
      username: Yup.string()
        .min(3, "The username must be between 3 and 20 characters.")
        .max(20, "The username must be between 3 and 20 characters.")
        .required("This field is required!"),
      email: Yup.string()
        .email("This is not a valid email.")
        .max(50, "The username must be max 50 characters long.")
        .required("This field is required!"),
      password: Yup.string()
        .password()
        .min(3, "The username must be between 3 and 20 characters.")
        .max(20, "The username must be between 3 and 20 characters.")
        .required("This field is required!"),
      role: Yup.string()
        .required("This field is required!")
    });
  }

const RegisterPage = () => {
    const navigate = useNavigate();

    const [email, setEmail] = React.useState<string>("");
    const [username, setUsername] = React.useState<string>("");
    const [password, setPassword] = React.useState<string>("");
    const [role, setRole] = React.useState<string>("");
    const [message, setMessage] = React.useState<string>("");
    const [successful, setSuccessful] = React.useState(false);

    const handleRedirect = () => {
      navigate("/login");
    }

    const handleChange = (event: SelectChangeEvent) => {
        setRole(event.target.value as string);
      };

    const handleRegister = (formValue: { username: string; email: string; password: string; role: string }) => {
        
        const { username, email, password, role } = formValue;
        console.log("role in register:" +role);
    
        setMessage("");
        setSuccessful(false);

        let roles = [role];
    
        AuthService.register(
          username,
          email,
          password,
          roles
        ).then(
          response => {
            setMessage(response.data.message);
            setSuccessful(true);
            setTimeout(() => {
              handleRedirect();
            }, 1500);
          },
          error => {
            const resMessage =
              (error.response &&
                error.response.data &&
                error.response.data.message) ||
              error.message ||
              error.toString();
    
              setMessage(resMessage);
              setSuccessful(false);
          }
        );
      }

    const initialValues = {
        username: "",
        email: "",
        password: "",
        role: ""
    };

    return (
      <>
        <ThemeProvider theme={theme}>
           <div>
             <Formik
             initialValues={initialValues}
             validationSchema={validationSchema}
             onSubmit={handleRegister}>
             {({ errors, isValid, touched, dirty }) => (
               <Form>
                {!successful && (
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
                       id="email"
                       name="email"
                       InputLabelProps={{
                         shrink: true,
                       }}
                       label="Email"
                       variant="standard"
                       type={"email"}
                       margin={"normal"}
                       error={Boolean(errors.email) && Boolean(touched.email)}
                       helperText={Boolean(touched.email) && errors.email}
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

                    <FormControl fullWidth margin="normal">
                    <InputLabel id="role-label">Role</InputLabel>
                    <Field 
                        fullWidth
                        name="role" 
                        label="Role"
                        labelId="role-label"
                        as={Select}
                        id="role"
                        error={Boolean(errors.role) && Boolean(touched.role)}
                    >
                    <MenuItem value="manager">Manager</MenuItem>
                    <MenuItem value="team member">Team Member</MenuItem>
                    </Field>
                    </FormControl>

                     <Button 
                       sx={{marginTop:5}} 
                       variant="contained" 
                       size="large" 
                       style={{borderRadius:25}} 
                       color="primary" 
                       type="submit"
                     >
                       Sign Up
                     </Button>
                     <Button sx={{marginTop:3}} onClick={handleRedirect}>or Log In</Button>
                   </Box>
                   )}

                    {message && (
                        <Alert
                            severity={
                            successful ? "success" : "error"
                            }
                            variant="filled"
                            sx={{marginTop:10, marginRight:"auto", marginLeft:"auto", maxWidth:400, boxShadow:"5px 5px 10px black", display:"flex"}}
                        >
                            {message}
                        </Alert>
                    )}
                   </Form>
                   )}
                 </Formik>
           </div>
         </ThemeProvider>
      </>
  );

    
}

export default RegisterPage;