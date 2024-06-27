/* eslint-disable @typescript-eslint/no-explicit-any */
import { Col, Form, FormInstance, Row, Typography } from 'antd';
import { useMemo } from 'react';
import { currencies, currencyFormatter } from 'utils/currency';
import { InitBaseType, InitServiceType, InitialBundleType } from '../../types';
import { useTranslation } from 'react-i18next';

const { Title } = Typography

export interface SummaryProps {
	form: FormInstance<InitialBundleType>
}

export default function Summary({ form }: SummaryProps) {
	const { t } = useTranslation(['common', 'bundles'])
	const servicesSelected = Form.useWatch<InitServiceType[]>('services_include', form);
	const baseWatcher = Form.useWatch<InitBaseType[]>('base', form);
	const currencyWatcher = Form.useWatch('currency', form)
	const currencyInfo = useMemo(() => {
		const found = currencies.find((value) => value.iso === currencyWatcher)
		if (found) return found
		else return {
			name: 'European Euro',
			symbol: '€',
			iso: 'EUR',
			locale: 'de-DE'
		}
	}, [currencyWatcher])

	const basePrice = useMemo(() => {
		return (baseWatcher && baseWatcher[0]?.price) || 0
	}, [baseWatcher]);

	const servicesTotal = useMemo(() => {
		return servicesSelected?.reduce((accumulator: number, currentValue: any) => {
			return accumulator + (currentValue?.price || 0);
		}, 0) || 0;
	}, [servicesSelected])

	const totalNet = basePrice + servicesTotal;
	const tax: number | undefined = undefined;
	const total = tax ? totalNet + (totalNet * tax) / 100 : totalNet;

	return (
		<>
			<Col span={24}>
				<Title level={3} className="inline-block font-medium mb-4">
					{t('bundles:summary')}
				</Title>
			</Col>
			<Col span={24}>
				{/* <Row>
					<Col span={16}>
						<Text className="inline-block text-base font-normal">Total net</Text>
					</Col>
					<Col span={8} className="text-right">
						<Text className="inline-block text-base font-normal">
							{currencyFormatter(totalNet, currencyInfo?.iso || 'EUR')}{' '}
							{currencyInfo?.iso || 'EUR'}
						</Text>
					</Col>
				</Row>
				 <Divider className="my-3" />
				<Row>
					<Col span={16}>
						<Text className="inline-block text-base font-normal">VAT {tax ? `${tax}%` : ''}</Text>
					</Col>
					<Col span={8} className="text-right">
						<Text className="inline-block text-base font-normal">
							0 {currencyInfo?.iso || 'EUR'}
						</Text>
					</Col>
				</Row>
				<Divider className="my-3" /> */}
				<Row>
					<Col span={16}>
						<Title level={4} className="inline-block font-bold">
							{t("common:form.total")}
						</Title>
					</Col>
					<Col span={8} className="text-right">
						<Title level={4} className="inline-block font-bold">
							{currencyFormatter(total, currencyInfo?.iso || 'EUR')} {currencyInfo?.iso || 'EUR'}
						</Title>
					</Col>
				</Row>
			</Col>
		</>
	);
}
