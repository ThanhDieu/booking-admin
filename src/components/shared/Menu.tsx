import { Button, Typography, ButtonProps, Space } from 'antd';
import clsx from 'clsx';

export interface MenuProps {
  title?: string;
  size?: 'small' | 'large' | 'medium';
  direction?: 'horizontal' | 'vertical';
  items?: (ButtonProps & { key?: string })[];
  selected?: string;
}

const { Text } = Typography;

function Menu(props: MenuProps) {
  const { title, size, direction = 'vertical', items, selected } = props;

  const getDefaultItemProps: (props: ButtonProps) => ButtonProps = (itemProps) => {
    return {
      ...itemProps,
      className: clsx('w-full text-start', itemProps.className),
      size: size && itemProps.size,
      type: itemProps.type || 'text'
    };
  };

  return (
    <Space direction={direction} className="w-full">
      {title && <Text type="secondary">{title}</Text>}
      {items &&
        items.map((item) => (
          <Button
            key={item.accessKey}
            {...getDefaultItemProps(item)}
            type={selected === item.key ? 'default' : 'text'}
          />
        ))}
    </Space>
  );
}

export default Menu;
