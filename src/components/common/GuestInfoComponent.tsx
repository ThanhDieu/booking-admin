import { Space, Typography } from 'antd';
import React from 'react';

interface Props {
  items: {
    title: string;
    content: string | number;
  }[];
  isOffer?: boolean;
}
const GuestInfoComponent = ({ items, isOffer }: Props) => {
  return (
    <Space direction="vertical" size={0}>
      {items?.map(
        ({ title, content }) =>
          content !== '' && (
            <Typography.Text strong className={isOffer ? 'text-sm' : 'text-base'} key={title}>
              {title}: <span className="font-normal">{content}</span>
            </Typography.Text>
          )
      )}
    </Space>
  );
};

export default GuestInfoComponent;
