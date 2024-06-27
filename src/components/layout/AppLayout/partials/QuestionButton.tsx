import { Button } from 'antd';
import { QuestionCircleOutlined } from '@ant-design/icons';

function QuestionButton() {
  return (
    <Button className="h-[32px]" type="text" shape="circle" icon={<QuestionCircleOutlined />} />
  );
}

export default QuestionButton;
