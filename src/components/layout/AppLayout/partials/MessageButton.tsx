import { Button } from 'antd';
import { MessageOutlined } from '@ant-design/icons';

function MessageButton() {
  return <Button className="h-[32px]" type="text" shape="circle" icon={<MessageOutlined />} />;
}

export default MessageButton;
