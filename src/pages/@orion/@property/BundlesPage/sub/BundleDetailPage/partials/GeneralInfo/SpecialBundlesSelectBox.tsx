import { EllipsisOutlined } from '@ant-design/icons';
import { Button, Col, Form, Select, SelectProps } from 'antd';
import { useDidMount } from 'hooks';
import { useMemo, useState } from 'react';
import { useAppDispatch, useAppSelector } from 'store';
import { getSpecialBundleListThunk } from 'store/orion/SpecialBundle';
import { GeneralInfoPartialProps } from '.';
import { useTranslation } from 'react-i18next';

export default function SpecialBundlesSelectBox({ editPermission }: GeneralInfoPartialProps) {
  const { t } = useTranslation(['bundles']);
  const dispatch = useAppDispatch();

  const [perPage, setPerPage] = useState(20);

  const handleLoadMore = () => {
    setPerPage(perPage + 20);
  };

  const fetchSpecialBundleList = async (perPageVal: number, signal?: AbortSignal) => {
    await dispatch(
      getSpecialBundleListThunk({
        query: `perPage=${perPageVal}`,
        signal: signal
      })
    );
  };

  useDidMount(
    (controller) => {
      fetchSpecialBundleList(perPage, controller?.signal);
    },
    [perPage]
  );

  const { data: specialBundle, loading } = useAppSelector((state) => state.orion.specialBundle);

  const specialBundleOptions: SelectProps['options'] = specialBundle?.data?.map(
    (specialBundle) => ({
      label: specialBundle.title,
      value: specialBundle.specialBundleId
    })
  );

  const renderButtonLoadMore = useMemo(() => {
    if (
      specialBundle?.data &&
      specialBundle?.data?.length &&
      specialBundle?.pagination &&
      specialBundle?.pagination?.total &&
      specialBundle?.pagination?.total - specialBundle?.data?.length > 0
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
  }, [specialBundle]);

  return (
    <Col span={24}>
      <Form.Item label={t('bundles:special_bundle')} name="special_bundles">
        <Select
          options={specialBundleOptions}
          loading={loading}
          removeIcon={editPermission}
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
