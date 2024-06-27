/* eslint-disable @typescript-eslint/no-explicit-any */
import { Space } from 'antd';
import React from 'react';

export interface Props {
  unitGroup: any;
  id: string;
}

const ExpandUnitValue = ({ unitGroup, id }: Props) => {
  return (
    <div className="flex-1">
      <div className="flex translate-x-1/2 flex-col text-center">
        <Space direction="vertical" size="middle">
          <div>
            <div className="flex-1">{unitGroup?.houseCount}</div>
            <div className="flex-1">{unitGroup?.maintenance.outOfOrder}</div>
            <div className="flex-1">{unitGroup?.soldCount}</div>
          </div>
          <div>
            <div className="flex-1">&nbsp;</div>
            <div className="flex-1">{unitGroup?.block.definite}</div>
            <div className="flex-1">{unitGroup?.block.picked}</div>
            <div className="flex-1">{unitGroup?.block.remaining}</div>
            <div className="flex-1">{unitGroup?.block.tentative}</div>
          </div>
          <div>
            <div className="flex-1">{unitGroup?.occupancy}%</div>
            {id !== 'BER-OCC' && <div className="flex-1">{unitGroup?.availableCount}</div>}
            <div className="flex-1">{unitGroup?.sellableCount}</div>
            <div className="flex-1">{unitGroup?.allowedOverbookingCount}</div>
            <div className="flex-1">{unitGroup?.allowedOverbookingCount}</div>
          </div>
        </Space>
      </div>
    </div>
  );
};

export default ExpandUnitValue;
