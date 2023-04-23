import React from "react";
import {useNavigate} from "react-router-dom";
import logo from "../../assets/images/ganttapp-logo.png";
import "./NavigationBar.css";
import { Avatar, Box, ButtonGroup, Divider, IconButton, ListItemIcon, Menu, MenuItem, Tooltip, Typography } from "@mui/material";
import { responsiveFontSizes, ThemeProvider } from '@mui/material/styles';
import mainTheme from "../commons/mainTheme";
import Logout from '@mui/icons-material/Logout';
import authService from "../../services/AuthService";
import AddIcon from '@mui/icons-material/Add';
import ViewStreamIcon from '@mui/icons-material/ViewStream';

interface Props {
    onClick?: React.Dispatch<any>;
    userNameLetter?: string;
    isManager?: boolean;
    mainTitle?: string;
    withCreate?: boolean;
}

export const NavigationBar = ({onClick, userNameLetter, isManager, withCreate, mainTitle}: Props) => {
    const navigate = useNavigate();

    const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
    const open = Boolean(anchorEl);
    const handleClick = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
        setAnchorEl(null);
    };
    const handleRedirect = () => {
        navigate("/home");
    };
    const handleLogout = () => {
        authService.logout();
        navigate("/login");
    };

    const theme = responsiveFontSizes(mainTheme);

    return (
        <ThemeProvider theme={theme}>
        <div>
            <div className="navBarContainer">
                <div className="logoWrapper">
                    {/* <img src={logo} alt="logo of GanttApp" style={{width: "82px"}}/> */}
                    <Typography
                        variant="h5"
                        style={{color:"#B03066", marginLeft: "1vw", fontWeight: "600"}}
                        fontFamily={"Raleway, sans-serif"}
                    >
                        GanttApp
                    </Typography>
                    <div style={{color: "white", marginLeft: "0.7vw", backgroundColor:"rgb(160 162 168)", padding: "0.4vw", borderRadius: 3}}>
                    <Typography
                        variant="body1"
                        style={{fontWeight: "100"}}
                        fontFamily={"Raleway, sans-serif"}
                    >
                        {mainTitle}
                </Typography>
                </div>
                </div>

                <div className="navBarButtons">
                {isManager && withCreate?
                     <IconButton color="primary" aria-label="create project" component="div" onClick={onClick} id="formOpener" sx={{marginLeft:"0.5vw"}}>
                        <AddIcon></AddIcon>
                     </IconButton>
                                           :
                     undefined
                }
                <Box sx={{ display: 'flex', alignItems: 'center', textAlign: 'center', marginRight:"1vw"}}>
                    <Tooltip title="Account">
                        <IconButton
                            onClick={handleClick}
                            size="small"
                            sx={{ ml: 2 }}
                            aria-controls={open ? 'account-menu' : undefined}
                            aria-haspopup="true"
                            aria-expanded={open ? 'true' : undefined}
                        >
                            <Avatar style={{backgroundColor: "#B03066"}} sx={{ width: 32, height: 32}}>{userNameLetter}</Avatar>
                        </IconButton>
                    </Tooltip>
                </Box>
                <Menu
                    anchorEl={anchorEl}
                    id="account-menu"
                    open={open}
                    onClose={handleClose}
                    onClick={handleClose}
                    PaperProps={{
                    elevation: 0,
                    sx: {
                        overflow: 'visible',
                        filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
                        mt: 1.5,
                        '& .MuiAvatar-root': {
                        width: 32,
                        height: 32,
                        ml: -0.5,
                        mr: 1,
                        },
                        '&:before': {
                        content: '""',
                        display: 'block',
                        position: 'absolute',
                        top: 0,
                        right: 14,
                        width: 10,
                        height: 10,
                        bgcolor: 'background.paper',
                        transform: 'translateY(-50%) rotate(45deg)',
                        zIndex: 0,
                        },
                    },
                    }}
                    transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                    anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
                >
                <MenuItem onClick={handleRedirect}>
                <ListItemIcon>
                    <ViewStreamIcon fontSize="small" />
                </ListItemIcon>
                My projects
                </MenuItem>
                <Divider />
                <MenuItem onClick={handleLogout}>
                <ListItemIcon>
                    <Logout fontSize="small" />
                </ListItemIcon>
                Logout
                </MenuItem>
            </Menu>
                </div>
            </div>
        </div>
        </ThemeProvider>
    );
};