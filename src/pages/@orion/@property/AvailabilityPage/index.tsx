/* eslint-disable @typescript-eslint/no-explicit-any */
import { useAsyncAction, useDataDisplayV2, useDidMount } from 'hooks';
import useView from 'hooks/useView';
import React, { useEffect, useMemo, useState } from 'react';
import { getAllAvailabilityUnitGroups } from 'services/Availability';
import { QueryCaseType, queryCase } from 'utils/queryParams';
import TableUnitAvailability from './partials/TableUnitAvailability';
import dayjs from 'dayjs';
import DatePickerComponent from 'components/common/DatePickerComponent';
import { PlainLayout } from 'components/layout';
import { COPYRIGHT } from 'constant';
import { convertTimeToSecTimestamp } from 'utils/dayjs';
import { AllUnitGroupsAvailabilityType } from 'services/Availability/type';
import { getUnitGroupsByPropertyService } from 'services/UnitGroups';
import { UnitGroupDetailAppType } from 'services/UnitGroups/type';
import { Spin } from 'antd';
import { DATE_FORMAT_4 } from 'configs/const/format';
import { useTranslation } from 'react-i18next';

const numColumns = 10;

const AvailabilityPage = () => {
  const { t } = useTranslation(['availability'])
  const { currentViewObj } = useView();
  const [startDate, setStartDate] = useState<dayjs.Dayjs>(dayjs());

  //SERVICE
  const [getAllUnitGroups, getAllUnitGroupsState] = useAsyncAction(getUnitGroupsByPropertyService);

  const unitGroupList = useDataDisplayV2<UnitGroupDetailAppType>(getAllUnitGroupsState);
  const [getUnitGroupsAvailability, stateUnitGroupAvailability] = useAsyncAction(
    getAllAvailabilityUnitGroups
  );

  const handleCallAvailability = () => {
    const query: QueryCaseType = {
      propertyId: currentViewObj.code,
      from: convertTimeToSecTimestamp(startDate),
      to: convertTimeToSecTimestamp(startDate, numColumns),
      timeSliceTemplate: 'OverNight'
    };
    const queries = queryCase({ ...query });
    getUnitGroupsAvailability(queries);
    return queries;
  };

  const unitGroupAvailability: AllUnitGroupsAvailabilityType[] = useMemo(() => {
    if (stateUnitGroupAvailability?.data?.status !== 200) return undefined;
    const result = (stateUnitGroupAvailability?.data?.data as any)?.timeSlices ?? [];
    return result;
  }, [stateUnitGroupAvailability?.data?.data]);

  useDidMount((controller) => {
    currentViewObj.code && getAllUnitGroups(currentViewObj.code, false, controller?.signal);
  });

  useEffect(() => {
    const controller = new AbortController();
    handleCallAvailability();
    return () => {
      controller.abort();
    };
  }, [startDate]);

  return (
    <PlainLayout
      headerprops={{
        title: t('availability:availability')
      }}
      footerprops={{
        children: COPYRIGHT,
        className: 'text-center'
      }}
      className="bg-inherit"
    >
      <div className="flex flex-col gap-5">
        <DatePickerComponent
          dateFormat={DATE_FORMAT_4}
          startDate={startDate}
          setStartDate={setStartDate}
          className="pt-6"
        />
        {stateUnitGroupAvailability?.loading || getAllUnitGroupsState?.loading ? (
          <Spin />
        ) : (stateUnitGroupAvailability?.data?.data !== null &&
          !stateUnitGroupAvailability?.loading) ||
          (getAllUnitGroupsState?.data?.data !== null && !getAllUnitGroupsState?.loading) ? (
          <TableUnitAvailability
            unitGroupList={unitGroupList.list}
            startDate={startDate}
            unitGroupAvailability={unitGroupAvailability}
            loading={stateUnitGroupAvailability?.loading && getAllUnitGroupsState?.loading}
          />
        ) : (
          <></>
        )}
      </div>
    </PlainLayout>
  );
};

export default AvailabilityPage;
