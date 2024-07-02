/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { EditOutlined, RightOutlined } from '@ant-design/icons';
import { AddressType } from '@types';
import { App, Button, Image, Skeleton, Switch, Table, Tooltip, Typography } from 'antd';
import { ColumnsType } from 'antd/lib/table/interface';
import { PlainLayout } from 'components/layout';
import { ImageDefault } from 'components/shared';
import renderMenuLabel from 'components/shared/i18nextRender';
import { COPYRIGHT, countries, paths } from 'constant';
import { HORIZONTAL_SCROLL } from 'constant/size';
import { useAppSize, useAsyncAction, useDidMount, useHelmet } from 'hooks';
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { apiPropertyUpdateStatusService } from 'services/Properties';
import { PropertyDetailAppType } from 'services/Properties/type';
import { useAppDispatch, useAppSelector } from 'store';
import { updateView } from 'store/booking/Auth';
import { getPropertyList } from 'store/booking/Property';
import { checkDomainUrl, fallbackImageStrapiResolution } from 'utils/media';

const PERPAGE_LOCAL = 20;
const PropertiesPage = () => {
  const { t, i18n } = useTranslation(['common', 'properties', 'sidebar']);
  const dispatch = useAppDispatch();
  const { properties } = useAppSelector((state) => state?.booking?.property);
  const { data: mediaData } = useAppSelector((state) => state.booking.media);
  const { message } = App.useApp();
  const { innerAppHeight } = useAppSize();
  const navigate = useNavigate();
  const currentLanguage = i18n.language;

  const [updateStatus, stateUpdateStatus] = useAsyncAction(apiPropertyUpdateStatusService, {
    onSuccess: () => {
      message.success('Success!', 2);
      dispatch(
        getPropertyList({
          query: 'perPage=50'
        })
      );
    },
    onFailed: () => {
      // message.error('Failed!', 2);
    }
  });
  // DATA
  const listProperty = useMemo(() => {
    if (!properties) return [];
    const res = properties?.data?.length ? properties?.data : [];
    const formatRes = res.map((el: any) => {
      return {
        ...el,
        name: el.name,
        location: `${el?.location?.addressLine1 || el?.location?.addressLine2 || ''} `
      };
    });
    return formatRes;
  }, [properties]);

  const countryOptions = useMemo(() => {
    const countries = listProperty.map((property) => property?.country);
    const uniqueArray = countries.filter((item, index) => {
      return countries.indexOf(item) === index;
    });
    return uniqueArray.map((country) => ({
      text: country,
      value: country
    }));
  }, [listProperty]);

  // UI
  const columns: ColumnsType<PropertyDetailAppType> = [
    // {
    //   title: 'Media',
    //   key: 'media',
    //   dataIndex: 'media',
    //   render: (values: string, item) => {
    //     const foundImage =
    //       values !== undefined ? mediaData?.find((value) => value?.url === values[0]) : undefined;

    //     if (!foundImage) return <ImageDefault />;

    //     return (
    //       <Image
    //         src={`${checkDomainUrl(foundImage?.url)}${foundImage?.formats && Object.keys(foundImage?.formats)?.length
    //           ? fallbackImageStrapiResolution(foundImage?.formats)
    //           : foundImage?.url
    //           }`}
    //         alt={foundImage ? foundImage?.alternativeText : ' '}
    //         width={50}
    //         height={50}
    //         style={{ objectFit: 'cover' }}
    //         preview={false}
    //         placeholder={<Skeleton.Image className="w-full h-full" active></Skeleton.Image>}
    //       />
    //     );
    //   }
    // },
    {
      title: renderMenuLabel('table.code', 'common'),
      dataIndex: 'extId',
      key: 'extId',
      width: '15%',
      sorter: (a: PropertyDetailAppType, b: PropertyDetailAppType) =>
        a?.extId && b.extId ? a.extId.localeCompare(b.extId) : 0
    },
    {
      title: renderMenuLabel('table.property', 'common'),
      dataIndex: ['extendedData', 'name'],
      key: 'name',
      width: '20%',
      render: (name, item) => (
        <Typography.Text>{name[currentLanguage] ?? item?.name ?? ''}</Typography.Text>
      )
      // sorter: (a: PropertyDetailAppType, b: PropertyDetailAppType) =>
      //   a?.name && b.name ? a.name.localeCompare(b.name) : 0
    },
    {
      title: renderMenuLabel('table.address', 'common'),
      dataIndex: ['data', 'location'],
      key: 'location',
      render: (location: AddressType) =>
        location
          ? `${location?.addressLine1}, ${location?.addressLine2 ? `${location?.addressLine2}, ` : ''
          } ${location?.city}, ${countries[location?.countryCode as keyof typeof countries]}`
          : '',
      width: '30%',
      filters: countryOptions,
      onFilter: (value: any, record) => {
        return record.country?.indexOf(value) === 0;
      }
    },
    {
      title: renderMenuLabel('table.status', 'common'),
      dataIndex: ['data', 'status'],
      key: 'status',
      filters: [
        { text: 'Test', value: 'Test' },
        { text: 'Live', value: 'Live' }
      ],
      ellipsis: true,
      onFilter: (value: any, record) => {
        return record.data?.status?.indexOf(value) === 0;
      }
    },
    {
      title: t('common:button.enable'),
      key: 'enable',
      dataIndex: 'disabled',
      render: (disabled, record) => {
        return (
          <Switch
            checked={disabled === false}
            checkedChildren="YES"
            unCheckedChildren="NO"
            onChange={() => {
              record.extId &&
                updateStatus(record.extId, {
                  disabled: !record.disabled
                });
            }}
          />
        );
      }
    },
    {
      title: renderMenuLabel('table.action', 'common'),
      key: 'action',
      dataIndex: '',
      width: '10%',
      align: 'right',
      render: (_, record) =>
        !record?.disabled ? (
          <div className="flex items-center justify-end gap-4">
            <Tooltip title="Setting">
              <Button
                type="text"
                onClick={() => {
                  dispatch(updateView(`${record.name}@${record.extId}`));
                  navigate(`/${record.extId}/${paths.detail}`);
                }}
                className="cursor-pointer text-black "
                icon={<EditOutlined style={{ color: '#1890FF' }} />}
              />
            </Tooltip>
            <Button
              type="text"
              onClick={() => {
                dispatch(updateView(`${record.extId}@${record.name}`));
                navigate(`/${record.extId}/${paths.detail}`);
              }}
              icon={<RightOutlined />}
            />
          </div>
        ) : undefined
    }
  ];

  //LIFE
  useDidMount((controller) => {
    dispatch(
      getPropertyList({
        query: 'perPage=50',
        signal: controller?.signal
      })
    );
  });

  useHelmet({
    title: t('properties:properties_page')
  });
  return (
    <PlainLayout
      headerprops={{
        title: t('sidebar:sidebar.properties')
      }}
      footerprops={{
        children: COPYRIGHT,
        className: 'text-center'
      }}
      className="bg-inherit"
    >
      <Table
        size="middle"
        dataSource={listProperty}
        columns={columns}
        rowKey="extId"
        pagination={
          !properties?.pagination?.total ||
            (properties?.pagination?.total && properties?.pagination?.total < PERPAGE_LOCAL)
            ? false
            : {
              pageSize: PERPAGE_LOCAL,
              total: properties?.pagination?.total ? Number(properties?.pagination.total) : 1,
              showSizeChanger: false
            }
        }
        scroll={{
          y: innerAppHeight - 180,
          x: HORIZONTAL_SCROLL
        }}
        showSorterTooltip={false}
        loading={stateUpdateStatus?.loading}
      />
    </PlainLayout>
  );
};

export default PropertiesPage;
