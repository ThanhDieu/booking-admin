/* eslint-disable @typescript-eslint/no-unused-vars */
import { Descriptions, Divider, Modal, ModalProps, Tag } from 'antd';
import { FuncType } from 'configs/const/general';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import ReactMarkdown from 'react-markdown';
import rehypeRaw from 'rehype-raw';
import rehypeSanitize from 'rehype-sanitize';
import { TaskPayLoadType, TaskShortType } from 'services/Tasks/type';
import { capitalize } from 'utils/text';
import { statusArray } from '..';

interface ModalTaskProp extends ModalProps {
  data?: {
    bundleId: string;
    bundleName: string;
    description: string;
    isLastTask: boolean;
  } & TaskShortType;
  controller: {
    type: string;
    open: boolean;
  };
  onSubmitModal: (id: string, payload: TaskPayLoadType) => void;
  sendNewsletterFunc: (bundleId: string) => void;
}

const ModalTask = ({
  data,
  controller,
  onSubmitModal: handleApproved,
  onCancel,
  sendNewsletterFunc
}: ModalTaskProp) => {
  const { t } = useTranslation(['tasks']);
  const { type, open } = controller;
  const [comment, setComment] = useState<string>();

  if (!data) return <React.Fragment></React.Fragment>;
  const { bundleId, bundleName, description, isLastTask, ...task } = data;

  return (
    <Modal
      title={t('tasks:tasks_information')}
      open={open}
      onCancel={onCancel}
      onOk={() => {
        handleApproved &&
          handleApproved(task.taskId, {
            status: 'completed',
            comment: comment || ''
          });
        isLastTask && sendNewsletterFunc(bundleId);
      }}
    >
      <Descriptions column={1}>
        <Descriptions.Item label={t('common:table.status')}>
          <Tag color={statusArray[task.status] === 'completed' ? 'green' : 'gold'}>
            {capitalize(statusArray[task.status])}
          </Tag>
        </Descriptions.Item>
        <Descriptions.Item label={t('tasks:bundle_name')}>{bundleName}</Descriptions.Item>
        <Descriptions.Item label={t('tasks:role')}>
          {task.constraints
            .split(':')[1]
            .split('/')
            .map((part: string) => part.charAt(0).toUpperCase() + part.slice(1))
            .reverse()
            .join(' ')}
        </Descriptions.Item>

        {description && description.length ? (
          <Descriptions.Item label={t('common:table.description')}>
            <ReactMarkdown rehypePlugins={[rehypeRaw, rehypeSanitize]}>{description}</ReactMarkdown>
          </Descriptions.Item>
        ) : null}

        {type === FuncType.READ && task?.comment && task?.comment?.length ? (
          <Descriptions.Item label={t('common:table.comment')}>{task?.comment}</Descriptions.Item>
        ) : null}
      </Descriptions>

      {type === FuncType.UPDATE ? (
        <>
          <Divider className="mt-0 mb-2" />
          {/* <Form layout="vertical">
            <Form.Item name={'comment'} label={<Text>{t('tasks:approve_comment')}:</Text>}>
              <Input.TextArea
                value={comment}
                rows={4}
                onChange={(e) => setComment(e.target.value)}
              />
            </Form.Item>
          </Form> */}
        </>
      ) : null}
    </Modal>
  );
};

export default ModalTask;
