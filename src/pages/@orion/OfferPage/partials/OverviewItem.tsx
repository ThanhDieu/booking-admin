import { Space, Typography } from 'antd';

interface Props {
  title: string;
  subTitle?: string;
  count?: number;
  currencySymbol?: string;
  price: string;
  isBoldPrice?: boolean;
}

const OverviewItem = ({ title, subTitle, count, currencySymbol, price, isBoldPrice }: Props) => {
  return (
    <Space className="justify-between text-base">
      <div className="flex flex-col items-start">
        <Typography.Text className="text-base">{title}</Typography.Text>
        {subTitle && <Typography.Text className="text-sm">{subTitle}</Typography.Text>}
      </div>
      <div className="flex gap-10 justify-between">
        {count && <Typography.Text className="text-base">x{count}</Typography.Text>}
        <Typography.Text
          strong={isBoldPrice}
          className="min-w-[76px] text-base"
          style={{ textAlign: 'end' }}
        >
          {currencySymbol} {price}
        </Typography.Text>
      </div>
    </Space>
  );
};

export default OverviewItem;
