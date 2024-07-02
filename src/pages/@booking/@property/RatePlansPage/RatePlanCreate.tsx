/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect } from 'react';
import { PlainLayout } from 'components/layout';
import { COPYRIGHT, paths } from 'constant';
import { useNavigate, useParams } from 'react-router-dom';
import { Button, Form, Space } from 'antd';
import { PropertyGeneral } from '../PropertySettingPage/partials';
import { FuncType } from 'configs/const/general';
import {
  CalculationModeSection,
  PolicySection,
  ServicesSection,
  TimeSliceSection,
  DistributionSection,
  BookingChannels
} from './partials';
import { AccountConfig, BookingPeriods } from 'pages/@booking/ServiceListPage/partials';
import useView from 'hooks/useView';
import { displayRole } from 'utils/view';
import { useAsyncAction, useDetailDisplay, useDidMount } from 'hooks';
import { getRatePlanDetailService } from 'services/RatePlan';
import dayjs from 'dayjs';
import { DATE_FORMAT_1 } from 'configs/const/format';

const RatePlanCreate = () => {
  const param = useParams();
  const [form] = Form.useForm();
  const view = displayRole(useView().currentView);
  const navigate = useNavigate();

  /////// Services area ///////
  const [getRatePlanDetail, ratePlanDetailState] = useAsyncAction(getRatePlanDetailService);
  useDidMount((controller) => {
    if (param.id) {
      getRatePlanDetail(param.id, controller?.signal);
    }
  });
  /////// Rate plan detail ///////
  const detailRatePlan: any = useDetailDisplay(ratePlanDetailState);

  /////// Initial form values ///////
  const initFormValue = {
    code: detailRatePlan?.data?.code,
    name: detailRatePlan?.data?.name,
    description: detailRatePlan?.data?.description,
    unitGroup: detailRatePlan?.data?.unitGroup?.name,
    timeSliceDefinition: detailRatePlan?.data?.timeSliceDefinition?.template,
    calculationMode: detailRatePlan?.data?.priceCalculationMode,
    bookingChannels: detailRatePlan?.data?.channelCodes,
    monthMinimum: detailRatePlan?.data?.restrictions?.minAdvance?.months,
    daysMinimum: detailRatePlan?.data?.restrictions?.minAdvance?.days,
    hourMinimum: detailRatePlan?.data?.restrictions?.minAdvance?.hours,
    monthMaximum: detailRatePlan?.data?.restrictions?.maxAdvance?.months,
    daysMaximum: detailRatePlan?.data?.restrictions?.maxAdvance?.days,
    hourMaximum: detailRatePlan?.data?.restrictions?.maxAdvance?.hours,
    valid_from: detailRatePlan?.data?.validFrom
      ? dayjs(Number(detailRatePlan?.data?.validFrom) * 1000)
      : 0,
    cancelationPolicy: detailRatePlan?.data?.cancellationPolicy?.name,
    noshowPolicy: detailRatePlan?.data?.noShowPolicy?.name,
    minimumGuarantee: detailRatePlan?.data?.minGuaranteeType,
    bookingPeriods: detailRatePlan?.data?.ratesRange
      ? [
        dayjs(detailRatePlan?.data?.ratesRange.from, DATE_FORMAT_1),
        dayjs(detailRatePlan?.data?.ratesRange.to, DATE_FORMAT_1)
      ]
      : []
  };

  useEffect(() => {
    detailRatePlan && form.setFieldsValue(initFormValue);
  }, [detailRatePlan]);

  return (
    <PlainLayout
      headerprops={{
        title: detailRatePlan?.name
      }}
      footerprops={{
        children: COPYRIGHT,
        className: 'text-center'
      }}
      className="bg-inherit"
    >
      <Form layout="vertical" initialValues={initFormValue} form={form}>
        <Space direction="vertical" size="large" className="w-full ">
          <PropertyGeneral mode={ratePlanDetailState ? FuncType.UPDATE : FuncType.CREATE} />
          <TimeSliceSection />
          <ServicesSection />
          <PolicySection />
          <AccountConfig />
          <DistributionSection />
          <BookingChannels />
          <BookingPeriods />
          <CalculationModeSection />
          <Space>
            <Button type="primary" htmlType="submit">
              Save
            </Button>
            <Button
              onClick={() =>
                navigate(`/${view.code}/${paths.rates}/${paths.ratePlans}/${paths.list}`)
              }
            >
              Discard
            </Button>
          </Space>
        </Space>
      </Form>
    </PlainLayout>
  );
};

export default RatePlanCreate;
