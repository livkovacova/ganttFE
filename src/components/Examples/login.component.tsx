import { Component } from "react";
import { Navigate, redirect, useNavigate } from "react-router-dom";
import { Formik, Field, Form, ErrorMessage } from "formik";
import * as Yup from "yup";
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import "../Auth/auth.css"
import { createTheme } from '@mui/material/styles';

import AuthService from "../../services/auth.service";
import { TextField } from "@mui/material";
import ThemeProvider from "@mui/material/styles/ThemeProvider";

type Props = {};

type State = {
  redirect: string | null,
  username: string,
  password: string,
  loading: boolean,
  message: string
};

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


export default class Login extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.handleLogin = this.handleLogin.bind(this);
    this.handleClick = this.handleClick.bind(this);

    this.state = {
      redirect: null,
      username: "",
      password: "",
      loading: false,
      message: ""
    };
  }

  handleClick(){
    console.log("tu som")
    return <Navigate to='/register'/>;
  }

  componentDidMount() {
    const currentUser = AuthService.getCurrentUser();

    if (currentUser) {
      this.setState({ redirect: "/profile" });
    };
    console.log("mount"+this.state);
  }

  componentWillUnmount() {
    window.location.reload();
  }

  validationSchema() { 
    return Yup.object({
    username: Yup.string().required("Please enter name"),
    password: Yup.string()
      .required("Please enter password")
  })}

  handleLogin(formValue: { username: string; password: string }) {
    const { username, password } = formValue;
    this.setState({
      message: "",
      loading: true
    });


    AuthService.login(username, password).then(
      () => {
        this.setState({
          redirect: "/profile"
        });
      },
      error => {
        const resMessage =
          (error.response &&
            error.response.data &&
            error.response.data.message) ||
          error.message ||
          error.toString();

        this.setState({
          loading: false,
          message: resMessage
        });
      }
    );
  }

  render() {
    if (this.state.redirect) {
      return <Navigate to={this.state.redirect} />
    }

    const { loading, message } = this.state;

    const initialValues = {
      username: "",
      password: "",
    };

    return (
      <ThemeProvider theme={theme}>
        <div>
          <Formik
          initialValues={initialValues}
          validationSchema={this.validationSchema}
          onSubmit={this.handleLogin}>
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
                  <Button sx={{marginTop:3}} onClick={this.handleClick}>or Sign Up</Button>
                </Box>
                </Form>
                )}
              </Formik>
        </div>
      </ThemeProvider>
    );
  }
}