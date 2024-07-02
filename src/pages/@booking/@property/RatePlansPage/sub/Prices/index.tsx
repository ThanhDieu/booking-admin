import { useState } from 'react';

import { Space } from 'antd';
import dayjs from 'dayjs';
import { TableRate } from './patials';

const RatePlanPricePage = () => {
  const [startDate, setStartDate] = useState<dayjs.Dayjs>(dayjs());

  return (
    <Space direction="vertical" size="large" className="w-full">
      <TableRate startDate={startDate} setStartDate={setStartDate} />
      {/* TODO */}
      {/* <TableUnitAvailibitity
        dateFormat={dateFormat}
        startDate={startDate}
        setStartDate={setStartDate}
      /> */}
    </Space>
  );
};

export default RatePlanPricePage;
