import { Navigate, useNavigate } from "react-router-dom";
import { Formik, Field, Form } from "formik";
import * as Yup from "yup";
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Avatar from '@mui/material/Avatar';
import "../Auth/auth.css"
import { createTheme } from '@mui/material/styles';
import AssignmentIndIcon from '@mui/icons-material/AssignmentInd';

import AuthService from "../../services/auth.service";
import { TextField } from "@mui/material";
import ThemeProvider from "@mui/material/styles/ThemeProvider";
import React from "react"
import IUser from "../../types/user.type";
import { padding } from "@mui/system";

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
  },
  })

  theme.typography.h3 = {
    fontSize: '1.2rem',
    '@media (min-width:600px)': {
      fontSize: '1.5rem',
    },
    [theme.breakpoints.up('md')]: {
      fontSize: '2.4rem',
    },
  };

  theme.typography.h5 = {
    fontSize: '0.5rem',
    '@media (min-width:600px)': {
      fontSize: '0.8rem',
    },
    [theme.breakpoints.up('md')]: {
      fontSize: '1.5rem',
    },
  };

const ProfilePage = () => {
    const navigate = useNavigate();

    const [redirect, setRedirect] = React.useState<string | null>(null);
    const [userReady, setUserReady] = React.useState(false);
    const [currentUser, setCurrentUser] = React.useState<IUser & { token: string }>(AuthService.getCurrentUser() && { token: "" });
    const [userName, setUsername] = React.useState<string>("");
    const [userEmail, setUserEmail] = React.useState<string>("");
    const [userRole, setUserRole] = React.useState<string>("");

    React.useEffect(() => {
      let currentUserFromAuth = AuthService.getCurrentUser();
      if (!currentUserFromAuth) {
          setRedirect("/home");
      }
      else{
        setUserReady(true);
        setUsername(currentUserFromAuth.username);
        setUserEmail(currentUserFromAuth.email);
        setUserRole(currentUserFromAuth.roles[0]);
      }
    });

    return (
      <>
          {!redirect ?
          <ThemeProvider theme={theme}>
            <div>
              <div style={{padding:"1vh", height:"8vh", display:"flex", alignItems:"center"}}>
                <Typography variant="h5" color="white" fontFamily={"Raleway, sans-serif"} fontWeight={800}>
                  GanttApp
                </Typography>
                <Avatar sx={{ bgcolor:"#B03066" }} style={{marginLeft:"auto"}}>{userName.charAt(0).toUpperCase()}</Avatar>
              </div>
              <Box
                style={{backgroundColor:"lightgray"}}
                display={"flex"} 
                flexDirection={"column"} 
                maxWidth={"100%"}
                height={"6vh"} 
                justifyContent={"center"} 
              >
                <Typography paddingLeft={2} pt={0.5} pb={0.5} variant="h6" color="#27252D" fontFamily={"Raleway, sans-serif"} fontWeight={800}>
                  Profile
                </Typography>
              </Box>
              <Box 
                style={{backgroundColor:"#FCFCFC"}}
                display={"flex"} 
                flexDirection={"column"} 
                maxWidth={"400"}
                height={"86vh"} 
                justifyContent={"center"} 
                padding={6}
                boxShadow={"5px 5px 10px black"}
                sx={{
                  ":hover":{
                    boxShadow: "10px 10px 20px black"
                  },
                }}
              >
                  {(userReady) ?
                  <div style={{ display:"flex", alignItems:"center", justifyContent:"center", flexDirection:"row"}}>
                    <div style={{ marginRight:"3vw"}}>
                      <AssignmentIndIcon color="primary" sx={{ fontSize: "30vh" }}></AssignmentIndIcon>
                    </div>
                    <div style={{ display:"flex", flexDirection:"column"}}>
                    
                    <Typography variant="h3" fontFamily={"Raleway, sans-serif"} fontWeight={800}>
                      {userName}
                    </Typography>
                    <Typography>e-mail:</Typography>
                    <div style={{backgroundColor:"lightgray", padding:4, borderRadius:3, marginBottom:"2vh"}}>
                    <Typography variant="h5" fontFamily={"Raleway, sans-serif"} fontWeight={400}>
                      {userEmail}
                    </Typography>
                    </div>
                    <Typography>role:</Typography>
                    <div style={{backgroundColor:"lightgray", padding:4, borderRadius:3, marginBottom:"2vh"}}>
                    <Typography variant="h5" fontFamily={"Raleway, sans-serif"} fontWeight={400}>
                      {userRole == "ROLE_TEAM_MEMBER" ? "team member" : "manager"}
                    </Typography>
                    </div>
                    </div>
                  </div>
                   : null}
                
                <Button sx={{marginTop:3}} onClick={AuthService.logout}>Logout</Button>
              </Box>
            </div>
          </ThemeProvider>
                      :
          <Navigate to={redirect} />
          }
      </>
  );

    
}

export default ProfilePage;