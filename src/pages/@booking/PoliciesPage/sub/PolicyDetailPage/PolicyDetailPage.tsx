/* eslint-disable @typescript-eslint/no-unused-vars */
import { Button, Col, Form, Input, Row, Space, Typography } from 'antd';
import { GeneralFormComponent } from 'components/common';
import { PlainLayout } from 'components/layout';
import { policyType } from 'configs/const/general';
import { vatOptions } from 'configs/const/select';
import { paths } from 'constant';
import { useAsyncAction, useDidMount, useHelmet } from 'hooks';
import { useDataDisplayV2, useDetailDisplay } from 'hooks/useDisplay';
import useView from 'hooks/useView';
import { useEffect } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { getCancellationDetailService, getNoShowDetailService } from 'services/Policies';
import { CancellationPolicyAppType, NoShowPolicyAppType } from 'services/Policies/type';
import { getServicesByPropertyService } from 'services/ServiceList';
import { ServiceDetailAppType, ServiceType } from 'services/ServiceList/type';
import { formatSelectOption } from 'utils/format';
import { CancellationPeriod, PolicyAmount } from '../../partials';
import { useTranslation } from 'react-i18next';

const { Title } = Typography;

const PolicyPage = () => {
  const { t } = useTranslation(['common, policies'])
  const policyCode = useParams().id;
  const policyCurrentType = useLocation().pathname.split('/')[3];
  const { currentViewObj } = useView();
  const navigate = useNavigate();
  const [form] = Form.useForm();

  //SERVICE
  const [getCancellationDetail, stateCancellationDetail] = useAsyncAction(
    getCancellationDetailService
  );
  const [getNoShowDetail, stateNoShowDetail] = useAsyncAction(getNoShowDetailService);
  const [getServiceList, stateServiceList] = useAsyncAction(getServicesByPropertyService);

  const servicesList = useDataDisplayV2<ServiceDetailAppType>(stateServiceList);
  const cancellationDetail = useDetailDisplay<CancellationPolicyAppType>(stateCancellationDetail);
  const noShowDetail = useDetailDisplay<NoShowPolicyAppType>(stateNoShowDetail);

  useDidMount((controller) => {
    currentViewObj?.code && getServiceList(currentViewObj?.code);
    policyCode &&
      (policyCurrentType === policyType.CANCELLATION
        ? getCancellationDetail(policyCode, controller?.signal)
        : getNoShowDetail(policyCode, controller?.signal));
  });

  const serviceOptions = formatSelectOption(servicesList.list, 'name', 'extId', '@');

  // Form handle
  const initialValue = {
    vat_type: vatOptions[vatOptions.length - 1].value
  };

  const initialUpdateForm = {
    ...initialValue,
    code: (cancellationDetail || noShowDetail)?.data?.code,
    name: (cancellationDetail || noShowDetail)?.data?.name,
    description: (cancellationDetail || noShowDetail)?.data?.description,
    months: cancellationDetail?.data?.periodFromReference?.months,
    days: cancellationDetail?.data?.periodFromReference?.days,
    hours: cancellationDetail?.data?.periodFromReference?.hours,
    reference: cancellationDetail?.data?.reference,

    amount: (cancellationDetail || noShowDetail)?.data?.fee?.fixedValue?.amount,
    percent: (cancellationDetail || noShowDetail)?.data?.fee?.percentValue?.percent,
    limit: (cancellationDetail || noShowDetail)?.data?.fee?.percentValue?.limit,
    vatType: (cancellationDetail || noShowDetail)?.data?.fee?.vatType
  };

  useEffect(() => {
    if (!policyCode) {
      form.setFieldsValue(initialValue);
    } else form.setFieldsValue(initialUpdateForm);
  }, [initialUpdateForm]);

  useHelmet({
    title: `${!policyCode ? t('common:button.create') : policyCode} / ${t('policies:button.create')} / ${currentViewObj.code}`
  });

  return (
    <PlainLayout
      headerprops={{
        title: `${!policyCode ? t('common:button.create') : t('common:button.edit')} ${t('policies:policy').toLowerCase()}`
      }}
      className={`bg-inherit`}
    >
      <div className="flex flex-col gap-1 mb-4">
        <Title style={{ margin: 0 }}>Policy {`${policyCode ? `- ${policyCode}` : ''}`}</Title>
      </div>
      <Form layout="vertical" form={form}>
        <Row gutter={[24, 24]}>
          <Col span={2}>
            <Form.Item label={t('common:table.code')} name="code" rules={[{ required: true }]}>
              <Input disabled={policyCode !== undefined} />
            </Form.Item>
          </Col>
        </Row>
        <GeneralFormComponent status={policyCode ? ['name', 'description'] : []} />
        <Row gutter={24}>
          {policyCurrentType === policyType.CANCELLATION ? <CancellationPeriod /> : null}
        </Row>
        <PolicyAmount
          dataDetail={cancellationDetail || noShowDetail}
          serviceOptions={serviceOptions}
        />
        <Space>
          <Button type="primary" htmlType="submit" disabled>
            {t('common:button.save')}
          </Button>
          <Button
            type="default"
            onClick={() => {
              navigate(`/${currentViewObj.code}/${paths.policies}/${policyCurrentType}`);
            }}
          >
            {t('common:button.close')}
          </Button>
        </Space>
      </Form>
    </PlainLayout>
  );
};

export default PolicyPage;
