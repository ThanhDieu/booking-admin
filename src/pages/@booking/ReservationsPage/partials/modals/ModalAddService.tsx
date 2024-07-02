/* eslint-disable @typescript-eslint/no-explicit-any */
import { App, Button, Form, InputNumber, Modal, Select, Spin } from 'antd';
import { useForm, useWatch } from 'antd/es/form/Form';
import { DefaultOptionType } from 'antd/es/select';
import { modeList, whenList } from 'configs/const/general';
import { whenOptions } from 'configs/const/select';
import dayjs from 'dayjs';
import { useAsyncAction } from 'hooks';
import { useMemo } from 'react';
import { addServiceReservationService } from 'services/Reservation';
import { ServiceParamsReservationType } from 'services/Reservation/type';
import { ServiceDetailAppType } from 'services/ServiceList/type';
import { removeDuplicateObjects } from 'utils/array';
import { arrayDateInDateRange } from 'utils/dayjs';
import { validateMessages } from 'utils/validationForm';
import { DatePickerWhen } from '..';
import { ModalActionReservationProps } from '../../index.types';
import { DATE_FORMAT_1 } from 'configs/const/format';
import { useTranslation } from 'react-i18next';

export const modeKeys = Object.keys(modeList);

interface Props extends ModalActionReservationProps {
  services?: ServiceDetailAppType[];
  servicesOptions?: DefaultOptionType[];
  rangeAvailableDates?: string[];
}

const ModalAddService: React.FC<Props> = ({
  modalOpen,
  onChangeOpenModal: handleChangeOpenModal,
  onChangeLocation: handleChangeLocation,
  detail,
  servicesOptions,
  services,
  rangeAvailableDates = []
}) => {
  const { t } = useTranslation(['reservation', 'common']);
  const { message } = App.useApp();
  const [form] = useForm();
  const serviceSelected = useWatch('serviceId', form);
  const whenSelected = useWatch('when', form);

  ////////// SERVICES //////////
  const [addServiceReservation, addServiceReservationState] = useAsyncAction(
    addServiceReservationService,
    {
      onSuccess: () => {
        message.success('Update success!', 2);
        handleChangeLocation && handleChangeLocation({});
        handleChangeOpenModal('');
      },
      onFailed: (error: any) => {
        message.error(error?.message || 'Failed!', 10);
      }
    }
  );

  ////////// FUNCTIONS //////////
  const checkModeService = (svDetail: ServiceDetailAppType) => {
    return (
      svDetail.mode?.toLowerCase() === modeKeys[1]?.toLowerCase() ||
      svDetail.mode?.toLowerCase() === modeKeys[2]?.toLowerCase()
    );
  };

  //services
  const handleChangeServiceSelected = (e: string) => {
    const svDetail = services?.find((service) => service.extId === e);
    const serviceInWhen = currentServices?.find((item) => item.service.id === e);
    if (svDetail) {
      form.setFieldsValue({
        count: 1,
        amount: svDetail?.data?.defaultGrossPrice?.amount
      });
      if (checkModeService(svDetail)) {
        form.setFieldsValue({
          when: whenList[1],
          date:
            svDetail.mode?.toLowerCase() === modeKeys[1]?.toLowerCase()
              ? dayjs(detail?.data?.arrival)
              : dayjs(detail?.data?.departure)
        });
      } else if (serviceInWhen?.dates?.length) {
        const days = rangeAvailableDates?.length - (serviceInWhen?.dates?.length || 0);
        if (days === 1) {
          form.setFieldValue('when', whenList[1]);
        } else if (days > 1 && days < rangeAvailableDates?.length) {
          form.setFieldValue('when', whenList[2]);
        }
      } else {
        form.setFieldValue('when', whenList[0]);
      }
    }
  };

  //quantity
  const handleChangeQuantitySelected = (value: any) => {
    form.setFieldValue(
      'amount',
      (value || 1) * (serviceDetail?.data?.defaultGrossPrice?.amount || 0)
    );
  };

  //submit
  const preDateSubmit = (item: string, formData?: any) => ({
    serviceDate: item,
    amount: {
      amount: formData?.amount?.grossAmount || formData?.amount?.amount || formData.amount,
      currency: detail?.data?.totalGrossAmount?.currency || formData?.amount?.currency || 'EUR'
    },
    count: formData?.count || 1
  });
  const preOnSubmit = (formData: any) => {
    const newData: ServiceParamsReservationType = {
      serviceId: formData.serviceId
    };
    if (formData?.when === whenList[2]) {
      const rangeDate = arrayDateInDateRange(
        dayjs(formData?.period[0]).unix() || 0,
        dayjs(formData?.period[1]).unix() || 0,
        true
      ).map((date) => dayjs(date).format(DATE_FORMAT_1));
      newData.dates = rangeDate.map((item) => preDateSubmit(item, formData));
    } else if (formData?.when === whenList[1]) {
      newData.dates = [dayjs(formData?.date).format(DATE_FORMAT_1)].map((item) =>
        preDateSubmit(item, formData)
      );
    } else {
      newData.amount = {
        amount: formData.amount,
        currency: detail?.data?.totalGrossAmount?.currency || 'EUR'
      };
      newData.count = formData?.count || 1;
    }
    return newData;
  };

  const onSave = (formData: any) => {
    const params = preOnSubmit(formData);
    if (dateInService?.dates?.length && params.dates) {
      const currentDates: any = dateInService.dates.map((date) =>
        preDateSubmit(date?.serviceDate, date)
      );

      params.dates = removeDuplicateObjects<any>(
        currentDates
          .map((date: any) => preDateSubmit(date?.serviceDate, date))
          .concat(params.dates),
        'serviceDate'
      );
    }
    if (detail?.extId) addServiceReservation(detail?.extId, params);
  };

  ////////// DATA //////////
  const initFormValue = {
    count: 1
  };
  const currentServices = useMemo(() => {
    return detail?.data?.services || [];
  }, [detail]);

  const dateInService = useMemo(() => {
    const serviceInWhen = currentServices?.find((item) => item.service.id === serviceSelected);

    return {
      isDate: currentServices.map((item) => item?.service?.id).includes(serviceSelected),
      dates: serviceInWhen?.dates
    };
  }, [serviceSelected]);

  const filterWhenOptions = useMemo(() => {
    const newWhen = [...whenOptions];
    if (dateInService?.isDate) {
      const days = rangeAvailableDates?.length - (dateInService?.dates?.length || 0);
      newWhen.splice(0, 1);
      if (days === 1) {
        newWhen.splice(1, 1);
      }
    }
    return newWhen;
  }, [serviceSelected]);
  const serviceDetail = useMemo(
    () => services?.find((service) => service.extId === serviceSelected),
    [serviceSelected]
  );

  return (
    <Modal
      title={t('reservation:add_service')}
      centered
      open={modalOpen}
      footer={null}
      closable={false}
      onCancel={() => handleChangeOpenModal('')}
      maskClosable={serviceSelected || whenSelected ? false : true}
    >
      <Spin spinning={addServiceReservationState?.loading}>
        <Form
          name="basic"
          layout="vertical"
          onFinish={onSave}
          autoComplete="off"
          form={form}
          validateMessages={validateMessages}
          initialValues={initFormValue}
        >
          <Form.Item
            name="serviceId"
            label={t('reservation:select_service')}
            rules={[{ required: true }]}
          >
            <Select
              options={servicesOptions}
              showSearch
              placeholder={t('reservation:select_service')}
              onChange={handleChangeServiceSelected}
            />
          </Form.Item>
          <Form.Item name="when" label={t('reservation:when')} rules={[{ required: true }]}>
            <Select
              options={filterWhenOptions}
              disabled={serviceDetail && checkModeService(serviceDetail)}
            />
          </Form.Item>
          {(whenSelected === whenList[1] || whenSelected === whenList[2]) && (
            <DatePickerWhen
              form={form}
              detail={detail}
              disabled={serviceDetail && checkModeService(serviceDetail)}
              rangeAvailableDates={rangeAvailableDates}
            />
          )}
          <Form.Item name="count" label={t('common:table.quantity')} rules={[{ required: true }]}>
            <InputNumber className="w-full" min={1} onChange={handleChangeQuantitySelected} />
          </Form.Item>
          <Form.Item label={t('common:table.amount')} name="amount" rules={[{ required: true }]}>
            <InputNumber
              addonAfter={detail?.data?.totalGrossAmount?.currency || 'EUR'}
              className="w-full"
              min={0}
            />
          </Form.Item>

          <Form.Item className="flex justify-end mb-0">
            <Button
              type="primary"
              htmlType="submit"
              disabled={addServiceReservationState?.loading}
              className="mr-3"
            >
              {t('common:button.add')}
            </Button>
            <Button
              onClick={() => handleChangeOpenModal('')}
              disabled={addServiceReservationState?.loading}
            >
              {t('common:button.close')}
            </Button>
          </Form.Item>
        </Form>
      </Spin>
    </Modal>
  );
};

export default ModalAddService;
