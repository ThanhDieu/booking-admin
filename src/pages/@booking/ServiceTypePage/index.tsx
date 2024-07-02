/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { DeleteOutlined, EditOutlined, PlusOutlined } from '@ant-design/icons';
import { App, Button, Popconfirm, Table } from 'antd';
import { ColumnsType } from 'antd/es/table';
import { PlainLayout } from 'components/layout';
import { FuncType } from 'configs/const/general';
import { COPYRIGHT } from 'constant';
import { useAsyncAction, useHelmet } from 'hooks';
import { useDataDisplay } from 'hooks/useDisplay';
import useView from 'hooks/useView';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  createServiceTypeService,
  deleteServiceTypeService,
  getServiceTypesByCodeService,
  updateServiceTypeService
} from 'services/ServiceType';
// import { any } from 'services/ServiceType/type';
import { displayRole } from 'utils/view';

const ServiceTypePage = () => {
  const { t } = useTranslation(['common', 'services'])
  const { currentView } = useView();
  const { code: codeProperty, name: nameProperty } = displayRole(currentView);
  const { message } = App.useApp();

  const [openModal, setOpenModal] = useState<string>('');
  const [currentItem, setCurrentItem] = useState<any>();

  const [fetchServiceTypesByCode, stateServiceTypesByCode] = useAsyncAction(
    getServiceTypesByCodeService
  );

  const [updateServiceType] = useAsyncAction(updateServiceTypeService, {
    onSuccess: () => {
      codeProperty && fetchServiceTypesByCode(codeProperty);
      setOpenModal('');
    },
    onFailed: () => {
      // message.error('Failed!', 2);
    }
  });

  const [createServiceType] = useAsyncAction(createServiceTypeService, {
    onSuccess: () => {
      codeProperty && fetchServiceTypesByCode(codeProperty);
      setOpenModal('');
    },
    onFailed: () => {
      // message.error('Failed!', 2);
    }
  });

  const [deleteServiceType] = useAsyncAction(deleteServiceTypeService, {
    onSuccess: () => {
      codeProperty && fetchServiceTypesByCode(codeProperty);
    },
    onFailed: () => {
      // message.error('Failed!', 2);
    }
  });

  const serviceTypes = useDataDisplay<any>(stateServiceTypesByCode);

  useEffect(() => {
    if (codeProperty) {
      fetchServiceTypesByCode(codeProperty);
    }
  }, [currentView]);

  const column: ColumnsType<any> = [
    {
      title: t('common:table.code'),
      dataIndex: 'code',
      key: 'code'
    },
    {
      title: t('common:table.name'),
      dataIndex: 'name',
      key: 'name',
      render: (_: any, record: any) => <>{record.name}</>
    },
    {
      title: t('common:table.description'),
      dataIndex: 'description',
      key: 'description',
      render: (_: any, record: any) => <>{record.description}</>
    },
    {
      title: t('common:table.action'),
      key: 'action',
      dataIndex: '',
      align: 'right',
      render: (_: any, record: any) => (
        <>
          <Button
            type="text"
            icon={<EditOutlined />}
            onClick={() => {
              setCurrentItem(record);
              setOpenModal(FuncType.UPDATE);
            }}
          />
          <Popconfirm
            title="Sure to delete?"
            onConfirm={() => {
              if (record.id) deleteServiceType(record.id);
              else message.error(t('common:modal.have_something_wrong'), 2);
            }}
          >
            <Button type="text" icon={<DeleteOutlined />} />
          </Popconfirm>
        </>
      )
    }
  ];

  useHelmet({
    title: `${t('services:service_types')} / ${nameProperty}`
  });

  return (
    <>
      <PlainLayout
        headerprops={{
          title: t('services:service_type'),
          extra: [
            <Button
              type="primary"
              key="new-user-btn"
              icon={<PlusOutlined />}
              onClick={() => setOpenModal(FuncType.CREATE)}
            >
              {t('services:new_type')}
            </Button>
          ]
        }}
        footerprops={{
          children: COPYRIGHT,
          className: 'text-center'
        }}
        className="bg-inherit"
      >
        <Table columns={column} dataSource={serviceTypes} rowKey="id" />
      </PlainLayout>

      {/* Update service type modal */}
      {/* {openModal === FuncType.UPDATE && (
        <ModalCreateUpdateAmenities
          openModal={openModal}
          onChangeOpenModal={() => setOpenModal('')}
          handleUpdate={(id, formData) => updateServiceType(id, formData as any)}
          title="Update service type"
          item={currentItem}
          variant="service-type"
        />
      )} */}

      {/* Create service type modal */}
      {/* {openModal === FuncType.CREATE && (
        <ModalCreateUpdateAmenities
          openModal={openModal}
          onChangeOpenModal={() => setOpenModal('')}
          handleCreate={(formData) => createServiceType(formData as any)}
          title="Create service type"
          variant="service-type"
        />
      )} */}
    </>
  );
};

export default ServiceTypePage;
