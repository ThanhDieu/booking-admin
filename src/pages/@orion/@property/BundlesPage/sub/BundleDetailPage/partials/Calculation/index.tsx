/* eslint-disable @typescript-eslint/no-explicit-any */
import { Card, Col, FormInstance, FormListFieldData, Row, Typography } from 'antd';
import useView from 'hooks/useView';
import { useMemo, useState } from 'react';
import { displayRole } from 'utils/view';
import { InitialBundleType } from '../../types';
import PriceAdvisor from './PriceAdvisor';
import ServiceList from './ServicesInclude/ServiceList';
import Summary from './Summary';
import UnitGroupList from './UnitGroupsInclude/UnitGroupList';
import { useTranslation } from 'react-i18next';
import Periods from './Periods';
import { FuncType } from 'configs/const/general';

const { Title } = Typography;

export interface CalculationPartialProps<T = unknown> {
  loading?: boolean;
  variant: 'base' | 'upgrade' | 'services_include';
  pageAction: (typeof FuncType)[keyof typeof FuncType];
  form: FormInstance<InitialBundleType>;
  field?: FormListFieldData;
  fields?: FormListFieldData[];
  watchHook: any[];
  dependence?: any[];
  data: T;
  dataLength?: number;
  onLoadMore?: () => void;
}

export interface CalculationProps {
  pageAction: (typeof FuncType)[keyof typeof FuncType];
  form: FormInstance<InitialBundleType>;
}

function Calculation({ pageAction, form }: CalculationProps) {
  const { t } = useTranslation(['bundles']);
  //* Declare variable global
  const { currentView } = useView();
  const { code: codeProperty } = displayRole(currentView);

  const [selectedPeriod, setSelectedPeriod] = useState<{
    start: number;
    end: number;
  }>();
  //* End declare variable global

  //* Handle interface
  const renderPriceAdvisor = useMemo(() => {
    return pageAction === FuncType.CREATE ? (
      <PriceAdvisor
        form={form}
        pageAction={pageAction}
        period={selectedPeriod}
        code={codeProperty}
      />
    ) : null;
  }, [selectedPeriod]);

  const renderServiceList = useMemo(() => {
    return <ServiceList form={form} pageAction={pageAction} code={codeProperty} />;
  }, []);
  //* End handle interface

  return (
    <Card>
      <Row gutter={24}>
        <Col span={8}>
          <Title level={3} className="inline-block font-medium mb-[8px]">
            {t('bundles:multiple_period')}
          </Title>
        </Col>

        {renderPriceAdvisor}

        <Periods pageAction={pageAction} form={form} onSelectedPeriod={setSelectedPeriod} />

        <UnitGroupList
          category={'base'}
          form={form}
          pageAction={pageAction}
          code={codeProperty}
          period={selectedPeriod}
        />

        {renderServiceList}

        <UnitGroupList
          category={'upgrade'}
          form={form}
          pageAction={pageAction}
          code={codeProperty}
          period={selectedPeriod}
        />

        <Summary form={form} />
      </Row>
    </Card>
  );
}

export default Calculation;
