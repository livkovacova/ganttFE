import { Typography } from "@mui/material";

interface Props {
    isManager: boolean;
}

export const MyProjectsPage = ({isManager}: Props) => {
    return (
        <div className="projectsPageContainer">
            {isManager ? 
                <Typography variant="h1">
                    h1. Manager 
                </Typography>
                :
                <Typography variant="h2">
                    h2. Team member 
                </Typography>
            }
        </div>
    );
};