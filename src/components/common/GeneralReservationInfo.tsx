import { Button, Space, Typography } from 'antd';
import clsx from 'clsx';
import { ReactNode } from 'react';

export interface GeneralReservationInfoProps {
  icon: ReactNode;
  value?: string | number;
}
interface Props {
  items: GeneralReservationInfoProps[];
  btnName?: string;
  btnIcon?: ReactNode;
  callback?: () => void;
  className?: string;
}

const GeneralReservationInfo = ({ items, btnName, btnIcon, callback, className }: Props) => {
  return (
    <Space size="large" className={clsx('py-2', className)}>
      {items?.map(({ icon, value = '' }) => (
        <Space size={5} key={value}>
          {icon}
          <Typography.Text>{value}</Typography.Text>
        </Space>
      ))}
      {btnName && btnIcon && callback && (
        <Button onClick={callback} icon={btnIcon} type="text" className=" text-orange-400">
          {btnName}
        </Button>
      )}
    </Space>
  );
};

export default GeneralReservationInfo;
