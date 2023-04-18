import { Tooltip, Typography } from '@mui/material';
import React, { memo } from 'react';
import { Handle, NodeProps, Position } from 'react-flow-renderer';
import "./TooltipNode.css"


    
const TooltipNode: React.FC<NodeProps> = ({ data }) => {
      return (
        <div>
          <Tooltip arrow title={<React.Fragment>
              <Typography fontWeight={"bold"} fontFamily={"Raleway, sans-serif"} color="inherit">{data.phaseName}</Typography>
              <Typography fontFamily={"Raleway, sans-serif"} color="inherit">Number of assignees: { data.assignees !== null? data.assignees.length : "0"}</Typography>
          </React.Fragment>}>
            <div className='tooltipStyle'>
            {!data.init? (<Handle type="target" position={Position.Left} />) : undefined}
            <Typography fontFamily={"Raleway, sans-serif"} color="inherit">{data.label}</Typography>
            {!data.output? (<Handle type="source" position={Position.Right} />) : undefined}
            </div>
          </Tooltip>
        </div>
      );
  };

export default memo(TooltipNode);