/* eslint-disable @typescript-eslint/no-unused-vars */
import { MenuUnfoldOutlined, RightOutlined } from '@ant-design/icons';
import { Badge, Card, List, Skeleton, Space, Typography } from 'antd';
import clsx from 'clsx';
import { TagCustomComponent } from 'components/common';
import { ViewMode } from 'configs/const/auth';
import { DATE_FORMAT_2 } from 'configs/const/format';
import { A_THOUSAND, ThemeType } from 'configs/const/general';
import { paths } from 'constant';
import dayjs from 'dayjs';
import useView from 'hooks/useView';
import { statusArray } from 'pages/@booking/@property/TasksPage';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from 'store';
import { getTaskList } from 'store/booking/Task';
import { QueryCaseType, queryCase } from 'utils/queryParams';

const PERPAGE = 5;
const TaskList: React.FC = () => {
  const { t, i18n } = useTranslation(['dashboard', 'common']);
  const { profile } = useAppSelector((state) => state.booking?.auth);
  const { tasks, loading } = useAppSelector((state) => state.booking?.task);
  const { selected } = useAppSelector((state) => state.app.theme);
  const navigate = useNavigate();
  const dispacth = useAppDispatch();
  const { currentViewObj, currentView } = useView();
  const [locationCurrent, setLocationCurrent] = useState<QueryCaseType>({
    currentPage: 1,
    perPage: PERPAGE,
    username: profile?.username || '',
    status: statusArray[1]
  });
  const currentLanguage = i18n.language
  const handleChangeLocation = (
    {
      currentPage = locationCurrent.currentPage,
      perPage = locationCurrent.perPage,
      sorts = locationCurrent.sorts,
      status = locationCurrent.status,
      username = locationCurrent.username
    }: QueryCaseType,
    controller?: AbortController
  ) => {
    const query = queryCase({
      propertyId: currentView === ViewMode.Account ? '' : currentViewObj?.code || '',
      currentPage,
      perPage,
      status,
      sorts,
      username
    });

    dispacth(
      getTaskList({
        query,
        signal: controller?.signal
      })
    );
    setLocationCurrent({
      ...locationCurrent,
      currentPage,
      perPage,
      status,
      sorts,
      username
    });
  };

  // LIFE
  useEffect(() => {
    const controller = new AbortController();
    if (profile?.username)
      handleChangeLocation(
        {
          username: profile?.username || '',
          status: statusArray[1],
          propertyId: currentView !== ViewMode.Account ? currentViewObj.code : '',
          currentPage: 1
        },
        controller
      );

    return () => {
      controller.abort();
    };
  }, [currentView, profile?.username]);

  return (
    <Badge.Ribbon
      text={
        <Typography.Text className="text-white">
          <Badge className="mt-[-3px]" size="small" count={tasks?.pagination?.total || 0} />{' '}
          {t('common:button.pending')}
        </Typography.Text>
      }
      color="gold"
    >
      <Card
        title={
          <Space>
            <MenuUnfoldOutlined />
            <Typography.Text>{t('dashboard:dashboard_page.table_tasks.title')}</Typography.Text>
          </Space>
        }
        size="small"
      >
        <List
          pagination={
            tasks?.pagination?.total && tasks?.pagination?.total > PERPAGE
              ? {
                position: 'bottom',
                align: 'end',
                size: 'small',
                pageSize: PERPAGE,
                total: tasks?.pagination?.total ? Number(tasks?.pagination.total) : 1,
                showSizeChanger: false,
                onChange: (value) => {
                  handleChangeLocation &&
                    handleChangeLocation({ ...locationCurrent, currentPage: value });
                },
                current: locationCurrent.currentPage
              }
              : false
          }
          size="small"
          dataSource={tasks?.data || []}
          renderItem={(item) => (
            <List.Item
              actions={[<RightOutlined key={'details'} />]}
              onClick={() => {
                navigate(`/${item.propertyId}/${paths.tasks}?bundleId=${item.data.bundleId}`);
              }}
              className={clsx(
                'cursor-pointer',
                selected !== ThemeType.DEFAULT ? 'hover:bg-[#565D67]' : 'hover:bg-slate-200'
              )}
            >
              <Skeleton title={false} loading={loading} active>
                <List.Item.Meta
                  title={item.extendedData?.title?.[currentLanguage] ?? item.data.name}
                  description={dayjs(item.data.validUntil * A_THOUSAND).format(DATE_FORMAT_2)}
                />
                {currentView === ViewMode.Account ? (
                  <TagCustomComponent value={item.propertyId} />
                ) : (
                  ''
                )}
              </Skeleton>
            </List.Item>
          )}
        />
      </Card>
    </Badge.Ribbon>
  );
};

export default TaskList;
