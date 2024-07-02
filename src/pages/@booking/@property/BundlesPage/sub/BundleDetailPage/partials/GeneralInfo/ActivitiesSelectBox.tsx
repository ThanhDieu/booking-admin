import { EllipsisOutlined } from '@ant-design/icons';
import { Button, Col, Form, Select, SelectProps } from 'antd';
import { useDidMount } from 'hooks';
import { useMemo, useState } from 'react';
import { useAppDispatch, useAppSelector } from 'store';
import { getActivityList } from 'store/booking/Activity';
import { GeneralInfoPartialProps } from '.';
import { useTranslation } from 'react-i18next';

export default function ActivitiesSelectBox({
  editPermission,
  name = 'activities',
  isMultiple = true
}: GeneralInfoPartialProps) {
  const { t, i18n } = useTranslation(['common', 'bundles']);
  const currentLanguage = i18n.language;

  const dispatch = useAppDispatch();
  const [perPage, setPerPage] = useState(20);

  const handleLoadMore = () => {
    setPerPage(perPage + 20);
  };

  const fetchActivityList = async (perPageVal: number, signal?: AbortSignal) => {
    await dispatch(
      getActivityList({
        query: `perPage=${perPageVal}`,
        signal: signal
      })
    );
  };

  useDidMount(
    (controller) => {
      fetchActivityList(perPage, controller?.signal);
    },
    [perPage]
  );

  const { data: activities, loading } = useAppSelector((state) => state.booking.activity);

  const activityOptions: SelectProps['options'] = useMemo(() => {
    return activities?.data?.map((activity) => ({
      label: activity?.extendedData?.title[currentLanguage] ?? activity.title,
      value: activity.activityId
    }));
  }, [currentLanguage, activities]);

  const renderButtonLoadMore = useMemo(() => {
    if (
      activities?.data &&
      activities?.data?.length &&
      activities?.pagination &&
      activities?.pagination?.total &&
      activities?.pagination?.total - activities?.data?.length > 0
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
  }, [activities]);

  return (
    <Col span={24}>
      <Form.Item
        label={name === 'activities' ? t('bundles:activities') : t('bundles:main_activity')}
        name={name}
        rules={[
          { required: name === 'activities', message: t('common:form.please_enter_this_field') }
        ]}
      >
        <Select
          options={activityOptions}
          mode={isMultiple ? 'multiple' : undefined}
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
