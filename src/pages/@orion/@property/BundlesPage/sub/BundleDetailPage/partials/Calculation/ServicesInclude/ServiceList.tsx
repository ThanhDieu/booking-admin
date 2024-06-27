import { MinusCircleOutlined, PlusOutlined } from '@ant-design/icons';
import { Button, Col, Form, FormInstance, FormListFieldData, Typography } from 'antd';
import clsx from 'clsx';
import { FuncType } from 'configs/const/general';
import { useAsyncAction, useDataDisplayV2, useDidMount } from 'hooks';
import { useState } from 'react';
import { getServicesByPropertyServiceV2 } from 'services/ServiceList';
import { ServiceDetailAppType } from 'services/ServiceList/type';
import { queryCase } from 'utils/queryParams';
import { InitialBundleType } from '../../../types';
import ServiceItem from './ServiceItem';
import { useTranslation } from 'react-i18next';

const { Title } = Typography;

export interface ServiceListProps {
  pageAction: (typeof FuncType)[keyof typeof FuncType];
  code?: string;
  form: FormInstance<InitialBundleType>;
}

export default function ServiceList({ pageAction, code = '', form }: ServiceListProps) {
  const { t } = useTranslation(['bundles']);
  const [perPage, setPerPage] = useState(20);
  const servicesIncludeWatcher = Form.useWatch('services_include', form);

  //* Handle api service
  // Action
  /**
   * @param propertyId
   */
  const [fetchServices, stateServices] = useAsyncAction(getServicesByPropertyServiceV2);

  // Data
  const services = useDataDisplayV2<ServiceDetailAppType>(stateServices);

  const handleLoadMore = () => {
    setPerPage(perPage + 20);
  };

  // Call
  useDidMount(
    (controller) => {
      const query = queryCase({
        propertyId: code,
        perPage: perPage
      });
      code && fetchServices(query, controller?.signal);
    },
    [perPage]
  );

  //* End Handle api service

  return (
    <>
      <Col span={24}>
        <Title level={3} className="inline-block font-medium mb-[8px]">
          {t('bundles:services')}
        </Title>
      </Col>
      <Form.List name={'services_include'}>
        {(fields, { add, remove }) => (
          <>
            {fields?.map((field: FormListFieldData) => {
              return (
                <div
                  key={field.name}
                  className={clsx('w-full flex services-include mb-6')}
                >
                  <ServiceItem
                    variant="services_include"
                    loading={stateServices.loading}
                    pageAction={pageAction}
                    form={form}
                    field={field}
                    watchHook={[servicesIncludeWatcher]}
                    data={services?.list}
                    dataLength={services?.pagination?.total}
                    onLoadMore={handleLoadMore}
                  />

                  {pageAction !== FuncType.UPDATE && fields?.length > 1 ? (
                    <Col style={field.name > 0 ? {maxHeight: "30px"} : undefined}>
                      <MinusCircleOutlined
                        className="absolute left-0 top-1/2 -translate-y-1/2"
                        onClick={() => {
                          remove(field.name);
                        }}
                      />
                    </Col>
                  ) : null}
                </div>
              );
            })}

            {pageAction !== FuncType.UPDATE ? (
              servicesIncludeWatcher?.length !== services?.pagination?.total ? (
                <div className="w-full">
                  <Col span={8}>
                    <Form.Item>
                      <Button
                        type="dashed"
                        onClick={() => add({ standard: 0, overwrite: 0, discount: 0, price: 0 })}
                        block
                        icon={<PlusOutlined />}
                      >
                        {t('bundles:add_service')}
                      </Button>
                    </Form.Item>
                  </Col>
                </div>
              ) : null
            ) : null}
          </>
        )}
      </Form.List>
    </>
  );
}
