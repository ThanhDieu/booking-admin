/* eslint-disable @typescript-eslint/no-explicit-any */
import { BaseType } from '@types';
import { Alert, App, Button, Form, Modal, Select, SelectProps, Spin, Typography } from 'antd';
import { useForm, useWatch } from 'antd/es/form/Form';
import { whenList } from 'configs/const/general';
import { whenOptions } from 'configs/const/select';
import dayjs, { Dayjs } from 'dayjs';
import isSameOrAfter from 'dayjs/plugin/isSameOrAfter';
import isSameOrBefore from 'dayjs/plugin/isSameOrBefore';
import { useAsyncAction, useDataDisplay, useDidMount } from 'hooks';
import useView from 'hooks/useView';
import { useEffect, useMemo, useState } from 'react';
import {
  assignUnitReservationService,
  getAvailabilityUnitsByReservationService
} from 'services/Reservation';
import { getUnitGroupsByPropertyServiceV2 } from 'services/UnitGroups';
import { UnitGroupDetailAppType } from 'services/UnitGroups/type';
import { UnitResAppType } from 'services/Units/type';
import { removeDuplicateObjects } from 'utils/array';
import {
  formatDefaultSelected,
  formatSelectOption,
  formatValueOption,
  revertValueOption
} from 'utils/format';
import { QueryCaseType, queryCase } from 'utils/queryParams';
import { validateMessages } from 'utils/validationForm';
import { DateTimeSeparate } from '..';
import { ModalActionReservationProps } from '../../index.types';
import { DATE_FORMAT_1 } from 'configs/const/format';
import { useTranslation } from 'react-i18next';

dayjs.extend(isSameOrBefore);
dayjs.extend(isSameOrAfter);
type FormType = {
  unitGroupId: string[];
  unitId: string;
  from: any;
  to: any;
};
const PERIOD = ['from', 'to'];

const IndexModal: React.FC<ModalActionReservationProps> = ({
  onChangeOpenModal: handleChangeOpenModal,
  modalOpen,
  detail,
  onChangeLocation: handleChangeLocation
}) => {
  const { t } = useTranslation(['reservation', 'common']);
  const { currentViewObj } = useView();
  const { code: codeProperty } = currentViewObj;
  const [showError, setShowError] = useState<string>('loading');

  const [form] = useForm();
  const unitGroupsSelected = useWatch('unitGroupId', form);
  const unitSelected = useWatch('unitId', form);
  const whenSelected = useWatch('when', form);
  const fromSelected = useWatch('from', form);
  const toSelected = useWatch('to', form);
  const { message } = App.useApp();

  // SERVICES
  const [fetchUnitGroupsByProperty, stateUnitGroupsByProperty] = useAsyncAction(
    getUnitGroupsByPropertyServiceV2
  );
  const [getUnitList, stateUnitList] = useAsyncAction(getAvailabilityUnitsByReservationService);

  const [assignUnitReservation, assignUnitReservationState] = useAsyncAction(
    assignUnitReservationService,
    {
      onSuccess: () => {
        message.success('Update success!', 2);
        handleChangeLocation && handleChangeLocation({});
        handleChangeOpenModal('');
        setShowError('');
      },
      onFailed: (error: any) => {
        setShowError(error.message);
      }
    }
  );

  // DATA
  const unitGroupsPropertyAppList =
    useDataDisplay<UnitGroupDetailAppType>(stateUnitGroupsByProperty);

  const unitGroupsOption: SelectProps['options'] = useMemo(
    () =>
      formatSelectOption<UnitGroupDetailAppType>(unitGroupsPropertyAppList || [], 'name', 'extId'),
    [unitGroupsPropertyAppList]
  );

  const unitList = useMemo(() => {
    if (stateUnitList?.data) setShowError('');
    if (stateUnitList?.data?.status !== 200) return undefined;
    if (detail?.data?.unit) {
      return removeDuplicateObjects<UnitResAppType>(
        [detail?.data?.unit, ...((stateUnitList?.data?.data as any)?.units as any)],
        'id'
      );
    }
    return (stateUnitList?.data?.data as any)?.units;
  }, [stateUnitList?.data?.data]);

  // FUNCTIONS
  const onSave = (formData: FormType) => {
    const payload = {
      start: dayjs(formData.from || detail?.data?.arrival).unix(),
      end: dayjs(formData.to || detail?.data?.departure).unix()
    };
    detail?.extId &&
      assignUnitReservation(detail?.extId, revertValueOption(formData.unitId)?.value, payload);
  };

  const callbackUnitList = (valueGroupIds: string[], from?: any, to?: any) => {
    const query: QueryCaseType = {
      perPage: 100,
      includeOutOfService: 'true',
    };
    if (valueGroupIds?.length === 1) query.unitGroupId = revertValueOption(valueGroupIds[0])?.value;
    if (!from) {
      from = dayjs(dayjs(detail?.data?.arrival).format(DATE_FORMAT_1)).unix();
    } else {
      from = dayjs(dayjs(from).format(DATE_FORMAT_1)).unix();
    }
    if (!to) {
      to = dayjs(dayjs(detail?.data?.departure).format(DATE_FORMAT_1)).unix();
    } else {
      to = dayjs(dayjs(to).format(DATE_FORMAT_1)).unix();
    }
    if (from && to && from < to) {
      query.from = `${from}`;
      query.to = `${to}`;
    }
    if (codeProperty) {
      query.propertyId = codeProperty
    }

    if (detail?.extId) {
      getUnitList(detail.extId, queryCase(query));
    }
  };

  const handleDateChange = (current: Dayjs | null, type: string) => {
    if (type === PERIOD[0]) {
      callbackUnitList(unitGroupsSelected, current, toSelected);
    } else {
      callbackUnitList(unitGroupsSelected, fromSelected, current);
    }
  };

  const handleChangeSelected = (valueGroupIds: string[]) => {
    callbackUnitList(valueGroupIds, fromSelected, toSelected);
    form.setFieldValue('unitId', null);
    setShowError('');
  };

  const handleWhenChange = (value: string) => {
    if (value === whenList[2]) {
      form.setFieldsValue({
        from: dayjs(dayjs(detail?.data?.arrival).format(DATE_FORMAT_1), DATE_FORMAT_1),
        to: dayjs(dayjs(detail?.data?.departure).format(DATE_FORMAT_1), DATE_FORMAT_1)
      });
    }
  };

  // LIFE
  useDidMount((controller) => {
    const query = queryCase({ propertyId: codeProperty, perPage: 20 });
    fetchUnitGroupsByProperty(query, controller?.signal);
  });

  useEffect(() => {
    if (detail?.data) {
      const unitGroups = detail?.data?.unitGroup
        ? [formatValueOption<BaseType>(detail.data.unitGroup, 'name', 'id') as string]
        : [];
      form.setFieldsValue({
        unitGroupId: unitGroups,
        when: whenList[0]
      });
      callbackUnitList(unitGroups);
      if (detail?.data?.unit) {
        form.setFieldsValue({
          unitId:
            detail?.data?.unit && formatDefaultSelected<BaseType>(detail?.data?.unit, 'name', 'id')
        });
      }
    }
  }, [detail?.data]);

  return (
    <Modal
      title={t('reservation:assign_a_unit_to_the_reservation')}
      centered
      open={modalOpen}
      footer={null}
      closable={false}
      onCancel={() => handleChangeOpenModal('')}
      maskClosable={false}
    >
      <Spin
        spinning={
          assignUnitReservationState?.loading ||
          stateUnitGroupsByProperty?.loading ||
          showError === 'loading'
        }
      >
        <Form
          name="basic"
          layout="vertical"
          onFinish={onSave}
          autoComplete="off"
          form={form}
          validateMessages={validateMessages}
        >
          <Form.Item label="">
            <Typography.Text className="ant-form-text">
              {detail?.data?.unit?.name
                ? t('reservation:currently_assigned')
                : t('reservation:currently_no_unit_is_assigned')}{' '}
              <strong>{detail?.data?.unit?.name || ''}</strong>{' '}
            </Typography.Text>
          </Form.Item>
          {dayjs(dayjs(detail?.data?.departure).format(DATE_FORMAT_1)).diff(
            dayjs(detail?.data?.arrival).format(DATE_FORMAT_1),
            'day'
          ) > 1 ? (
            <>
              <Form.Item name="when" label={t('reservation:when')} rules={[{ required: true }]}>
                <Select options={[whenOptions[0], whenOptions[2]]} onChange={handleWhenChange} />
              </Form.Item>
              {whenSelected === whenList[2] && (
                <DateTimeSeparate
                  inputs={[
                    { name: PERIOD[0], required: false },
                    { name: PERIOD[1], required: false }
                  ]}
                  onChange={handleDateChange}
                  detail={{
                    from: detail?.data?.arrival || 0,
                    to: detail?.data?.departure || 0
                  }}
                  watchHook={{ fromSelected, toSelected }}
                />
              )}
            </>
          ) : (
            ''
          )}

          <Form.Item
            name={'unitGroupId'}
            label={t('reservation:filter_by_unit_group')}
            rules={[{ required: true }]}
          >
            <Select
              options={unitGroupsOption}
              showSearch
              mode="multiple"
              onChange={(value) => handleChangeSelected(value)}
            />
          </Form.Item>
          {unitList?.length || (unitList?.length === 0 && !unitGroupsSelected) ? (
            <Form.Item
              name={'unitId'}
              label={t('reservation:unit_to_assign')}
              rules={[{ required: true }]}
            >
              <Select
                options={unitList?.length ? formatSelectOption(unitList, 'name', 'id') : []}
                showSearch
                onChange={() => {
                  setShowError('');
                }}
              />
            </Form.Item>
          ) : (
            ''
          )}

          {unitList && unitList.length === 0 && unitGroupsSelected ? (
            <Alert
              description={t('reservation:alert_no_unit')}
              type="warning"
              showIcon
              className="p-2 mb-3"
            />
          ) : (
            ''
          )}

          {showError && showError !== 'loading' ? (
            <Alert type="error" message={showError} banner className="mb-3" />
          ) : (
            ''
          )}

          <Form.Item className="flex justify-end mb-0">
            <Button
              type="primary"
              htmlType="submit"
              disabled={
                assignUnitReservationState?.loading || !unitSelected || stateUnitList?.loading
              }
              className="mr-3"
            >
              {t('common:button.save')}
            </Button>
            <Button
              onClick={() => handleChangeOpenModal('')}
              disabled={assignUnitReservationState?.loading}
            >
              {t('common:button.close')}
            </Button>
          </Form.Item>
        </Form>
      </Spin>
    </Modal>
  );
};
export default IndexModal;
