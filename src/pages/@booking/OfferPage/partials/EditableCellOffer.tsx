/* eslint-disable @typescript-eslint/no-explicit-any */
import { DatePicker, Form } from 'antd';
import { RangePickerProps } from 'antd/es/date-picker';
import dayjs from 'dayjs';
import React from 'react';

const EditableCell: React.FC<any> = ({
  editing,
  dataIndex,
  title,
  record,
  children,
  ...restProps
}) => {
  const disabledDate: RangePickerProps['disabledDate'] = (current) => {
    const beforeArrival = dayjs.unix(record?.arrival).subtract(1, 'day');
    return current.isAfter(beforeArrival, 'day');
  };

  return (
    <td {...restProps}>
      {editing ? (
        <Form.Item
          name={dataIndex}
          style={{ margin: 0 }}
          rules={[
            {
              required: true,
              message: `Please Input ${title}!`
            }
          ]}
        >
          <DatePicker disabledDate={disabledDate} />
        </Form.Item>
      ) : (
        children
      )}
    </td>
  );
};

export default EditableCell;
