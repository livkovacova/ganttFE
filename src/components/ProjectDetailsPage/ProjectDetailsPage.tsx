import ThemeProvider from "@mui/material/styles/ThemeProvider";
import React from "react";
import mainTheme from "../commons/mainTheme";
import { responsiveFontSizes } from '@mui/material/styles';
import { NavigationBar } from "../NavigationBar/NavigationBar";
import IUser from "../../types/user.type";



interface Props {
    isManager: boolean;
    currentUser: IUser | undefined;
}
const theme = responsiveFontSizes(mainTheme);

export const ProjectDetailsPage = ({isManager, currentUser}: Props) => {

    return (
        <ThemeProvider theme={theme}>
            <div className="projectDetailsPageContainer">
                <NavigationBar withCreate={false} isManager={isManager} mainTitle="Project detail" userNameLetter={currentUser?.username.charAt(0).toUpperCase()}/>
            </div>
        </ThemeProvider>
    );
};

export default ProjectDetailsPage;