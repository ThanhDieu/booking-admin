import { EllipsisOutlined } from '@ant-design/icons';
import { Button, Col, Form, Select, SelectProps } from 'antd';
import { useDidMount } from 'hooks';
import { useMemo, useState } from 'react';
import { useAppDispatch, useAppSelector } from 'store';
import { getLandscapeList } from 'store/orion/Landscape';
import { GeneralInfoPartialProps } from '.';
import { useTranslation } from 'react-i18next';

export default function LandscapesSelectBox({ editPermission }: GeneralInfoPartialProps) {
  const { t, i18n } = useTranslation(['common', 'bundles']);
  const currentLanguage = i18n.language;

  const dispatch = useAppDispatch();

  const [perPage, setPerPage] = useState(20);

  const handleLoadMore = () => {
    setPerPage(perPage + 20);
  };

  const fetchLandscapeList = async (perPageVal: number, signal?: AbortSignal) => {
    await dispatch(
      getLandscapeList({
        query: `perPage=${perPageVal}`,
        signal: signal
      })
    );
  };

  useDidMount(
    (controller) => {
      fetchLandscapeList(perPage, controller?.signal);
    },
    [perPage]
  );

  const { data: landscapes, loading } = useAppSelector((state) => state.orion.landscape);

  const landscapeOptions: SelectProps['options'] = useMemo(() => {
    return landscapes?.data?.map((landscape) => ({
      label: landscape?.extendedData?.title[currentLanguage] ?? landscape.title,
      value: landscape.landscapeId
    }));
  }, [landscapes, currentLanguage]);

  const renderButtonLoadMore = useMemo(() => {
    if (
      landscapes?.data &&
      landscapes?.data?.length &&
      landscapes?.pagination &&
      landscapes?.pagination?.total &&
      landscapes?.pagination?.total - landscapes?.data?.length > 0
    ) {
      return (
        <Button
          type="link"
          className="w-full"
          onClick={() => handleLoadMore && handleLoadMore()}
          icon={<EllipsisOutlined />}
        />
      );
    }
  }, [landscapes]);

  return (
    <Col span={24}>
      <Form.Item
        label={t('bundles:landscape')}
        name="landscape"
        rules={[{ required: true, message: t('common:form.please_enter_this_field') }]}
      >
        <Select
          options={landscapeOptions}
          loading={loading}
          showArrow={editPermission}
          open={editPermission}
          dropdownRender={(node) => (
            <>
              {node}
              {renderButtonLoadMore}
            </>
          )}
        />
      </Form.Item>
    </Col>
  );
}
