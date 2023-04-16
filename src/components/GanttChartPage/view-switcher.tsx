import React from "react";
import "gantt-task-react/dist/index.css";
import { ViewMode } from "gantt-task-react";
import { Button, ButtonGroup, FormControl, FormControlLabel, Switch, ThemeProvider, Typography, responsiveFontSizes } from "@mui/material";
import mainTheme from "../commons/mainTheme";
type ViewSettingsProps = {
  showTaskList: boolean;
  onViewListChange: (showTaskList: boolean) => void;
  onViewModeChange: (viewMode: ViewMode) => void;
};
export const ViewSettings: React.FC<ViewSettingsProps> = ({
  onViewModeChange,
  onViewListChange,
  showTaskList,
}) => {
  const [selected, setSelected] = React.useState(ViewMode.Day);
  const theme = responsiveFontSizes(mainTheme);

  const onButtonClick = (viewMode: ViewMode) => {
    setSelected(viewMode);
    onViewModeChange(viewMode);
  }

  const chooseColor = (viewMode: ViewMode) => {
    return viewMode === selected ? "primary" : "secondary";
  } 

  return (
    <ThemeProvider theme={theme}>
      <div className="ViewContainer">
        <FormControl 
        sx={{
          justifyContent:"flex-start",
          '& .MuiTypography-root ': {
            fontFamily: "Raleway, sans-serif"
            },
        }}>
          <FormControlLabel
            control={
                <Switch checked={showTaskList} onChange={(e) => onViewListChange(!showTaskList)} name="taskListToggle" />
            }
            label="Show Task List"
            labelPlacement="end"
            sx={{marginLeft:"0.5vw", flexDirection:"row"}}
          />
        </FormControl>
        <div className="ViewModeButtons">
        <Typography marginRight={"0.5vw"} fontFamily={"Raleway, sans-serif"}>View mode:</Typography>
        <ButtonGroup variant="text" orientation="horizontal" sx={{justifyContent:"flex-end"}}>
                  <Button color={chooseColor(ViewMode.Hour)} onClick={() => onButtonClick(ViewMode.Hour)}>
                      Hour
                  </Button>
                  <Button color={chooseColor(ViewMode.Day)} onClick={() => onButtonClick(ViewMode.Day)}>
                      Day
                  </Button>
                  <Button color={chooseColor(ViewMode.Week)} onClick={() => onButtonClick(ViewMode.Week)}>
                      Week
                  </Button>
                  <Button color={chooseColor(ViewMode.Month)} onClick={() => onButtonClick(ViewMode.Month)}>
                      Month
                  </Button>
                  <Button color={chooseColor(ViewMode.Year)} onClick={() => onButtonClick(ViewMode.Year)}>
                      Year
                  </Button>
        </ButtonGroup>
        </div>
        </div>
    </ThemeProvider>
  );
};
