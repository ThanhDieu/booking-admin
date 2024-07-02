import { Column, ColumnConfig } from '@ant-design/plots';
import data from './data';

function TrackingChart() {
  const columnConfig: ColumnConfig = {
    data: data.columnData,
    xField: 'type',
    yField: 'values',
    height: 180,
    isRange: true,
    autoFit: true,
    columnStyle: {
      fill: '#22272e'
    },
    label: {
      position: 'middle',
      layout: [
        {
          type: 'adjust-color'
        }
      ]
    }
  };

  return <Column {...columnConfig} />;
}

export default TrackingChart;
