import { Space, Typography } from 'antd';
import React from 'react';
import { useAppSelector } from 'store';

interface Props {
  propertyId: string;
}

const PropertyInfoComponent = ({ propertyId }: Props) => {
  const { properties } = useAppSelector((state) => state.orion?.property);
  const propertyInfo = properties?.data?.filter((pro) => pro.extId === propertyId);

  return (
    <>
      {propertyInfo?.toLocaleString ? (
        <Space direction="vertical" size={0}>
          <Typography.Title level={5}>{propertyInfo[0]?.name}</Typography.Title>
          <Typography.Text>
            {propertyInfo[0]?.data?.location?.addressLine1}
            {propertyInfo[0]?.data?.location?.addressLine2}, {propertyInfo[0]?.data?.location?.city}
          </Typography.Text>
        </Space>
      ) : null}
    </>
  );
};

export default PropertyInfoComponent;
