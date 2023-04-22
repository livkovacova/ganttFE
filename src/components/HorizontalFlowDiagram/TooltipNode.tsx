import { Box, Paper, Stack, Tooltip, Typography, styled } from '@mui/material';
import React, { memo } from 'react';
import { Handle, NodeProps, Position } from 'react-flow-renderer';
import "./TooltipNode.css"

const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.mode === 'dark' ? 'gray' : 'white',
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: 'center',
  color: theme.palette.text.primary,
  boxShadow: "none"
}));

let colorToAssign = 0;

const assigneesColorPalette = [
  "#9cc0c1",
  "#bbd4d5",
  "#d7e3e0",
  "#c4dac7",
  "#a4c7a9",
  "#aec6c1",
  "#bdd1cc",
  "#d7dcd7",
  "#c4dbc7",
  "#b4d1b8",
]

const mapMemberToColor = new Map<string, string>();
    
const TooltipNode: React.FC<NodeProps> = ({ data }) => {

      const resolveAssigneeString = (assignee: string, amountOfAssignees: number):string => {
        let result = "";
        if(amountOfAssignees <= 2){
          if(amountOfAssignees == 1){
            result = assignee.substring(0,20);
          }
          else{
            result = assignee.substring(0,9);
            if(assignee.length > 10){
              result += "...";
            }
          }
        }
        else{
          result = assignee.substring(0,3);
          if(assignee.length >= 4){
            result += "...";
          }
        }
        return result;
      }

      function resolveMemberColor(assignee: string) {
        if(mapMemberToColor.get(assignee) === undefined){
          if(colorToAssign == assigneesColorPalette.length){
            colorToAssign = 0;
          }
          mapMemberToColor.set(assignee,assigneesColorPalette[colorToAssign]);
          colorToAssign++;
          return assigneesColorPalette[colorToAssign]
        }
        else{
          return mapMemberToColor.get(assignee);
        }
      }

      const renderAssignees = () => {
        let index = -1;
        return (
          <>
          {data.assignees.map((assignee: string) => {
            index++;
            index = index == assigneesColorPalette.length? 0 : index;
          return (<div>
            <Tooltip key={assignee} arrow title={assignee}>
              <Item sx={{backgroundColor: resolveMemberColor(assignee)}}>{
                resolveAssigneeString(assignee, data.assignees.length)
                }</Item>
            </Tooltip>
          </div>
          )
          }
          )}
          </>
        )
      }

      return (
        <div>
            <div className='tooltipStyle' style={{height: data.height}}>
            {!data.init? (<Handle type="target" position={Position.Left} />) : undefined}
            <div className="nodeHeader">
              <Typography   
                style={{ wordWrap: "break-word" }}
                sx={{textAlign: "start"}} 
                fontWeight={"bold"} 
                fontFamily={"Raleway, sans-serif"} 
                color="white">
                  {data.label}
              </Typography>
              <Typography sx={{textAlign: "start"}} fontWeight={"normal"} fontFamily={"Raleway, sans-serif"} color="white">state: 70%</Typography>
            </div>
            <div className='nodeInfo'>
              <div className='phaseInfo'>
              <Typography variant="body1" sx={{wordWrap:"break-word", textAlign: "start", paddingTop: "2px", paddingLeft:"2px"}} fontWeight={"normal"} fontFamily={"Raleway, sans-serif"} color="inherit">{data.phaseName}</Typography>
              </div>
              <Box sx={{ width: 230}}>
                <Stack sx={{paddingLeft: "4px", paddingBottom: "3px", paddingTop:"3px"}} useFlexGap flexWrap="wrap" height={"50%"} direction="row" spacing={{xs: 1, sm: 1}}>
                  {renderAssignees()}
                </Stack>
              </Box>
            </div>
            {!data.output? (<Handle type="source" position={Position.Right} />) : undefined}
            </div>
        </div>
      );
  };

export default memo(TooltipNode);