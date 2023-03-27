import React from "react";
import {useNavigate} from "react-router-dom";
import logo from "../../assets/images/ganttapp-logo.png";
import "./NavigationBar.css";
import Container from '@mui/material/Container';
import { Avatar, Box, Divider, IconButton, ListItemIcon, Menu, MenuItem, Tooltip, Typography } from "@mui/material";
import { createTheme, responsiveFontSizes, ThemeProvider } from '@mui/material/styles';
import mainTheme from "../commons/mainTheme";
import PersonAdd from '@mui/icons-material/PersonAdd';
import Settings from '@mui/icons-material/Settings';
import Logout from '@mui/icons-material/Logout';
import authService from "../../services/auth.service";

interface Props {
    onClick?: React.Dispatch<any>;
    userNameLetter?: string;
    withCreate?: boolean;
}

export const NavigationBar = ({onClick, userNameLetter, withCreate = true}: Props) => {
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
        navigate("/profile");
    };
    const handleLogout = () => {
        authService.logout();
        navigate("/login");
    };

    // const [dropDownOptions, setDropDownOptions] = React.useState<Array<Option>>([
    //     {value: "events", text: "Events", groupBy: "Application", onClick: () => navigate("/")},
    //     {value: "usergroups", text: "Usergroups", groupBy: "Application", onClick: () => navigate("/usergroups")},
    //     {value: "currentusertickets", text: "My kudo cards", groupBy: "Application", onClick: () => navigate("/mykudocards")},
    //     {value: "logout", text: "Log out", groupBy: "System", onClick: () => logout(navigate)}
    // ]);

    // const [dropDownOptionsAdmin, setDropDownOptionsAdminn] = React.useState<Array<Option>>([
    //     {value: "events", text: "Events", groupBy: "Application", onClick: () => navigate("/")},
    //     {value: "usergroups", text: "Usergroups", groupBy: "Application", onClick: () => navigate("/usergroups")},
    //     {value: "currentusertickets", text: "My kudo cards", groupBy: "Application", onClick: () => navigate("/mykudocards")},
    //     {value: "logout", text: "Log out", groupBy: "System", onClick: () => logout(navigate)},
    //     {value: "audit", text: "Audit", groupBy: "Application", onClick: () => navigate("/audit")}
    // ]);

    const theme = responsiveFontSizes(mainTheme);

    return (
        <ThemeProvider theme={theme}>
        <div>
            <div className="navBarContainer">
                <div className="logoWrapper">
                    <img src={logo} alt="logo of GanttApp" style={{width: "82px"}}/>
                    <Typography
                        variant="h5"
                        style={{marginLeft: "0.1vw", fontWeight: "600"}}
                        fontFamily={"Raleway, sans-serif"}
                    >
                        GanttApp
                    </Typography>
                </div>

                <div className="navBarButtons">
                <Typography
                        variant="h6"
                        style={{marginLeft: "0.1vw", fontWeight: "600"}}
                        fontFamily={"Raleway, sans-serif"}
                    >
                        My projects
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', textAlign: 'center' }}>
                    <Tooltip title="Account settings">
                        <IconButton
                            onClick={handleClick}
                            size="small"
                            sx={{ ml: 2 }}
                            aria-controls={open ? 'account-menu' : undefined}
                            aria-haspopup="true"
                            aria-expanded={open ? 'true' : undefined}
                        >
                            <Avatar sx={{ width: 32, height: 32 }}>{userNameLetter}</Avatar>
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
                <Avatar /> Profile
                </MenuItem>
                <Divider />
                <MenuItem onClick={handleLogout}>
                <ListItemIcon>
                    <Logout fontSize="small" />
                </ListItemIcon>
                Logout
                </MenuItem>
            </Menu>
                    {/* {withCreate && isAdmin ?
                     <ButtonIcon icon={ICON.PLUS} onClick={onClick} id="formOpener"/>
                                           :
                     undefined
                    }
                    <ButtonIconDropdown
                        icon={ICON.ELLIPSIS}
                        options={isAdmin ? dropDownOptionsAdmin : dropDownOptions}
                        id="navDropdownButton"
                        onChangeSelection={() => {
                        }}
                    /> */}
                </div>
            </div>
        </div>
        </ThemeProvider>
    );
};