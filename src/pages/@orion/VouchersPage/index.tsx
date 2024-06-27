/* eslint-disable @typescript-eslint/no-explicit-any */
import { PlusOutlined, StopOutlined } from '@ant-design/icons';
import { App, Button, Modal, Space, Table, TableProps, Tag, Typography } from 'antd';
import { ModalConfirmation, SearchComponent } from 'components/common';
import { PlainLayout } from 'components/layout';
import renderMenuLabel from 'components/shared/i18nextRender';
import { DATE_FORMAT_3 } from 'configs/const/format';
import { FuncType, sorterType, statusVoucher } from 'configs/const/general';
import { voucherStatusFilter } from 'configs/const/options';
import { COPYRIGHT, paths } from 'constant';
import { HORIZONTAL_SCROLL, PERPAGE } from 'constant/size';
import dayjs from 'dayjs';
import { useAppSize, useAsyncAction, useDataDisplayV2, useDidMount, useHelmet } from 'hooks';
import { useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import {
  createVoucherService,
  getVouchersListService,
  setInvalidVoucherService
} from 'services/Vouchers';
import { VoucherCreatePayload, VoucherType } from 'services/Vouchers/type';
import { QueryCaseType, queryCase } from 'utils/queryParams';
import { capitalize } from 'utils/text';
import ModalCreateVoucher from './ModalCreateVoucher';
import { useReactToPrint } from 'react-to-print';

const VouchersPage = () => {
  const { t } = useTranslation(['vouchers', 'common', 'offer']);
  const { message } = App.useApp();

  const printComponentRef = useRef(null);
  const handlePrint = useReactToPrint({
    content: () => printComponentRef.current,
    documentTitle: t('vouchers:your_voucher_code'),
    onAfterPrint: () => {
      message.info(t('vouchers:printed'), 2);
      handleCopyVoucher();
    }
  });

  const navigate = useNavigate();
  const [locationCurrent, setLocationCurrent] = useState<QueryCaseType>({
    currentPage: 1,
    perPage: PERPAGE
  });
  const { innerAppHeight } = useAppSize();

  const [openModal, setOpenModal] = useState<string>('');
  const [currentVoucher, setCurrentVoucher] = useState<string>('');

  //SERVICE
  const [getListVouchers, listVouchersState] = useAsyncAction(getVouchersListService);

  const [createVoucher, createVoucherState] = useAsyncAction(createVoucherService, {
    onSuccess: (res: any) => {
      const voucher = res?.data?.data[0]?.code;
      setCurrentVoucher(voucher);
      setOpenModal(FuncType.READ);
      handleChangeLocation({});
    },
    onFailed: (error: any) => {
      if (error) message.error(error.message, 2);
    }
  });

  const [changeVoucherToInvalid, setInvalidStatus] = useAsyncAction(setInvalidVoucherService, {
    onSuccess: () => {
      handleChangeLocation({});
    },
    onFailed: (error: any) => {
      if (error) message.error(error.message, 2);
    }
  });

  //PAGINATION
  const handleChangeLocation = (
    {
      currentPage = locationCurrent.currentPage,
      perPage = locationCurrent.perPage,
      sorts = locationCurrent.sorts,
      status = locationCurrent.status,
      search = locationCurrent.search
    }: QueryCaseType,
    controller?: AbortController
  ) => {
    const query = queryCase({
      currentPage,
      perPage,
      status,
      sorts,
      search
    });
    getListVouchers(query, controller?.signal);

    navigate(`/${paths.vouchers}?${query}`);
    setLocationCurrent({
      ...locationCurrent,
      currentPage,
      status,
      sorts,
      search
    });
  };

  const handleChangeTable: TableProps<VoucherType>['onChange'] = (
    pagination,
    filters,
    sorter: any
  ) => {
    const filterValue = filters.status?.length ? String(filters.status[0]) : '';
    const sortOrder = sorter?.order
      ? sorter?.order === sorterType.ASC
        ? sorter.columnKey
        : `-${sorter?.columnKey}`
      : '';
    handleChangeLocation &&
      handleChangeLocation({
        ...locationCurrent,
        currentPage: pagination.current,
        sorts: sortOrder,
        status: filterValue
      });
  };

  const handleCreateVoucher = (formData: VoucherCreatePayload) => {
    const payload = {
      ...formData,
      value: Math.round(formData?.value ?? 0),
      hotel: 'XXX'
    };
    createVoucher(payload);
    setOpenModal('');
  };

  const vouchersList = useDataDisplayV2<VoucherType>(listVouchersState);

  const columns = [
    {
      title: renderMenuLabel('table.code', 'common'),
      key: 'code',
      dataIndex: 'code',
      width: '30%'
    },
    {
      title: renderMenuLabel('table.email', 'common'),
      key: 'email',
      dataIndex: ['voucherData', 'email'],
      width: '15%'
    },
    {
      title: renderMenuLabel('table.name', 'common'),
      key: 'name',
      dataIndex: ['voucherData', 'name'],
      width: '15%'
    },
    {
      title: renderMenuLabel('table.properties', 'common'),
      key: 'hotel',
      dataIndex: ['voucherData', 'hotel'],
      render: (hotel: string) => (
        <Typography.Text>{hotel.toLowerCase() === 'xxx' ? t('vouchers:all_hotels') : hotel}</Typography.Text>
      )
    },
    {
      title: renderMenuLabel('table.valid_to', 'common'),
      key: 'validity',
      dataIndex: ['voucherData', 'validity'],
      render: (date: number) => (
        <Typography.Text>{dayjs(date * 1000).format(DATE_FORMAT_3)}</Typography.Text>
      )
    },
    {
      title: renderMenuLabel('table.status', 'common'),
      key: 'status',
      dataIndex: ['status'],
      filters: voucherStatusFilter,
      filterMultiple: false,
      filteredValue: locationCurrent?.status ? [locationCurrent?.status] : [],
      render: (status: string) => (
        <Tag
          color={
            status === statusVoucher.VALID
              ? 'success'
              : status === statusVoucher.PENDING
              ? 'processing'
              : 'error'
          }
        >
          {status === 'isUsed' ? 'Used' : capitalize(status)}
        </Tag>
      )
    },
    {
      title: renderMenuLabel('button.invalid', 'common'),
      key: 'action',
      dataIndex: ['status'],
      render: (status: string, record: VoucherType) =>
        status !== statusVoucher.INVALID && (
          <Button
            type="text"
            icon={<StopOutlined />}
            onClick={() => {
              setOpenModal(FuncType.INVALID);
              setCurrentVoucher(record.voucherId);
            }}
          />
        )
    }
  ];

  useDidMount((controller) => {
    handleChangeLocation({}, controller);
  });

  useHelmet({
    title: t('vouchers:vouchers_page')
  });
  const handleCopyVoucher = () => {
    navigator.clipboard?.writeText(currentVoucher || '');
    message.info(t('vouchers:copied'), 2);
    setOpenModal('');
  };

  const handleSearch = (value: string) => {
    handleChangeLocation({
      currentPage: 1,
      search: value?.trim()
    });
  };

  return (
    <PlainLayout
      headerprops={{
        title: (
          <SearchComponent
            placeholderC={t('vouchers:search_placeholder')}
            onChange={handleSearch}
            allowClear
          />
        ),
        extra: [
          <Button
            loading={createVoucherState.loading}
            type="primary"
            key="new-user-btn"
            icon={<PlusOutlined />}
            onClick={() => {
              setOpenModal(FuncType.CREATE);
            }}
          >
            {t('common:button.new_pageName', { pageName: 'Voucher' })}
          </Button>
        ]
      }}
      footerprops={{
        children: COPYRIGHT,
        className: 'text-center'
      }}
      className="bg-inherit overflow-hidden"
    >
      <Table
        rowKey="code"
        loading={listVouchersState.loading || setInvalidStatus.loading}
        columns={columns}
        dataSource={vouchersList.list}
        onChange={handleChangeTable}
        pagination={
          !vouchersList?.pagination?.total ||
          (vouchersList?.pagination?.total && vouchersList?.pagination?.total <= PERPAGE)
            ? false
            : {
                pageSize: PERPAGE,
                total: vouchersList?.pagination?.total ? Number(vouchersList?.pagination.total) : 1,
                showSizeChanger: false,
                onChange: (value) => {
                  handleChangeLocation &&
                    handleChangeLocation({ ...locationCurrent, currentPage: value });
                }
              }
        }
        scroll={{
          y: innerAppHeight - 200,
          x: HORIZONTAL_SCROLL
        }}
      />

      {openModal === FuncType.CREATE && (
        <ModalCreateVoucher
          openModal={openModal}
          onChangeModal={() => setOpenModal('')}
          onSubmitForm={handleCreateVoucher}
        />
      )}

      {openModal === FuncType.READ && (
        <Modal
          open={openModal === FuncType.READ}
          maskClosable={false}
          onCancel={() => setOpenModal('')}
          footer={false}
          centered
          width={600}
        >
          <div className="flex flex-col p-5">
            <div className="my-6" ref={printComponentRef}>
              <div>
                <Typography.Text>
                  {t('vouchers:your_voucher_code')}:
                  <br /> <span className="font-bold text-xl">{currentVoucher}</span>{' '}
                </Typography.Text>
              </div>
              <div>
                <Typography.Text>{t('vouchers:please_copy_voucher')}</Typography.Text>
              </div>
            </div>
            <div className="flex justify-end">
              <Space className="ml-5">
                <Button onClick={handlePrint}>{t('offer:print')}</Button>
                <Button type="primary" onClick={handleCopyVoucher}>
                  {t('vouchers:close_and_copy')}
                </Button>
              </Space>
            </div>
          </div>
        </Modal>
      )}
      {openModal === FuncType.INVALID && (
        <ModalConfirmation
          modalOpen={openModal === FuncType.INVALID}
          callBack={() => changeVoucherToInvalid(currentVoucher)}
          content={t('vouchers:confirm_invalid')}
          onChangeOpenModal={() => setOpenModal('')}
        />
      )}
    </PlainLayout>
  );
};

export default VouchersPage;
