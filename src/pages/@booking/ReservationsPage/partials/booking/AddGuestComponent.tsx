/* eslint-disable @typescript-eslint/no-explicit-any */
import { CloseOutlined } from '@ant-design/icons';
import { GuestInfo } from '@types';
import { Button, Card, Col, Form, Input, Row, Select, Space, Table, Typography } from 'antd';
import { useForm } from 'antd/es/form/Form';
import { bookerTitleOptions } from 'configs/const/options';
import React, { useEffect, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useAppDispatch, useAppSelector } from 'store';
import { replaceGuest } from 'store/booking/Booking';
import { validateMessages } from 'utils/validationForm';

interface FormProps {
  title: string;
  firstName: string;
  lastName: string;
  email: string;
}
interface Props {
  dataGuest: GuestInfo[];
  setDataGuest?: React.Dispatch<React.SetStateAction<GuestInfo[]>>;
  currentCardRes?: number | undefined;
  isShowResult?: boolean;
  updateGuest?: (payload: any) => void;
}
const AddGuestComponent = ({
  currentCardRes,
  dataGuest,
  setDataGuest,
  isShowResult = false
}: Props) => {
  const { t } = useTranslation(['reservation', 'common']);
  const [form] = useForm();
  const formData: FormProps = Form.useWatch([], form);

  const { reservations, payloadSearch, guests } = useAppSelector((state) => state.booking.booking);
  const dispatch = useAppDispatch();
  const initialForm =
    currentCardRes !== undefined
      ? {
        ...reservations[currentCardRes]?.guests
      }
      : { ...guests[0] };
  const columns: any = [
    {
      title: 'Guest',
      key: 'guest',
      render: (record: GuestInfo) => {
        return (
          <Typography.Text>
            {record?.title ? `${record?.title}.` : ''} {record?.firstName} {record?.lastName}
          </Typography.Text>
        );
      }
    },
    {
      title: 'Email',
      key: 'email',
      dataIndex: 'email'
    },
    {
      title: '',
      key: 'action',
      align: 'right',
      render: (index: any) => {
        return (
          <>
            {!isShowResult && (
              <Button
                type="text"
                icon={<CloseOutlined />}
                onClick={() => {
                  if (!isShowResult) {
                    setDataGuest &&
                      setDataGuest((prevData: any) => {
                        return prevData.toSpliced(index, 1);
                      });
                  }
                }}
              >
                Remove
              </Button>
            )}
          </>
        );
      }
    }
  ];

  const onSubmitForm = (payload: any) => {
    setDataGuest &&
      setDataGuest((prevData) => {
        return [...prevData, payload];
      });
    dispatch(replaceGuest([payload]));

    form.resetFields();
  };
  useEffect(() => {
    if (setDataGuest)
      currentCardRes !== undefined
        ? setDataGuest(reservations[currentCardRes]?.guests ?? [])
        : setDataGuest([]);
  }, []);

  const formatDataGuest = useMemo(() => {
    return dataGuest?.map((item, idx) => {
      return {
        ...item,
        key: idx //create a unique property
      };
    });
  }, [dataGuest]);

  const fieldNotEmpty = useMemo(
    () =>
      formData?.firstName || formData?.lastName || formData?.title || formData?.email
        ? true
        : false,
    [formData]
  );

  return (
    <div className="flex flex-col gap-5 w-full">
      {!isShowResult && dataGuest?.length !== payloadSearch?.adults && (
        <Form
          form={form}
          layout="vertical"
          onFinish={onSubmitForm}
          initialValues={initialForm}
          validateMessages={validateMessages}
        >
          <Space direction="vertical" size={5} className="w-full">
            <Typography.Title level={3}>{t('reservation:guests')}</Typography.Title>
            <Card>
              <Row gutter={24}>
                <Col span={6}>
                  <Form.Item
                    label={t('common:form.title')}
                    name="title"
                    rules={[{ required: fieldNotEmpty }]}
                  >
                    <Select options={bookerTitleOptions} placeholder="Select title" />
                  </Form.Item>
                </Col>
                <Col span={6}>
                  <Form.Item
                    label={t('common:form.first_name')}
                    name="firstName"
                    rules={[{ required: fieldNotEmpty }]}
                  >
                    <Input name="firstName" />
                  </Form.Item>
                </Col>
                <Col span={6}>
                  <Form.Item
                    label={t('common:form.last_name')}
                    name="lastName"
                    rules={[{ required: fieldNotEmpty }]}
                  >
                    <Input name="lastName" />
                  </Form.Item>
                </Col>
              </Row>
              <Row gutter={32} className="flex items-center justify-center">
                <Col span={12}>
                  <Form.Item
                    className="flex-1"
                    label={t('common:form.email')}
                    name="email"
                    rules={[
                      {
                        required: fieldNotEmpty,
                        type: 'email',
                        message: 'The input is not valid E-mail!'
                      }
                    ]}
                  >
                    <Input name="email" />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Button htmlType="submit" type="primary">
                    {t('common:button.submit')}
                  </Button>
                </Col>
              </Row>
            </Card>
          </Space>
        </Form>
      )}

      {formatDataGuest && formatDataGuest?.length > 0 && (
        <Table rowKey="key" columns={columns} dataSource={formatDataGuest} />
      )}
    </div>
  );
};

export default AddGuestComponent;
