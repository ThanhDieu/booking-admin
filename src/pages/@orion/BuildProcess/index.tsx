import { PlusOutlined } from '@ant-design/icons';
import { App, Badge, Button, List, Space, Typography } from 'antd';
import clsx from 'clsx';
import { ModalConfirmation } from 'components/common';
import { PlainLayout } from 'components/layout';
import { DATE_TIME_FORMAT_1 } from 'configs/const/format';
import { BuildStatus, FuncType, ThemeType } from 'configs/const/general';
import { COPYRIGHT } from 'constant';
import dayjs from 'dayjs';
import { useHelmet } from 'hooks';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { BuildProcessType, StatusTrigger } from 'services/BuildProcess/type';
import { useAppDispatch, useAppSelector } from 'store';
import { getAllBuildThunk, triggerBuildThunk } from 'store/orion/BuildIBE';

const BuildProcess = () => {
  const { t } = useTranslation(['common', 'buildIbe']);
  const { message } = App.useApp();
  const dispatch = useAppDispatch();
  const { selected } = useAppSelector((state) => state.app.theme);
  const { buildList, loading } = useAppSelector((state) => state.orion.buildIbe);
  const [openModal, setOpenModal] = useState<string>('');

  useEffect(() => {
    dispatch(getAllBuildThunk());
  }, []);

  const handelTriggerBuild = () => {
    dispatch(triggerBuildThunk()).then((res) => {
      dispatch(getAllBuildThunk());

      if ((res.payload as StatusTrigger).status === 'true') {
        message.success((res.payload as StatusTrigger).message, 3);
      } else {
        message.error((res.payload as StatusTrigger).message, 3);
      }
    }).catch(() => null);
  };

  const renderListItem = (item: BuildProcessType) => {
    return (
      <Badge.Ribbon
        text={item?.status}
        color={
          item?.status && item?.status?.trim() === BuildStatus.BUILDING
            ? 'gold'
            : item?.status && item?.status?.trim() === BuildStatus.SUCCESS
              ? 'green'
              : 'red'
        }
      >
        <List.Item
          style={{ borderBlockEnd: 'none' }}
          className={clsx(
            selected === ThemeType.DEFAULT
              ? 'border-[rgba(5,5,5,0.06)]'
              : 'border-[rgba(197,193,193,0.57)]',
            'task-list rounded border border-solid  mb-4 last:mb-0'
          )}
        >
          <Space direction="vertical" size={0}>
            <Typography.Text>
              {' '}
              <strong>{t('buildIbe:build_id')}: </strong> {item?.buildId}
            </Typography.Text>
            <Typography.Text>
              <strong>{t('buildIbe:start_at')}: </strong>
              {dayjs(item?.timeStart).format(DATE_TIME_FORMAT_1)}
            </Typography.Text>
          </Space>
        </List.Item>
      </Badge.Ribbon>
    );
  };

  useHelmet({
    title: t('buildIbe:title')
  });

  return (
    <PlainLayout
      headerprops={{
        title: t('buildIbe:title'),
        extra: [
          <Button
            type="primary"
            key="new-user-btn"
            icon={<PlusOutlined />}
            onClick={() => setOpenModal(FuncType.BUILD)}
            disabled={loading}
          >
            {t('common:button.build')}
          </Button>
        ]
      }}
      footerprops={{
        children: COPYRIGHT,
        className: 'text-center'
      }}
      className="bg-inherit overflow-y-scroll"
    >
      <List
        className="max-w-[1300px]"
        size="large"
        pagination={false}
        dataSource={buildList}
        renderItem={(item) => renderListItem(item)}
        loading={loading}
      />
      <ModalConfirmation
        modalOpen={openModal === FuncType.BUILD}
        content={t('common:modal.confirm_content_build')}
        onChangeOpenModal={() => setOpenModal('')}
        callBack={() => {
          handelTriggerBuild();
        }}
      />
    </PlainLayout>
  );
};

export default BuildProcess;
