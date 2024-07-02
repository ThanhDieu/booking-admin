import { EllipsisOutlined } from '@ant-design/icons';
import { Button, Col, Form, Select, SelectProps } from 'antd';
import { useDidMount } from 'hooks';
import { useMemo, useState } from 'react';
import { useAppDispatch, useAppSelector } from 'store';
import { getTagList } from 'store/booking/Tag';
import { queryCase } from 'utils/queryParams';
import { GeneralInfoPartialProps } from '.';
import { useTranslation } from 'react-i18next';

export default function TagsSelectBox({ code = '', editPermission }: GeneralInfoPartialProps) {
  const { t, i18n } = useTranslation(['bundles']);
  const currentLanguage = i18n.language;

  const dispatch = useAppDispatch();

  const [perPage, setPerPage] = useState(20);

  const handleLoadMore = () => {
    setPerPage(perPage + 20);
  };

  const fetchTagList = async (perPageVal: number, signal?: AbortSignal) => {
    await dispatch(
      getTagList({
        query: queryCase({ type: 'bundles', propertyId: code, perPage: perPageVal }),
        signal: signal
      })
    );
  };

  useDidMount(
    (controller) => {
      fetchTagList(perPage, controller?.signal);
    },
    [perPage]
  );

  const { data: tags, loading } = useAppSelector((state) => state.booking.tag);

  const renderButtonLoadMore = useMemo(() => {
    if (
      tags?.data &&
      tags?.data?.length &&
      tags?.pagination &&
      tags?.pagination?.total &&
      tags?.pagination?.total - tags?.data?.length > 0
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
  }, [tags]);

  const tagOptions: SelectProps['options'] = useMemo(() => {
    return tags?.data?.map((tag) => ({
      label: tag?.extendedData?.title[currentLanguage] ?? tag.title,
      value: tag?.tagId,
      disabled: !tag.status
    }));
  }, [tags, currentLanguage]);

  return (
    <Col span={24}>
      <Form.Item label={t('bundles:tags')} name="tags">
        <Select
          options={tagOptions}
          mode="multiple"
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
