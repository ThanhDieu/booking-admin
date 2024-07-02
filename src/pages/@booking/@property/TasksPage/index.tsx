import { DownOutlined } from '@ant-design/icons';
import {
  Alert,
  App,
  Badge,
  Button,
  Input,
  List,
  Radio,
  RadioChangeEvent,
  Space,
  Tag,
  Tree,
  Typography
} from 'antd';
import { DataNode } from 'antd/es/tree';
import clsx from 'clsx';
import { PlainLayout } from 'components/layout';
import ProtectedComponent from 'components/shared/ProtectedComponent';
import { DATE_FORMAT_2 } from 'configs/const/format';
import { A_THOUSAND, FuncType, ThemeType, filterBundle } from 'configs/const/general';
import { COPYRIGHT, paths } from 'constant';
import dayjs from 'dayjs';
import { useAsyncAction, useDidMount, useHelmet } from 'hooks';
import useView from 'hooks/useView';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ReactMarkdown } from 'react-markdown/lib/react-markdown';
import { useLocation, useNavigate } from 'react-router-dom';
import rehypeRaw from 'rehype-raw';
import rehypeSanitize from 'rehype-sanitize';
import { SendNewsletterPayload } from 'services/Bundle/type';
import { updateTaskService } from 'services/Tasks';
import { BundleTaskType, TaskPayLoadType, TaskShortType, TaskType } from 'services/Tasks/type';
import { useAppDispatch, useAppSelector } from 'store';
import { triggerSendNewsletterThunk } from 'store/booking/Bundle';
import { getBundleTaskList } from 'store/booking/Task';
import { QueryCaseType, getLocationObj, queryCase } from 'utils/queryParams';
import { loadAccessToken } from 'utils/storage';
import { capitalize } from 'utils/text';
import { ModalTask, PopoverConfirm } from './partials';

const { Text } = Typography;

export interface TasksGrouped {
  bundleGroup: {
    bundleId: string;
    name: string;
    description: string;
    isTemplate: boolean;
  };
  tasks: TaskType[];
}

export const statusArray = ['unknown', 'pending', 'completed', 'rejected'];
const PERPAGE = 8;
const TasksPage = () => {
  //* Declare variable global
  const { t, i18n } = useTranslation(['sidebar', 'common', 'tasks']);
  const currentLanguage = i18n.language;
  const { message } = App.useApp();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { currentViewObj, allowedApprove } = useView();
  const location = useLocation();
  const { bundleTasks, loading } = useAppSelector((state) => state?.booking?.task);
  const [modalController, setModalController] = useState<{
    type: string;
    open: boolean;
  }>({
    type: FuncType.READ,
    open: false
  });
  const { selected } = useAppSelector((state) => state.app.theme);

  const [locationCurrent, setLocationCurrent] = useState<QueryCaseType>({
    currentPage: 1,
    perPage: PERPAGE,
    status: statusArray[1]
  });

  const [taskSelected, setTaskSelected] = useState<
    {
      bundleName: string;
      bundleId: string;
      description: string;
      approveComment?: string;
      isLastTask: boolean;
    } & TaskShortType
  >();
  //* End declare variable global

  const [updateTask] = useAsyncAction(updateTaskService, {
    onSuccess: () => {
      handleChangeLocation({});
      message.success('Success!', 2);
    },
    onFailed: () => {
      // message.error('Failed!', 2);
    }
  });

  // FUNCTIONS
  const handleChangeLocation = (
    {
      currentPage = locationCurrent.currentPage,
      perPage = locationCurrent.perPage,
      sorts = locationCurrent.sorts,
      status = locationCurrent.status,
      username = locationCurrent.username,
      bundleId = locationCurrent.bundleId
    }: QueryCaseType,
    controller?: AbortController
  ) => {
    const query = queryCase({
      propertyId: currentViewObj?.code || '',
      currentPage,
      perPage,
      status,
      sorts,
      username,
      bundleId
    });

    dispatch(
      getBundleTaskList({
        query,
        signal: controller?.signal
      })
    );
    navigate(`/${currentViewObj.code}/${paths.tasks}?${query}`);
    setLocationCurrent({
      ...locationCurrent,
      currentPage,
      perPage,
      status,
      sorts,
      username,
      bundleId
    });
  };
  const handleFilter = (e: RadioChangeEvent) => {
    const filterVal = e.target.value;
    handleChangeLocation({
      ...locationCurrent,
      status: filterVal,
      currentPage: 1,
      bundleId: filterVal === filterBundle.APPROVED ? '' : locationCurrent.bundleId
    });
  };

  const numberOfPendingTask = (item: BundleTaskType) => {
    const peddingArr = item?.tasks?.filter((task) => statusArray[task.status] === 'pending');
    return peddingArr.length ?? 0;
  };

  const sendNewsletterFunc = (bundleId: string) => {
    const newsletterPayload: SendNewsletterPayload = {
      bundle_id: bundleId,
      token: loadAccessToken()
    };
    return dispatch(triggerSendNewsletterThunk({ payload: newsletterPayload }));
  };
  // Call
  useDidMount((controller) => {
    if (location) {
      const pathName = getLocationObj(location);
      handleChangeLocation(
        {
          status: statusArray[1],
          bundleId: pathName.bundleId
        },
        controller
      );
    }
  });

  const handleUpdate = (type: 'completed' | 'rejected', id: string, payload: TaskPayLoadType) => {
    if (type === 'completed' && payload.status === 'completed') {
      updateTask(id, payload);
      setModalController({ type: '', open: false });
    }
    if (type === 'rejected' && payload.status === 'rejected') {
      updateTask(id, payload);
      // deleteTask(id);
    }
  };
  //* End Handle api service

  //* Handle interface
  const renderListItem = (item: BundleTaskType) => {
    if (!item) return <></>;
    const { tasks } = item;
    const localizedItemTitle = item?.extendedData?.title[currentLanguage] ?? item.name;
    const linkBundleDetail = `/${currentViewObj?.code}/${paths.bundles}/${item?.isTemplate ? paths.bundlesTemplate : paths.bundlesOverview
      }/${item?.bundleId}`;

    const treeNodeData: DataNode[] = tasks?.map((task) => {
      const formatterConstraints = task.constraints.split(':')[1];

      return {
        key: task.taskId,
        isLeaf: true,
        checkable: false,
        disableCheckbox: true,
        selectable: false,
        title: (
          <Alert
            message={
              <Space>
                <Text
                  className="cursor-pointer"
                  onClick={() => {
                    setTaskSelected({
                      bundleId: item.bundleId,
                      bundleName: localizedItemTitle,
                      description: item.description || '',
                      ...task,
                      isLastTask: item.isNewsletter === true && numberOfPendingTask(item) === 1
                    });
                    setModalController({ type: FuncType.READ, open: true });
                  }}
                >
                  {formatterConstraints
                    .split('/')
                    .map((part: string) => part.charAt(0).toUpperCase() + part.slice(1))
                    .reverse()
                    .join(' ')}
                </Text>
                <Tag
                  color={
                    statusArray[task.status] === statusArray[1]
                      ? 'gold'
                      : statusArray[task.status] === statusArray[2]
                        ? 'green'
                        : 'volcano'
                  }
                >
                  {task && statusArray[task.status]}
                </Tag>
              </Space>
            }
            description={
              <>
                <Typography.Text>
                  {dayjs(task.validUntil * A_THOUSAND).format(DATE_FORMAT_2)}
                </Typography.Text>
                <ReactMarkdown rehypePlugins={[rehypeRaw, rehypeSanitize]}>
                  {item.description || ''}
                </ReactMarkdown>
              </>
            }
            type="info"
            action={
              <div className="w-96 flex flex-row gap-4 justify-end">

                <ProtectedComponent renderIfTrue={() => statusArray[task.status] === statusArray[1] && allowedApprove}>
                  <Button
                    type="primary"
                    onClick={() => {
                      setTaskSelected({
                        bundleId: item.bundleId,
                        bundleName: localizedItemTitle,
                        description: item.description || '',
                        ...task,
                        isLastTask: item.isNewsletter === true && numberOfPendingTask(item) === 1
                      });
                      setModalController({ type: FuncType.UPDATE, open: true });
                    }}
                  >
                    {numberOfPendingTask(item) === 1 && item.isNewsletter
                      ? t('common:button.approve_and_send_newsletter')
                      : t('common:button.approve')}
                  </Button>
                  <PopoverConfirm
                    name={localizedItemTitle}
                    keyConfirm={formatterConstraints}
                    tail="bundle"
                    onConfirm={() => {
                      handleUpdate('rejected', task.taskId, { status: 'rejected', comment: '' });
                    }}
                  >
                    <Button danger type="default">
                      {t('common:button.reject')}
                    </Button>
                  </PopoverConfirm>
                </ProtectedComponent>
                {statusArray[task.status] === statusArray[2] ? (
                  task?.comment ? (
                    <Input.TextArea
                      value={task?.comment}
                      className="cursor-default"
                      placeholder={t('tasks:placeholder_comment')}
                      contentEditable={false}
                    />
                  ) : (
                    <></>
                  )
                ) : null}
              </div>
            }
            className="cursor-default"
          />
        )
      };
    });

    return (
      <Badge.Ribbon
        className="mr-3"
        text={`${capitalize(locationCurrent.status || statusArray[1])}`}
        color={locationCurrent.status === filterBundle.APPROVED ? 'green' : 'gold'}
      >
        <List.Item
          style={{ borderBlockEnd: 'none' }}
          className={clsx(
            selected === ThemeType.DEFAULT
              ? 'border-[rgba(5,5,5,0.06)] bg-white'
              : 'border-[rgba(197,193,193,0.57)] bg-[#090C08]',
            'task-list rounded border border-solid  mb-4 last:mb-0 '
          )}
        >
          <Tree
            showIcon
            switcherIcon={<DownOutlined />}
            treeData={[
              {
                key: item?.bundleId,
                title: (
                  <Space>
                    <Text onClick={() => navigate(linkBundleDetail, { replace: true })}>
                      {localizedItemTitle}
                    </Text>
                    {item?.isNewsletter && (
                      <Tag color="gold">{t('sidebar:sidebar.newsletter')}</Tag>
                    )}
                  </Space>
                ),
                children: treeNodeData,
                className: 'w-fit'
              }
            ]}
            className="w-full"
            blockNode
            showLine
            autoExpandParent
          />
        </List.Item>
      </Badge.Ribbon>
    );
  };

  useHelmet({
    title: t('tasks:tasks_page')
  });
  //* End handle interface

  return (
    <PlainLayout
      headerprops={{
        title: t('sidebar:sidebar.tasks'),
        extra: (
          <>
            <Radio.Group
              onChange={handleFilter}
              value={locationCurrent.status}
              optionType="button"
              buttonStyle="solid"
            >
              <Radio.Button value={filterBundle.PENDING}>
                {t('common:button.' + filterBundle.PENDING)}
              </Radio.Button>
              <Radio.Button value={filterBundle.APPROVED}>
                {t('common:button.' + filterBundle.APPROVED)}
              </Radio.Button>
            </Radio.Group>
          </>
        ),
        className: 'mb-2'
      }}
      footerprops={{
        children: COPYRIGHT,
        className: 'text-center'
      }}
      className="bg-inherit"
    >
      <List
        size="large"
        pagination={
          bundleTasks?.pagination?.total && bundleTasks.pagination.total > PERPAGE
            ? {
              position: 'bottom',
              align: 'end',
              pageSize: PERPAGE,
              total: bundleTasks?.pagination?.total ? Number(bundleTasks?.pagination.total) : 1,
              showSizeChanger: false,
              onChange: (value) => {
                handleChangeLocation &&
                  handleChangeLocation({ ...locationCurrent, currentPage: value });
              },
              current: locationCurrent?.currentPage || 1
            }
            : false
        }
        dataSource={bundleTasks?.data || []}
        renderItem={(item) => renderListItem(item)}
        loading={loading}
      />

      <ModalTask
        sendNewsletterFunc={sendNewsletterFunc}
        data={taskSelected}
        controller={modalController}
        onSubmitModal={(id: string, payload: TaskPayLoadType) => {
          handleUpdate('completed', id, payload);
        }}
        onCancel={() => setModalController({ type: '', open: false })}
      />
    </PlainLayout>
  );
};

export default TasksPage;
