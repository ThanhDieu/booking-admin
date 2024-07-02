/* eslint-disable @typescript-eslint/no-explicit-any */
import { Table, Typography } from 'antd';
import clsx from 'clsx';
import dayjs from 'dayjs';
import { AllUnitGroupsAvailabilityType } from 'services/Availability/type';
import { UnitGroupDetailAppType } from 'services/UnitGroups/type';
import ExpandUnitList from './ExpandUnitList';
import ExpandUnitValue from './ExpandUnitValue';
import { useMemo } from 'react';
import { DATE_FORMAT_4 } from 'configs/const/format';
import { useTranslation } from 'react-i18next';

interface Props {
  startDate: dayjs.Dayjs;
  unitGroupAvailability: AllUnitGroupsAvailabilityType[];
  loading: boolean;
  unitGroupList: UnitGroupDetailAppType[];
}

const TableUnitAvailability = ({
  startDate,
  unitGroupAvailability,
  loading,
  unitGroupList
}: Props) => {
  const { t } = useTranslation(['availability'])
  const numColumns = 10;

  const takeCountFc = (id: string, date: string) => {
    const unitGroupVal = unitGroupAvailability?.filter((item: any) => {
      const formatDate = dayjs(item?.from).format(DATE_FORMAT_4);
      return formatDate === date;
    })[0];

    let availableCount;
    if (!unitGroupVal) {
      availableCount = 'No data';
    } else if (id !== 'BER-OCC') {
      const x = unitGroupVal?.unitGroups?.filter((el: any) => {
        return el?.unitGroup?.id === id;
      });

      availableCount = x[0]?.sellableCount;
    } else {
      availableCount = unitGroupVal?.property?.sellableCount;
    }

    return availableCount;
  };
  const formatUnitGroupsList = useMemo(() => {
    return (
      unitGroupList?.map((item) => {
        return {
          id: item?.data?.id,
          code: item?.data?.code,
          name: (item?.data?.name as any)?.en
        };
      }) ?? []
    );
  }, [unitGroupList]);

  const injectOccToObj = [
    ...formatUnitGroupsList,
    {
      id: 'BER-OCC',
      code: 'OCC',
      name: 'Occupancy'
    }
  ];

  const colorCondition = (code: any) => {
    switch (code) {
      case 'SGL':
        return 'bg-[#fcdad0] ';
      case 'DBL':
        return 'bg-[#ffe8be]';
      case 'MEET':
        return 'bg-[#B2EAF2]';
      case 'FAMILY':
        return 'bg-[#B2EAF2]';
      default:
        return 'bg-[#f0f0f0]';
    }
  };

  const columns = [
    {
      title: t("availability:units"),
      dataIndex: 'name',
      key: 'name',
      width: '15%',
      render: (_: any, record: any) => (
        <>
          <div className="flex flex-col">
            <div className="flex items-center gap-1">
              <div className={clsx('w-2 h-2', colorCondition(record.code))} />
              <Typography.Text>{record.name}</Typography.Text>
            </div>
            <Typography.Text>{record.code}</Typography.Text>
          </div>
        </>
      )
    },
    ...[...Array(numColumns)].map((_, index) => {
      const currentDate = startDate?.add(index, 'day');
      const formatedDate = currentDate?.format(DATE_FORMAT_4);
      const formatedDay = currentDate?.format('ddd');

      return {
        title: (
          <div className="flex flex-col items-center justify-center ">
            <Typography.Text
              type={formatedDay === 'Sat' || formatedDay === 'Sun' ? 'warning' : 'secondary'}
            >
              {formatedDay}
            </Typography.Text>
            <Typography.Text>{formatedDate}</Typography.Text>
          </div>
        ),
        dataIndex: `data${index + 1}`,
        key: `data${index + 1}`,
        render: (_: any, record: any) => (
          <>
            {index !== numColumns - 1 && (
              <div
                className={clsx(
                  ' m-auto flex h-[50px] w-full translate-x-1/2 items-center justify-center rounded  text-center ',
                  colorCondition(record?.code)
                )}
                style={{
                  border: colorCondition(record?.code)
                }}
              >
                {takeCountFc(record?.id, formatedDate)}
              </div>
            )}
          </>
        )
      };
    })
  ];
  return (
    <Table
      loading={loading}
      columns={columns}
      dataSource={startDate ? injectOccToObj : []}
      pagination={false}
      rowKey="id"
      expandable={{
        columnWidth: '5%',
        expandedRowClassName: () => 'expanded-class',
        expandedRowRender: (record) => {
          const idUnitGroup = record?.id ?? '';
          return (
            <>
              <div className="flex">
                <ExpandUnitList id={idUnitGroup} />
                <div className="flex flex-1 ">
                  {unitGroupAvailability?.map((item: any, idx: any) => {
                    const index = item?.unitGroups?.findIndex(
                      (el: any) => el?.unitGroup?.id === idUnitGroup
                    );

                    return (
                      <ExpandUnitValue
                        id={idUnitGroup}
                        key={idx}
                        unitGroup={
                          idUnitGroup !== 'BER-OCC' ? item?.unitGroups[index] : item.property
                        }
                      />
                    );
                  })}
                </div>
              </div>
            </>
          );
        }
      }}
      className="table-unit"
    />
  );
};

export default TableUnitAvailability;
