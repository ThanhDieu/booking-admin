import {
  CheckOutlined,
  CopyOutlined,
  DeleteOutlined,
  EditOutlined,
  StopOutlined,
  RedoOutlined
} from '@ant-design/icons';
import { Button, Popover, Space, Switch, Typography } from 'antd';
import { ModalConfirmation } from 'components/common';
import { DisplayIBEOptions, FuncType, filterBundle } from 'configs/const/general';
import { paths } from 'constant';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { BundleListType } from 'services/Bundle/type';
import { BundleActionsType } from './BundleItem';
import { Icon } from 'components/shared';

const ActionButton = ({
  holidayPackage,
  data,
  onOnline: handleOnline,
  onDuplicate: handleDuplicate,
  onDelete: handleDelete,
  type: currentTypeBundle,
  onHandleDisplay,
  loading,
  handleArchiveItem
}: BundleActionsType<BundleListType>) => {
  const [openModal, setOpenModal] = useState<string>('');
  const navigate = useNavigate();
  const { t } = useTranslation(['common', 'bundles', 'sidebar']);
  const contentPopover = (
    <div className="flex flex-col gap-4">
      <div className="flex gap-3 items-center">
        <Typography.Text className="w-28">{t('bundles:show_on_home_page')}</Typography.Text>
        <Switch
          checked={data?.isHomePage}
          loading={loading}
          checkedChildren="ON"
          unCheckedChildren="OFF"
          size="small"
          onChange={(checked) =>
            onHandleDisplay && onHandleDisplay(checked, DisplayIBEOptions.HOME, data)
          }
        />
      </div>
      <div className="flex gap-3 items-center">
        <Typography.Text className="w-28">{t('bundles:show_on_hotel_page')}</Typography.Text>
        <Switch
          checked={data?.isHotelPage}
          loading={loading}
          checkedChildren="ON"
          unCheckedChildren="OFF"
          size="small"
          onChange={(checked) =>
            onHandleDisplay && onHandleDisplay(checked, DisplayIBEOptions.HOTEL, data)
          }
        />
      </div>
      {data?.mainActivity !== '' && (
        <div className="flex gap-3 items-center">
          <Typography.Text className="w-28">{t('bundles:show_on_topic_page')}</Typography.Text>
          <Switch
            checked={data?.isTopicPage}
            loading={loading}
            checkedChildren="ON"
            unCheckedChildren="OFF"
            size="small"
            onChange={(checked) =>
              onHandleDisplay && onHandleDisplay(checked, DisplayIBEOptions.TOPIC, data)
            }
          />
        </div>
      )}
    </div>
  );

  return (
    <>
      <div className="flex items-center justify-between w-full">
        <Space size={0} className="-ml-3">
          {!holidayPackage &&
          (data?.status === filterBundle.PENDING || data?.status === filterBundle.REJECTED) &&
          !data.disabled ? (
            <Button
              className="px-3 py-1"
              type="text"
              icon={<EditOutlined />}
              onClick={() => navigate(`${data?.bundleId}`)}
            >
              {t('common:button.edit')}
            </Button>
          ) : null}
          {!holidayPackage && data?.status === filterBundle.APPROVED && !data.disabled ? (
            <Button
              className="px-3 py-1"
              type="text"
              icon={data?.online ? <StopOutlined /> : <CheckOutlined />}
              onClick={() => handleOnline && handleOnline(data)}
            >
              {data?.online ? t('common:button.unpublish') : t('common:button.publish')}
            </Button>
          ) : null}
          {!holidayPackage &&
          !data.disabled &&
          data?.status !== filterBundle.REJECTED &&
          currentTypeBundle !== paths.bundlesNewsletter ? (
            <Button
              className="px-3 py-1"
              type="text"
              icon={<CopyOutlined />}
              onClick={() => {
                handleDuplicate &&
                  currentTypeBundle &&
                  handleDuplicate(!(currentTypeBundle !== 'template'), data);
              }}
            >
              {t('common:button.duplicate')}
            </Button>
          ) : null}
          {!holidayPackage && data?.status === filterBundle.EXPIRED ? (
            currentTypeBundle === paths.bundlesArchive ? (
              <Button
                className="px-3 py-1"
                onClick={() => handleArchiveItem(data)}
                type="text"
                icon={<RedoOutlined />}
              >
                {t('common:button.restore')}
              </Button>
            ) : (
              <Button
                className="px-3 py-1"
                onClick={() => handleArchiveItem(data)}
                type="text"
                icon={<Icon name="archive" />}
              >
                {t('sidebar:sidebar.archive')}
              </Button>
            )
          ) : null}
          {!holidayPackage &&
          (data?.status === filterBundle.PENDING || data?.status === filterBundle.REJECTED) ? (
            <Button
              className="px-3 py-1"
              onClick={() => setOpenModal(FuncType.DELETE)}
              type="text"
              icon={<DeleteOutlined />}
            >
              {t('common:button.delete')}
            </Button>
          ) : null}
        </Space>

        {data?.status === filterBundle.APPROVED &&
          data?.online &&
          currentTypeBundle !== paths.bundlesNewsletter && (
            <Space size={0}>
              <Popover placement="left" content={contentPopover} trigger="click" arrow={false}>
                <Button>{t('bundles:pick_ibe_display')}</Button>
              </Popover>
            </Space>
          )}
      </div>

      <ModalConfirmation
        content={`${t('common:modal.confirm_content_remove')} ${openModal}?`}
        onChangeOpenModal={() => setOpenModal('')}
        modalOpen={openModal === FuncType.DELETE || openModal === FuncType.REMOVE}
        callBack={() => {
          if (handleDelete && openModal === FuncType.DELETE) handleDelete(data.bundleId);
        }}
      />
    </>
  );
};

export default ActionButton;
