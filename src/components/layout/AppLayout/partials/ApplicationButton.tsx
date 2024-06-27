import { Button } from 'antd';
import { AppstoreOutlined } from '@ant-design/icons';

function ApplicationButton() {
  return <Button className="h-[32px]" type="text" icon={<AppstoreOutlined />} />;
}

export default ApplicationButton;
