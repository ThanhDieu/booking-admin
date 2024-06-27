/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  CopyOutlined,
  DeleteOutlined,
  EditOutlined,
  MailOutlined,
  RightOutlined
} from '@ant-design/icons';
import {
  App,
  Button,
  Form,
  Popconfirm,
  Space,
  Switch,
  Table,
  Tag,
  Tooltip,
  Typography
} from 'antd';
import { TableProps } from 'antd/es/table';
import { GuestSummaryComponent, ModalConfirmation } from 'components/common';
import GuestInfoComponent from 'components/common/GuestInfoComponent';
import ModalSendMail from 'components/common/modal/ModalSendMail';
import { DATE_FORMAT_3 } from 'configs/const/format';
import { FuncType, StatusOffer, sorterType } from 'configs/const/general';
import { paths } from 'constant';
import { PERPAGE } from 'constant/size';
import dayjs from 'dayjs';
import { useAsyncAction } from 'hooks';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { deleteOfferService, duplicateOfferService, updateOfferService } from 'services/Offer';
import { OfferDetailType } from 'services/Offer/type';
import { MailType } from 'services/SendMail/type';
import { useAppDispatch } from 'store';
import { triggerSendCampaignThunk } from 'store/orion/Mailchimp';
import { contendMailOfferFormat } from 'utils/contentMailFormat';
import { currencyFormatter } from 'utils/currency';
import { QueryCaseType } from 'utils/queryParams';
import { capitalize } from 'utils/text';
import EditableCell from './EditableCellOffer';

interface Props {
  locationCurrent: QueryCaseType;
  handleChangeLocation: ({
    propertyId,
    currentPage,
    perPage,
    sorts,
    status
  }: QueryCaseType) => void;
  offerList: {
    list: never[] | OfferDetailType[];
    pagination: PaginationType | undefined;
  };
  loading?: boolean;
}
export const statusColor = (status: string) => {
  const color: { [key: string]: string } = {
    created: 'cyan',
    submitted: 'purple',
    pending: 'blue',
    booked: 'green',
    expired: 'red',
    disabled: 'gold'
  };
  const tagColor = color[status];
  return tagColor;
};

const TableOffer = ({ locationCurrent, handleChangeLocation, offerList, loading }: Props) => {
  const { t } = useTranslation(['common', 'offer', 'reservation']);
  const { message } = App.useApp();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const [form] = Form.useForm();

  const [modalOpen, setModalOpen] = useState<string>('');
  const [currentOffer, setCurrentOffer] = useState<OfferDetailType>();

  const [editingKey, setEditingKey] = useState('');
  const isEditing = (record: OfferDetailType) => record.offerId === editingKey;

  const edit = (record: OfferDetailType) => {
    form.setFieldsValue({
      ...record,
      validity: dayjs(dayjs(Number(record?.validity || 0) * 1000), DATE_FORMAT_3)
    });
    setCurrentOffer(record);
    setEditingKey(record?.offerId ?? '');
  };

  const save = async (offerId: string) => {
    try {
      const row = (await form.validateFields()) as OfferDetailType;
      const payload = row.validity;
      updateOffer(offerId, {
        validity: dayjs(payload.toString()).unix(),
        status: currentOffer?.status ?? '',
        disabled: currentOffer?.disabled ?? false
      });
    } catch (errInfo) {
      message.error(`Validate Failed: ${errInfo}`, 2);
    }
  };

  //SERVICE
  const [updateOffer, stateUpdateOffer] = useAsyncAction(updateOfferService, {
    onSuccess: () => {
      handleChangeLocation({});
      setEditingKey('');
      message.success('Success!', 2);
    },
    onFailed: () => {
      // message.error('Failed!', 2);
    }
  });

  const [deleteOffer, stateDeleteOffer] = useAsyncAction(deleteOfferService, {
    onSuccess: () => {
      handleChangeLocation({});
      message.success('Success!', 2);
    },
    onFailed: () => {
      // message.error('Failed!', 2);
    }
  });
  const [duplicateOffer, stateDuplicateOffer] = useAsyncAction(duplicateOfferService, {
    onSuccess: () => {
      handleChangeLocation({});
      message.success('Success!', 2);
    },
    onFailed: () => {
      // message.error('Failed!', 2);
    }
  });

  // FUNCTIONS
  const handleChangeTable: TableProps<OfferDetailType>['onChange'] = (
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

  const handleSendMail = (campaignId: string, content: string) => {
    const payload = {
      campaignId,
      html: content,
      mailType: MailType.offer,
      guestMail: currentOffer?.booker.email
    };
    dispatch(triggerSendCampaignThunk({ formData: payload }));
    if (currentOffer?.status === StatusOffer.created && currentOffer.disabled !== undefined)
      updateOffer(currentOffer.offerId, {
        status: StatusOffer.submitted,
        validity: currentOffer.validity,
        disabled: currentOffer.disabled
      });
    setModalOpen('');
  };

  //COLUMNS
  const columns: any = [
    {
      title: t('common:table.status'),
      dataIndex: ['status'],
      key: 'status',
      width: '10%',
      editable: false,
      filters: Object.values(StatusOffer).map((item) => ({
        text: item ? capitalize(item) : '',
        value: item
      })),
      render: (status: string) => {
        return <Tag color={statusColor(status)}>{capitalize(status)}</Tag>;
      }
    },
    {
      title: t('common:general.id'),
      dataIndex: ['offerId'],
      key: 'id',
      editable: false
    },
    {
      title: t('common:table.name'),
      dataIndex: ['name'],
      key: 'name',
      editable: false
    },
    {
      title: t('offer:validity'),
      dataIndex: ['validity'],
      sorter: true,
      key: 'validity',
      editable: true,
      render: (validity: number, record: OfferDetailType) => (
        <>
          <Typography.Text>{dayjs(validity * 1000).format(DATE_FORMAT_3)}</Typography.Text>
          {!record?.disabled && (
            <Button
              type="link"
              icon={<EditOutlined />}
              disabled={editingKey !== ''}
              onClick={() => edit(record)}
            />
          )}
        </>
      )
    },
    {
      title: t('common:table.price'),
      dataIndex: ['price'],
      key: 'price',
      editable: false,
      render: (price: number, record: OfferDetailType) => (
        <Typography.Text className="ml-auto">
          {currencyFormatter(price - (record?.discount ?? 0), record?.property?.currency ?? 'EUR')}{' '}
          {record?.property?.currency ?? 'EUR'}
        </Typography.Text>
      )
    },
    {
      title: t('common:button.enable'),
      key: 'enable',
      dataIndex: 'disabled',
      editable: false,
      render: (disabled: boolean, record: OfferDetailType) => {
        return (
          <Switch
            checked={disabled === false}
            checkedChildren="YES"
            unCheckedChildren="NO"
            onChange={() => {
              updateOffer(record.offerId, {
                status: record.status,
                validity: record.validity,
                disabled: !record.disabled
              });
            }}
          />
        );
      }
    },
    {
      title: '',
      align: 'right',
      key: 'action',
      width: '10%',
      render: (_: any, record: OfferDetailType) => {
        const editable = isEditing(record);
        return editable ? (
          <span className="flex gap-2 justify-start">
            <Button onClick={() => save(record?.offerId ?? '')} type="primary">
              {t('common:button.save')}
            </Button>
            <Popconfirm title="Sure to cancel?" onConfirm={() => setEditingKey('')}>
              <Button> {t('common:button.cancel')}</Button>
            </Popconfirm>
          </span>
        ) : (
          <Space>
            {' '}
            {(record.status === StatusOffer.created ||
              record.status === StatusOffer.submitted ||
              record.status === StatusOffer.pending) &&
              !record.disabled && (
                <Tooltip title={t('offer:send_mail')} arrow={false}>
                  <Button
                    type="link"
                    icon={<MailOutlined />}
                    onClick={() => {
                      setCurrentOffer(record);
                      setModalOpen(FuncType.SEND_MAIL);
                    }}
                  />{' '}
                </Tooltip>
              )}
            <Tooltip title={t('common:button.duplicate')} arrow={false}>
              <Button
                type="link"
                icon={<CopyOutlined />}
                onClick={() => {
                  duplicateOffer(record?.offerId);
                }}
              />{' '}
            </Tooltip>
            <Button
              type="text"
              icon={<DeleteOutlined />}
              danger
              onClick={() => {
                setCurrentOffer(record);
                setModalOpen(FuncType.DELETE);
              }}
            />
            <Button
              type="text"
              icon={<RightOutlined />}
              onClick={() => {
                navigate(`/${paths.offer}/${record.offerId}`);
              }}
            />
          </Space>
        );
      }
    }
  ];

  const guestInfo_col_2 = (record: OfferDetailType) => [
    {
      title: capitalize(t('common:table.created')),
      content: dayjs(record?.createdAt * 1000).format(DATE_FORMAT_3)
    },
    {
      title: capitalize(t('common:table.arrival')),
      content: dayjs(record.arrival * 1000).format(DATE_FORMAT_3)
    },
    {
      title: capitalize(t('common:table.departure')),
      content: dayjs(record?.departure * 1000).format(DATE_FORMAT_3)
    }
  ];

  const expandedRowRender = (record: OfferDetailType) => {
    return (
      <div className="flex gap-12 ml-14 ">
        <div className="flex flex-col">
          <GuestSummaryComponent isOffer guest={record?.booker} />
        </div>
        <div className="flex flex-col">
          <GuestInfoComponent isOffer items={guestInfo_col_2(record)} />
        </div>
      </div>
    );
  };

  const mergedColumns = columns.map((col: any) => {
    if (!col.editable) {
      return col;
    }
    return {
      ...col,
      onCell: (record: OfferDetailType) => ({
        record,
        dataIndex: col.dataIndex,
        title: col.title,
        editing: isEditing(record)
      })
    };
  });

  return (
    <>
      <Form form={form} component={false}>
        <Table
          columns={mergedColumns}
          dataSource={offerList.list}
          components={{
            body: {
              cell: EditableCell
            }
          }}
          loading={
            loading ||
            stateUpdateOffer.loading ||
            stateDeleteOffer.loading ||
            stateDuplicateOffer.loading
          }
          rowKey="offerId"
          childrenColumnName="antdChildren"
          onChange={handleChangeTable}
          pagination={
            !offerList?.pagination?.total ||
            (offerList?.pagination?.total && offerList?.pagination?.total < PERPAGE)
              ? false
              : {
                  pageSize: PERPAGE,
                  total: offerList?.pagination?.total ? Number(offerList?.pagination.total) : 1,
                  showSizeChanger: false,
                  onChange: (value) => {
                    handleChangeLocation &&
                      handleChangeLocation({ ...locationCurrent, currentPage: value });
                  }
                }
          }
          expandable={{
            // expandRowByClick: true,
            expandedRowRender: (record) => expandedRowRender(record)
          }}
        />
      </Form>

      {modalOpen === FuncType.SEND_MAIL ? (
        <ModalSendMail
          modalOpen={modalOpen === FuncType.SEND_MAIL}
          handleChangeOpenModal={() => setModalOpen('')}
          onSubmit={handleSendMail}
          contentData={contendMailOfferFormat(currentOffer)}
        />
      ) : (
        modalOpen === FuncType.SEND_MAIL && message.info(t('offer:no_campaign_notice'))
      )}
      {modalOpen === FuncType.DELETE && (
        <ModalConfirmation
          modalOpen={modalOpen === FuncType.DELETE}
          content={t('common:modal.confirm_content_delete')}
          onChangeOpenModal={() => setModalOpen('')}
          callBack={() => deleteOffer(currentOffer?.offerId ?? '')}
        />
      )}
    </>
  );
};

export default TableOffer;
