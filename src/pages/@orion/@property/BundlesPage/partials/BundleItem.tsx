/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  AppstoreAddOutlined,
  CalendarOutlined,
  MoreOutlined,
  UserOutlined
} from '@ant-design/icons';
import {
  Checkbox,
  Dropdown,
  Form,
  Image,
  List,
  MenuProps,
  Popover,
  Skeleton,
  Space,
  Tag,
  Typography,
  theme
} from 'antd';
import { DATE_FORMAT_3 } from 'configs/const/format';
import { ThemeType, filterBundle } from 'configs/const/general';
import { paths } from 'constant';
import dayjs from 'dayjs';
import React, { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ReactMarkdown } from 'react-markdown/lib/react-markdown';
import { useNavigate } from 'react-router-dom';
import rehypeRaw from 'rehype-raw';
import rehypeSanitize from 'rehype-sanitize';
import { MediaStrapiType } from 'services/@strapi/type';
import { BundleListType } from 'services/Bundle/type';
import { useAppSelector } from 'store';
import { checkDomainUrl, fallbackImageStrapiResolution } from 'utils/media';
import ActionButton from './ActionButton';
import ModalAddMorePeriod from './ModalAddMorePeriod';

const { useToken } = theme;
const { Paragraph } = Typography;

export interface BundleActionsType<T> {
  holidayPackage: boolean;
  data: T;
  type: string;
  onDelete?: (id: string) => void;
  onDuplicate?: (checked: boolean, item?: T) => void;
  onAddMorePeriod?: (
    id: string,
    formData: {
      start: number;
      end: number;
    }[]
  ) => void;
  onOnline?: (item: T) => void;
  onRemove?: (ids: string[]) => void;
  onHandleDisplay?: (checked: boolean, option: string, item: BundleListType) => void;
  loading?: boolean;
  handleArchiveItem: (item: BundleListType) => void;
}

interface BundleItemProps extends BundleActionsType<BundleListType> {
  image?: MediaStrapiType;
}

export type MorePeriodType = { id: string; periods: [][] };

const BundleItem = ({
  holidayPackage,
  type: currentTypeBundle,
  data,
  image,
  onDelete: handleDelete,
  onDuplicate: handleDuplicate,
  onAddMorePeriod: handleAddMorePeriod,
  onOnline: handleOnline,
  onHandleDisplay,
  loading,
  handleArchiveItem
}: BundleItemProps) => {
  //* Declare variable global
  const { token } = useToken();
  const navigate = useNavigate();
  const [form] = Form.useForm<MorePeriodType>();
  const [periodModal, setPeriodModal] = useState<boolean>(false);
  const { t, i18n } = useTranslation(['common', 'bundle']);
  const currentLanguage = i18n.language;

  const { selected } = useAppSelector((state) => state.app.theme);

  //* End declare variable global

  //* Handle api service
  // Action

  //* End Handle api service

  //* Handle interface
  const handleSubmitModal = (formData: MorePeriodType) => {
    const { id, periods } = formData;
    const periodMapped = periods?.map((period: []) => {
      const formatted = period?.map((item) => dayjs(item).unix().toString());
      return {
        start: Number(formatted[0]),
        end: Number(formatted[1])
      };
    });

    handleAddMorePeriod && handleAddMorePeriod(id, periodMapped);
    setPeriodModal(false);
  };

  // Action dropdown
  const actionItems: MenuProps['items'] = [
    {
      label: t('common:button.add_more_period'),
      key: 'add-more-period',
      icon: <AppstoreAddOutlined />,
      onClick: () => {
        setPeriodModal(true);
        form.setFieldValue('id', data?.bundleId);
      },
      disabled: !data?.isTemplate,
      className: currentTypeBundle === 'template' ? '' : 'hidden'
    }
  ];

  const renderTag = useMemo(() => {
    let color = 'green';
    let statusTranslate = '';

    if (data?.status === filterBundle.REJECTED) {
      color = 'red';
      statusTranslate = t('bundles:rejected');
    }
    if (data?.status === filterBundle.PENDING) {
      color = 'blue';
      statusTranslate = t('bundles:pending');
    }
    if (data?.status === filterBundle.EXPIRED) {
      color = 'gold';
      statusTranslate = t('bundles:expired');
    }
    if (data?.status === filterBundle.APPROVED && data?.online)
      statusTranslate = t('bundles:published');
    if (data?.status === filterBundle.APPROVED && !data?.online)
      statusTranslate = t('bundles:unpublished');
    if (data.disabled) statusTranslate = t('bundles:invalid');

    return (
      <Space size={0}>
        {data.status === filterBundle.APPROVED ? (
          <Tag color={color} className="ml-2">
            {statusTranslate}
          </Tag>
        ) : data.status === filterBundle.REJECTED && data?.extendedData?.rejectedTask ? (
          <Popover
            title="Task rejected: "
            content={
              <div className="flex flex-col gap-2">
                <Typography.Text>{data?.extendedData?.rejectedTask}</Typography.Text>
              </div>
            }
          >
            <Tag color={color} className="ml-2">
              {statusTranslate}
            </Tag>
          </Popover>
        ) : (
          <Tag color={color} className="ml-2">
            {statusTranslate}
          </Tag>
        )}

        {data.disabled ? (
          <Tag color={'red'} className="">
            {statusTranslate}
          </Tag>
        ) : null}
      </Space>
    );
  }, [data, currentLanguage]);

  return (
    <>
      <List.Item
        style={{
          backgroundColor: selected === ThemeType?.DEFAULT ? token.colorWhite : token.colorBgLayout
        }}
        key={data?.bundleId}
        actions={
          currentTypeBundle === 'template'
            ? [
                <Dropdown
                  key={`dropdown-${data.bundleId}`}
                  placement="bottomRight"
                  menu={{ items: actionItems }}
                  trigger={['click']}
                  dropdownRender={(menu) => (
                    <div
                      style={{
                        backgroundColor: token.colorBgElevated,
                        borderRadius: token.borderRadiusLG,
                        boxShadow: token.boxShadowSecondary
                      }}
                    >
                      {React.cloneElement(menu as React.ReactElement, {
                        style: {
                          boxShadow: 'none'
                        }
                      })}
                    </div>
                  )}
                >
                  <MoreOutlined className="text-xl text-black" />
                </Dropdown>
              ]
            : undefined
        }
      >
        <div className="flex flex-col gap-3 w-full">
          <List.Item.Meta
            avatar={
              <Image
                width={109}
                className="object-top aspect-square object-cover"
                src={
                  image?.url
                    ? `${checkDomainUrl(image.url)}${
                        image?.formats && Object.keys(image?.formats)?.length
                          ? fallbackImageStrapiResolution(image?.formats)
                          : image?.url
                      }`
                    : '/no-image.png'
                }
                placeholder={<Skeleton.Image className="w-full h-full" active></Skeleton.Image>}
              />
            }
            title={
              <div className="flex justify-between pl-1">
                <div>
                  {data.disabled ? (
                    <Typography.Text>
                      {data?.extendedData?.title[currentLanguage] ?? data?.name}
                    </Typography.Text>
                  ) : (
                    <Typography.Link
                      onClick={() => {
                        if (!holidayPackage) navigate(`${data?.bundleId}`);
                        else {
                          const { property, isTemplate } = data;
                          navigate(
                            `/${property.extId}/${paths.bundles}/${
                              isTemplate ? paths.bundlesTemplate : paths.bundlesOverview
                            }/${data?.bundleId}`
                          );
                        }
                      }}
                    >
                      {data?.extendedData?.title[currentLanguage] ?? data?.name}
                    </Typography.Link>
                  )}{' '}
                  {!holidayPackage ? renderTag : null}
                </div>
                <Space wrap>
                  <div>
                    <CalendarOutlined />{' '}
                    {data?.periods?.length > 0 && (
                      <Popover
                        title="Periods"
                        content={
                          <div className="flex flex-col gap-2">
                            {data?.periods?.map((period, idx) => (
                              <Typography.Text key={idx}>
                                {`${dayjs(period?.start * 1000).format(DATE_FORMAT_3)}`} -{' '}
                                {`${dayjs(period?.end * 1000).format(DATE_FORMAT_3)}`}{' '}
                              </Typography.Text>
                            ))}
                          </div>
                        }
                      >
                        <Typography.Text className="font-light text-sm">
                          {`${dayjs(data?.periods[0]?.start * 1000).format(DATE_FORMAT_3)}`}-
                          {`${dayjs(data?.periods[0]?.end * 1000).format(DATE_FORMAT_3)}`}{' '}
                          {data?.periods?.length > 1 ? '...' : ''}
                        </Typography.Text>
                      </Popover>
                    )}
                  </div>
                  <div>
                    <UserOutlined />
                    <Typography.Text className="font-light text-sm">
                      {data?.createdBy}
                    </Typography.Text>
                  </div>
                </Space>
              </div>
            }
            description={
              <div className="w-full flex  justify-between">
                <div className=" min-h-[84px] flex flex-col justify-between pl-1 flex-1">
                  <Paragraph ellipsis={{ rows: holidayPackage ? 3 : 2 }} className={'mb-2'}>
                    <ReactMarkdown rehypePlugins={[rehypeRaw, rehypeSanitize]}>
                      {data?.extendedData?.description[currentLanguage] ??
                        (data?.description as any) ??
                        ''}
                    </ReactMarkdown>
                  </Paragraph>
                  <ActionButton
                    loading={loading}
                    holidayPackage={holidayPackage}
                    type={currentTypeBundle}
                    data={data}
                    onOnline={handleOnline}
                    onDuplicate={handleDuplicate}
                    onDelete={handleDelete}
                    onHandleDisplay={onHandleDisplay}
                    handleArchiveItem={handleArchiveItem}
                  />
                </div>
                {holidayPackage ? (
                  <div className="w-4 flex self-center">
                    <Checkbox key={`checkbox-${data.bundleId}`} value={data.bundleId} />
                  </div>
                ) : null}
              </div>
            }
          />
        </div>
      </List.Item>

      {periodModal && (
        <ModalAddMorePeriod
          open={periodModal}
          form={form}
          onCancel={() => setPeriodModal(false)}
          onSubmit={handleSubmitModal}
          initialValue={{ id: '', periods: [[]] }}
        />
      )}
    </>
  );
};

export default BundleItem;
