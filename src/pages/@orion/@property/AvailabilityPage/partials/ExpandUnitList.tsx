import { Space, Typography } from 'antd';
import React from 'react';
import { useTranslation } from 'react-i18next';

interface Props {
  id: string;
}

const ExpandUnitList = ({ id }: Props) => {
  const { t } = useTranslation(["availability"])
  return (
    <ul className="w-[20%] " style={{ borderRight: '1px solid #f0f0f0' }}>
      <Space direction="vertical" size="middle">
        <div>
          <li className="list-none">
            <Typography.Text>{t("availability:house_count")}</Typography.Text>
          </li>
          <li className="list-none">
            <Typography.Text>{t("availability:out_of_order")}</Typography.Text>
          </li>
          <li className="list-none">
            <Typography.Text>{t("availability:sold")}</Typography.Text>
          </li>
        </div>
        <div>
          <li className="list-none">
            <Typography.Text>{t("availability:blocks")}</Typography.Text>
          </li>
          <li className=" ml-5 list-none">
            <Typography.Text>{t("availability:definitely_blocked")}</Typography.Text>
          </li>
          <li className=" ml-5 list-none">
            <Typography.Text>{t("availability:picked")}</Typography.Text>
          </li>
          <li className=" ml-5 list-none">
            <Typography.Text>{t("availability:remaining")}</Typography.Text>
          </li>
          <li className=" ml-5 list-none">
            <Typography.Text>{t("availability:tentatively_blocked")}</Typography.Text>
          </li>
        </div>
        <div>
          <li className="list-none">
            <Typography.Text strong>{t("availability:occupancy")}</Typography.Text>
          </li>
          {id !== 'BER-OCC' && (
            <li className="list-none">
              <Typography.Text strong>{t("availability:available")}</Typography.Text>
            </li>
          )}
          <li className="list-none">
            <Typography.Text strong>{t("availability:available_to_sell")}</Typography.Text>
          </li>
          <li className="list-none">
            <Typography.Text strong>{t("availability:allowed_overbooking")}</Typography.Text>
          </li>
          <li className="list-none">
            <Typography.Text strong>{t("availability:possible_overbooking")}</Typography.Text>
          </li>
        </div>
      </Space>
    </ul>
  );
};

export default ExpandUnitList;
