import {
  Button,
  DatePicker,
  Form,
  InputNumber,
  Modal,
  Radio,
  Select,
  Space,
  Switch,
  TimePicker,
  Typography
} from 'antd';
import { FuncType, editModalType } from 'configs/const/general';
import { bookingChannelOptions, guaranteeOptions } from 'configs/const/options';
import { useState } from 'react';
import { PlusOutlined, CloseOutlined } from '@ant-design/icons';

interface Props {
  openModal: string;
  title: string;
  onChangeOpenModal: () => void;
}
const { RangePicker } = DatePicker;

const ModalEditRatePlan = ({ openModal, onChangeOpenModal, title }: Props) => {
  const [openMinimumForm, setOpenMinimumForm] = useState<boolean>(false);
  const [openMaximumForm, setOpenMaximum] = useState<boolean>(false);
  const [openLateBookingForm, setOpenLateBookingForm] = useState<boolean>(false);

  const formSelectRender = (
    label: string,
    name: string,
    options: { label: string; value: string }[]
  ) => {
    return (
      <Form layout="vertical" className="pt-6">
        <Form.Item label={label} name={name} className="text-xs" rules={[{ required: true }]}>
          <Select options={options} />
        </Form.Item>
      </Form>
    );
  };

  const formRestrictionsRender = () => {
    return (
      <Form>
        <Space direction="vertical">
          <Space>
            <Switch onChange={() => setOpenMinimumForm((prev) => !prev)} />
            <Typography.Text>Minimum advanced booking</Typography.Text>
          </Space>
          {openMinimumForm && (
            <Space>
              <Form.Item name="minimumMonths">
                <InputNumber placeholder="Months" />
              </Form.Item>
              <Form.Item name="minimumDays">
                <InputNumber placeholder="Days" />
              </Form.Item>
              <Form.Item name="minimumHours">
                <InputNumber placeholder="Hours" />
              </Form.Item>
            </Space>
          )}
        </Space>
        <Space direction="vertical">
          <Space>
            <Switch onChange={() => setOpenMaximum((prev) => !prev)} />
            <Typography.Text>Maximum advanced booking</Typography.Text>
          </Space>
          {openMaximumForm && (
            <Space>
              <Form.Item name="minimumMonths">
                <InputNumber placeholder="Months" />
              </Form.Item>
              <Form.Item name="minimumDays">
                <InputNumber placeholder="Days" />
              </Form.Item>
              <Form.Item name="minimumHours">
                <InputNumber placeholder="Hours" />
              </Form.Item>
            </Space>
          )}
        </Space>
        <Space direction="vertical">
          <Space>
            <Switch onChange={() => setOpenLateBookingForm((prev) => !prev)} />
            <Typography.Text>Late booking until</Typography.Text>
          </Space>
          {openLateBookingForm && <TimePicker use12Hours format="h:mm a" />}
        </Space>
      </Form>
    );
  };

  const initialPriods = {
    periods: [
      {
        dataPicker: ''
      }
    ]
  };
  const formBookingPeriodsRender = () => {
    return (
      <Form initialValues={initialPriods}>
        <Space direction="vertical">
          <Typography.Text>How would you like to update booking periods?</Typography.Text>
          <Radio.Group>
            <Space direction="vertical">
              <Radio value={1}>Add new periods</Radio>
              <Radio value={2}>Replace all old periods with</Radio>
            </Space>
          </Radio.Group>
          <Form.List name="periods">
            {(fields, { add, remove }) => (
              <>
                {fields.map(({ key, name }) => (
                  <div className="flex" key={key}>
                    <Form.Item name={[name, 'dataPicker']}>
                      <RangePicker />
                    </Form.Item>
                    <Form.Item>
                      <Button type="text" icon={<CloseOutlined />} onClick={() => remove(name)} />
                    </Form.Item>
                  </div>
                ))}
                <Form.Item>
                  <Button type="text" icon={<PlusOutlined />} onClick={() => add()}>
                    Add more
                  </Button>
                </Form.Item>
              </>
            )}
          </Form.List>
        </Space>
      </Form>
    );
  };

  const renderModalContent = (openModal: string) => {
    switch (openModal) {
      case editModalType.RESTRICTION:
        return formRestrictionsRender();
      case editModalType.CANCELLATION:
        return formSelectRender(title, title, [{ label: 'sth', value: 'sth' }]);
      case editModalType.CHANNEL:
        return formSelectRender(title, title, bookingChannelOptions);
      case editModalType.GUARANTEE:
        return formSelectRender(title, title, guaranteeOptions);
      case editModalType.PERIODS:
        return formBookingPeriodsRender();
      case FuncType.DELETE:
        return <Typography.Text>Are you sure you want to delete the rate plan ?</Typography.Text>;
      default:
        return;
    }
  };

  return (
    <Modal
      width={360}
      title={title}
      open={
        openModal === editModalType.RESTRICTION ||
        openModal === editModalType.ACCOUNTING ||
        openModal === editModalType.CANCELLATION ||
        openModal === editModalType.CHANNEL ||
        openModal === editModalType.GUARANTEE ||
        openModal === editModalType.PERIODS ||
        openModal === FuncType.DELETE
      }
      onCancel={onChangeOpenModal}
      footer={
        <>
          {openModal === FuncType.DELETE ? (
            <Button type="primary" onClick={() => onChangeOpenModal()}>
              Yes
            </Button>
          ) : (
            <Button type="primary" onClick={() => onChangeOpenModal()}>
              Update
            </Button>
          )}
          <Button onClick={() => onChangeOpenModal()}>
            {openModal === FuncType.DELETE ? 'No' : 'Cancel'}
          </Button>
        </>
      }
    >
      {renderModalContent(openModal)}
    </Modal>
  );
};

export default ModalEditRatePlan;
