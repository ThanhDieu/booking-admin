/* eslint-disable @typescript-eslint/no-explicit-any */
import { DeleteOutlined } from '@ant-design/icons';
import { Button, Col, Form, Input, Row, Typography } from 'antd';
import { useWatch } from 'antd/es/form/Form';
import Table, { ColumnsType } from 'antd/es/table';
import { useAsyncAction } from 'hooks';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { checkVoucherService } from 'services/Vouchers';
import { VoucherType } from 'services/Vouchers/type';
import { useAppSelector } from 'store';
import { capitalize } from 'utils/text';

interface Props {
  currentCardRes?: number;
  allVoucherApplied: VoucherType | undefined;
  setAllVoucherApplied: React.Dispatch<React.SetStateAction<VoucherType | undefined>>;
}

const VoucherApplyComponent = ({
  allVoucherApplied,
  setAllVoucherApplied,
  currentCardRes
}: Props) => {
  const { t } = useTranslation(['common', 'reservation']);
  const [form] = Form.useForm();
  const [errorMessage, setErrorMessage] = useState<string>('');

  const { payloadSearch, reservations } = useAppSelector((state) => state.booking.booking);
  const voucherValue = useWatch('voucher', form);

  useEffect(() => {
    const initVoucher =
      currentCardRes !== undefined && reservations.length > 0
        ? reservations[currentCardRes].vouchers
        : undefined;
    initVoucher && setAllVoucherApplied(initVoucher);
  }, []);

  //SERVICE
  const [checkVoucher, chechVoucherState] = useAsyncAction(checkVoucherService, {
    onSuccess: (res: any) => {
      const vouchersValid = res?.data?.data[0];

      setAllVoucherApplied(vouchersValid);
      setErrorMessage('');
      form.resetFields();
    },
    onFailed: (error: any) => {
      if (error) setErrorMessage(error.message);
    }
  });

  const onSubmitForm = (formData: { voucher: string }) => {
    const voucherCode = formData?.voucher?.trim().toUpperCase();
    const isDuplicateVoucher = reservations.some((res) => res.vouchers?.code === voucherCode);
    if (isDuplicateVoucher) {
      setErrorMessage(t('reservation:voucher_applied_error'));
    } else {
      checkVoucher(payloadSearch?.propertyId, voucherCode);
    }
  };

  const columns: ColumnsType<VoucherType> = [
    {
      title: 'Voucher',
      key: 'code',
      dataIndex: 'code'
    },
    {
      title: 'Discount amount',
      key: 'value',
      dataIndex: ['voucherData', 'value']
    },
    {
      key: 'action',
      dataIndex: 'voucherId',
      render: () => (
        <Button
          danger
          type="text"
          icon={<DeleteOutlined />}
          onClick={() => setAllVoucherApplied(undefined)}
        />
      )
    }
  ];

  return (
    <div>
      {errorMessage !== '' && (
        <Typography.Text className=" text-red-500">{capitalize(errorMessage)}</Typography.Text>
      )}
      <div className="flex flex-col">
        <Form form={form} onFinish={onSubmitForm}>
          <Row>
            <Col span={24}>
              <div className="flex ">
                <Form.Item
                  name="voucher"
                  rules={[
                    {
                      pattern: new RegExp(/^(?!_)(?!.*_$)[a-zA-Z0-9_]+$/),
                      message: t('reservation:message_valid_voucher')
                    }
                  ]}
                >
                  <Input
                    disabled={allVoucherApplied !== undefined}
                    className=" w-[550px]"
                    placeholder={t('reservation:voucher_apply_placeholder')}
                  />
                </Form.Item>
                <Button
                  loading={chechVoucherState.loading}
                  type="primary"
                  htmlType="submit"
                  disabled={!voucherValue || voucherValue.trim() === ''}
                >
                  {t('common:button.apply')}
                </Button>
              </div>
            </Col>
          </Row>
        </Form>
        {allVoucherApplied && (
          <div className="w-[600px]">
            <Table
              dataSource={[allVoucherApplied]}
              columns={columns}
              rowKey={'voucherId'}
              pagination={false}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default VoucherApplyComponent;
