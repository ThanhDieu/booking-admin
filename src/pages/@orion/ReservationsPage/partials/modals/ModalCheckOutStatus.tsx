/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { App, Button, Modal, Radio, RadioChangeEvent, Space, Spin, Typography } from 'antd';
import { paths } from 'constant';
import dayjs from 'dayjs';
import isSameOrAfter from 'dayjs/plugin/isSameOrAfter';
import { useAsyncAction } from 'hooks';
import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { actionReservationCheckoutService } from 'services/Reservation';
import { ReservationDetailAppType } from 'services/Reservation/type';
import { QueryCaseType } from 'utils/queryParams';
import { ModalActionReservationProps } from '../../index.types';
import { statusReservationType } from 'configs/const/general';
import { DATE_FORMAT_1 } from 'configs/const/format';
dayjs.extend(isSameOrAfter);

interface Props extends ModalActionReservationProps {
  onUpdate?: () => void;
}
const IndexModal: React.FC<Props> = ({
  onChangeOpenModal,
  modalOpen,
  detail,
  onChangeLocation: handleChangeLocation
}) => {
  const [value, setValue] = useState(0);
  const navigate = useNavigate();
  const { message } = App.useApp();

  //SERVICES
  const [actionReservationCheckout, stateActionReservationCheckout] = useAsyncAction(
    actionReservationCheckoutService,
    {
      onSuccess: () => {
        message.success('Check out success!', 2);
        onChangeOpenModal('');
        handleChangeLocation && handleChangeLocation({});
      },
      onFailed: (error: any) => {
        message.error(error?.message, 2);
      }
    }
  );

  // FUNCTIONS
  const handleCheckout = () => {
    detail?.extId && actionReservationCheckout(detail.extId);
  };

  const checkTime = useMemo(() => {
    return (
      detail?.departureTimestamp &&
      dayjs().isSameOrAfter(dayjs(Number(detail?.departureTimestamp) * 1000))
    );
  }, [detail]);

  const onChange = (e: RadioChangeEvent) => {
    setValue(e.target.value);
  };

  const renderShortenStayContent = () => (
    <>
      <Typography.Text>
        This reservation&lsquo;s departure date is in the future. If you want to check out the
        guest, shorten the stay first.
      </Typography.Text>
      <div className="flex justify-end gap-3 mt-3">
        <Button
          type="primary"
          disabled={stateActionReservationCheckout?.loading}
          onClick={() =>
            detail?.extId &&
            navigate(
              `/${detail?.data?.property?.code}/${paths.reservations}/${detail.extId}/${paths.travelDates}`
            )
          }
        >
          Shorten Stay
        </Button>
        <Button
          disabled={stateActionReservationCheckout?.loading}
          onClick={() => onChangeOpenModal('')}
        >
          Cancel
        </Button>
      </div>
    </>
  );

  const renderFiliosContent = () => (
    <Space direction="vertical">
      <Typography.Text>
        This reservation&lsquo;s departure date is in the future. If you want to check out the
        guest, the room will be freed up immediately. Alternatively, you can close the folio and
        create the invoice now, and check out on the departure day.
      </Typography.Text>
      <Radio.Group onChange={onChange} value={value}>
        <Space direction="vertical">
          <Radio value={1}>Free the room and check out</Radio>
          {/* <Radio value={2}>Create invoice</Radio> */}
        </Space>
      </Radio.Group>
      <div className="flex justify-end gap-3 mt-3">
        <Button type="primary" disabled={!value} onClick={handleCheckout}>
          Submit
        </Button>
        <Button
          disabled={stateActionReservationCheckout?.loading}
          onClick={() => onChangeOpenModal('')}
        >
          Cancel
        </Button>
      </div>
    </Space>
  );

  const rederBalanceContent = () => (
    <>
      <Typography.Text>
        The reservation has a open balance of{' '}
        <strong>
          {detail?.data?.balance?.amount || ''} {detail?.data?.balance?.currency || ''}
        </strong>{' '}
      </Typography.Text>
      <br />
      <Typography.Text>
        Are you sure you want to free up the room and check out the guest with an open balance?
      </Typography.Text>

      <div className="flex justify-end gap-3 mt-3">
        <Button
          type="primary"
          disabled={stateActionReservationCheckout?.loading}
          onClick={() => onChangeOpenModal('')}
        >
          No, do not check out
        </Button>
        <Button disabled={stateActionReservationCheckout?.loading} onClick={handleCheckout}>
          Yes, check out with open balance
        </Button>
      </div>
    </>
  );

  const renderContent = () => {
    const isCheckDateEnd = dayjs(dayjs().format(DATE_FORMAT_1)).isBefore(
      dayjs(dayjs(detail?.data?.departure).format(DATE_FORMAT_1))
    );

    if (detail?.data?.status === statusReservationType.InHouse && isCheckDateEnd) {
      if (
        dayjs(dayjs(detail?.data?.departure).format(DATE_FORMAT_1)).diff(
          dayjs().format(DATE_FORMAT_1),
          'day'
        ) <= 1
      )
        return renderFiliosContent();
      return renderShortenStayContent();
    }
    return rederBalanceContent();
  };

  return (
    <Modal
      title={`Check out`}
      centered
      open={modalOpen}
      footer={null}
      closable={false}
      onCancel={() => onChangeOpenModal('')}
      maskClosable={false}
    >
      <Spin spinning={stateActionReservationCheckout.loading}>{renderContent()}</Spin>
    </Modal>
  );
};
export default IndexModal;
