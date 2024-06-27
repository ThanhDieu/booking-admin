import { Button } from 'antd';
import { BellOutlined } from '@ant-design/icons';

function NotificationButton() {
  return <Button className="h-[32px]" type="text" shape="circle" icon={<BellOutlined />} />;
}

export default NotificationButton;
