import { Box, Paper, Stack, Tooltip, Typography, styled } from '@mui/material';
import React, { memo } from 'react';
import { Handle, NodeProps, Position } from 'react-flow-renderer';
import "./TooltipNode.css"
import { Height } from '@mui/icons-material';

const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.mode === 'dark' ? 'gray' : 'white',
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: 'center',
  color: theme.palette.text.primary,
  boxShadow: "none"
}));

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

    
const TooltipNode: React.FC<NodeProps> = ({ data }) => {

      const renderAssignees = () => {
        let index = -1;
        return (
          <>
          {data.assignees.map((assignee: string) => {
            index++;
            index = index == assigneesColorPalette.length? 0 : index;
          return (<div>
            <Tooltip arrow title={assignee}>
              <Item sx={{backgroundColor: assigneesColorPalette[index]}}>{assignee.substring(0, 4)+"..."}</Item>
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
            <div className='tooltipStyle'>
            {!data.init? (<Handle type="target" position={Position.Left} />) : undefined}
            <div className="nodeHeader">
              <Typography sx={{textAlign: "start"}} fontWeight={"bold"} fontFamily={"Raleway, sans-serif"} color="white">{data.label}</Typography>
              <Typography sx={{textAlign: "start"}} fontWeight={"normal"} fontFamily={"Raleway, sans-serif"} color="white">state: 70%</Typography>
            </div>
            <div className='nodeInfo'>
              <Typography variant="body1" sx={{textAlign: "start", marginTop: "2px"}} fontWeight={"normal"} fontFamily={"Raleway, sans-serif"} color="inherit">{data.phaseName}</Typography>
              <Box sx={{ width: 250 }}>
                <Stack useFlexGap flexWrap="wrap" height={"50%"} direction="row" spacing={{xs: 1, sm: 1}}>
                  {renderAssignees()}
                  <Item>team...</Item>
                  <Item>team...</Item>
                  <Item>team...</Item>
                  <Item>team...</Item>
                </Stack>
              </Box>
            </div>
            {!data.output? (<Handle type="source" position={Position.Right} />) : undefined}
            </div>
        </div>
      );
  };

export default memo(TooltipNode);