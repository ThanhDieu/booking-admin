import { Button, Space, Typography } from 'antd';
import React from 'react';
import { EditOutlined, DeleteOutlined } from '@ant-design/icons';
import { FuncType } from 'configs/const/general';
import { useTranslation } from 'react-i18next';

interface Props {
  comment: string;
  setModalOpen: React.Dispatch<React.SetStateAction<string>>;
}
const CommentBox = ({ setModalOpen, comment }: Props) => {
  const { t } = useTranslation(['common', 'reservation']);
  return (
    <Space className="" direction="vertical" size={5}>
      <Typography.Text strong className="text-base">
        {t('reservation:comment')}
      </Typography.Text>
      <Typography.Text className="font-normal">{comment}</Typography.Text>

      <Space>
        <Button type="text" icon={<EditOutlined />} onClick={() => setModalOpen(FuncType.UPDATE)}>
          {t('common:button.edit')}
        </Button>
        <Button type="text" icon={<DeleteOutlined />} onClick={() => setModalOpen(FuncType.DELETE)}>
          {t('common:button.delete')}
        </Button>
      </Space>
    </Space>
  );
};

export default CommentBox;
