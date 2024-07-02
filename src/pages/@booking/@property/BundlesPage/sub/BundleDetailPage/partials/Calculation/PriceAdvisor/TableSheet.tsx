/* eslint-disable @typescript-eslint/no-explicit-any */
import { FormInstance, Table, TableProps, Typography } from 'antd';
import { ColumnsType } from 'antd/es/table';
import clsx from 'clsx';
import { ThemeType } from 'configs/const/general';
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useAppSelector } from 'store';
import { currencies } from 'utils/currency';
import { EditableCellProps, ModifiedDataType, TransformedRoomType } from './index.types';
import { average, median } from './helper';

const { Text } = Typography

const EditableCell: React.FC<EditableCellProps> = ({
	title,
	children,
	dataIndex,
	record,
	cellVal,
	handleSelect,
	...restProps
}) => {
	const { selected } = useAppSelector(state => state.app.theme)

	return <td {...restProps}
		className={
			clsx(selected === ThemeType.DEFAULT ? "bg-white" : "bg-[#474e59]",
				{ [`ant-table-cell-fix-right-first`]: dataIndex === 'average' },
				{ ['ant-table-cell ant-table-cell-fix-right']: dataIndex === 'median' || dataIndex === 'average_deviation' || dataIndex === 'median_deviation' },
				{ ["cursor-pointer hover:shadow-[inset_0px_0px_0px_1px_#1677ff]"]: cellVal },
				{ [`hover:bg-[#fff]`]: cellVal && selected === ThemeType.DEFAULT },
			)
		}
		onClick={handleSelect}
	>
		{children}
	</td >;
};

export interface TableSheetProps extends TableProps<TransformedRoomType> {
	data: ModifiedDataType[],
	loading?: boolean,
	form: FormInstance<{ unit_group_advisor: string, price_advisor: number }>
	watchHook: number
}

export default function TableSheet({ data: modifiedData, loading, form: formPA, watchHook: priceWatcher }: TableSheetProps) {
	const { t } = useTranslation(['common', 'bundles'])

	const columns = useMemo(() => {
		const colArr: ColumnsType<TransformedRoomType> = [
			{
				title: t('common:table.hotel'),
				key: "hotelId",
				width: 120,
			},
			{
				title: t('common:table.average'),
				key: "average",
				dataIndex: "average",
				width: 100,
				fixed: 'right',
				onCell: (record) => ({
					record,
					title: "Average",
					dataIndex: "average",
					cellVal: record?.average,
					handleSelect: () => record?.average && formPA.setFieldValue('price_advisor', record.average)
				})
			},
			{
				title: t('common:table.average_deviation'),
				key: "average_deviation",
				dataIndex: "average_deviation",
				width: 100,
				fixed: 'right',
				render: (average_deviation) =>
					<Text className={clsx(average_deviation < 0 ? "text-[#ff4d4f]" : "text-[#4096ff]")}>
						{average_deviation}
					</Text>,
			},
			{
				title: t('common:table.median'),
				key: "median",
				dataIndex: "median",
				width: 100,
				fixed: 'right',
				onCell: (record) => ({
					record,
					title: "Median",
					dataIndex: "median",
					cellVal: record?.median,
					handleSelect: () => record.median && formPA.setFieldValue('price_advisor', record.median)
				}),
			},
			{
				title: t('common:table.median_deviation'),
				key: "median_deviation",
				dataIndex: "median_deviation",
				width: 100,
				fixed: 'right',
				render: (median_deviation) =>
					<Text className={clsx(median_deviation < 1 ? "text-[#ff4d4f]" : "text-[#4096ff]")}>
						{median_deviation}
					</Text>,
			}
		]

		if (modifiedData && modifiedData.length && colArr) {
			const hotelColumn: ColumnsType<TransformedRoomType> = modifiedData.map((hotel) => ({
				title: hotel.hotelName,
				key: hotel.hotelId,
				dataIndex: `${hotel.hotelId}`.toLowerCase(),
				width: 166,
				// ellipsis: true,
				render: (record) => <>
					<Text className='block'>{record?.price && record?.price} {record?.currency && record?.currency}</Text>
					<Text className='block'>{record?.name && `${record?.name}`}</Text>
				</>,
				onCell: (record: TransformedRoomType) => ({
					record,
					title: hotel.hotelName,
					dataIndex: `${hotel.hotelId}`.toLowerCase(),
					cellVal: record[hotel.hotelId],
					handleSelect: () => record
						&& hotel.hotelId
						&& record[hotel.hotelId]
						&& formPA.setFieldValue('price_advisor', record[hotel.hotelId].price)
				}),
			}))

			return [
				...hotelColumn,
				...colArr.splice(1, colArr.length)
			]
		}

		return colArr
	}, [modifiedData]);

	const dataSource = useMemo(() => {
		if (modifiedData && modifiedData.length) {
			const transformedData = modifiedData.reduce((result: any, hotel) => {
				hotel.roomTypes.forEach(roomType => {
					const { name, average } = roomType;
					const key = `${name}`;
					const currency = currencies.find((item) => item.iso === hotel.currency)?.symbol

					if (!result[name]) {
						result[name] = {
							id: "",
							prices: [],
						};
					}

					result[name].id = key;
					result[name][hotel.hotelId] = {
						name: name,
						price: Number(average.toFixed(2)),
						currency: currency || "€"
					};
					result[name].prices.push(Number(average.toFixed(2)));
				});

				return result;
			}, {});

			const finalTransformedData: TransformedRoomType[] = Object.keys(transformedData).map(roomTypeName => {
				const roomTypeData = transformedData[roomTypeName];

				roomTypeData.average = Number(average(roomTypeData.prices).toFixed(2));
				roomTypeData.average_deviation = Number(((priceWatcher ?? 0) - average(roomTypeData.prices)).toFixed(2));
				roomTypeData.median = Number(median(roomTypeData.prices).toFixed(2));
				roomTypeData.median_deviation = Number(((priceWatcher ?? 0) - median(roomTypeData.prices)).toFixed(2));

				return roomTypeData;
			});

			return finalTransformedData
		}
		return []
	}, [modifiedData, priceWatcher]);

	return (
		<Table
			loading={loading}
			components={{
				body: {
					cell: EditableCell
				}
			}}
			rowKey={'id'}
			pagination={false}
			columns={columns}
			dataSource={dataSource}
			className="mb-4"
			bordered
			scroll={modifiedData && modifiedData.length ? { x: modifiedData.length > 5 ? 1396 : undefined, y: 345 } : undefined}
		/>
	);
}
