import { Tag } from 'antd';
import clsx from 'clsx';
import { useAppSelector } from 'store';
import { isLightColor, isValidColorCode } from 'utils/color';

interface Props {
  value: string;
  color?: string;
  classNameCus?: string;
}

const TagCustomComponent: React.FC<Props> = ({ value, color, classNameCus }) => {
  const { colorPrimary } = useAppSelector((state) => state.app.theme);
  const isValidColor = color && isValidColorCode(color);
  return (
    <Tag
      color={isValidColor ? `#${color.replace('#', '')}` : colorPrimary}
      className={clsx(classNameCus)}
      style={{ color: color && isLightColor(color) ? '#000' : '#fff' }}
    >
      {value}
    </Tag>
  );
};

export default TagCustomComponent;
