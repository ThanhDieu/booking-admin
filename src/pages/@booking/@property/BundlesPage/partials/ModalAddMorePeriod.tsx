/* eslint-disable @typescript-eslint/no-explicit-any */
import {
	MinusCircleOutlined,
	PlusOutlined
} from '@ant-design/icons';
import {
	Button,
	DatePicker,
	Form,
	FormInstance,
	Input,
	Modal,
} from 'antd';
import dayjs from 'dayjs';
import { MorePeriodType } from './BundleItem';
import { useTranslation } from 'react-i18next';

interface ModalAddMorePeriodProps<T> {
	open: boolean
	form: FormInstance<T>
	onCancel: () => void
	onSubmit: (formData: T) => void
	initialValue: T
}

const ModalAddMorePeriod = ({
	open,
	form,
	onCancel,
	onSubmit: onSubmitModalForm,
	initialValue
}: ModalAddMorePeriodProps<MorePeriodType>) => {
	const { t } = useTranslation(["common"])
	return (
		<Modal
			title={t('common:button.add_more_period')}
			open={open}
			onCancel={onCancel}
			onOk={() => {
				form.validateFields().then((values) => {
					form.resetFields();
					onSubmitModalForm(values);
				})
			}}
		>
			<Form
				form={form}
				initialValues={initialValue}
				className="bundle-add-more-period-modal mt-4"
			>
				<Form.Item name="id" noStyle>
					<Input type="hidden"></Input>
				</Form.Item>
				<Form.List name="periods">
					{(fields, { add, remove }) => (
						<>
							{fields.map(({ key, name }) => (
								<div key={key} className="flex flex-row flex-nowrap items-center gap-4 w-full">
									<Form.Item
										key={key}
										name={name}
										rules={[{ required: true, message: t('common:form.please_enter_this_field') }]}
										className="w-full"
									>
										<DatePicker.RangePicker
											className="w-full"
											format={'MM/DD/YYYY'}
											presets={[
												{ label: `${t('common:general.next')} 7 Days`, value: [dayjs().add(1, 'd'), dayjs().add(7, 'd')] },
												{
													label: `${t('common:general.next')} 14 Days`, value: [dayjs().add(1, 'd'), dayjs().add(14, 'd')]
												},
												{ label: `${t('common:general.next')} 30 Days`, value: [dayjs().add(1, 'd'), dayjs().add(30, 'd')] },
												{ label: `${t('common:general.next')} 90 Days`, value: [dayjs().add(1, 'd'), dayjs().add(90, 'd')] },
												{ label: `${t('common:general.next')} 180 Days`, value: [dayjs().add(1, 'd'), dayjs().add(180, 'd')] },
												{ label: `${t('common:general.next')} 1 Years`, value: [dayjs().add(1, 'd'), dayjs().add(1, 'y')] },
												{ label: `${t('common:general.next')} 2 Years`, value: [dayjs().add(1, 'd'), dayjs().add(2, 'y')] },
											]}
											disabledDate={(current) => current && current < dayjs().endOf('date')}
										/>
									</Form.Item>
									{fields.length > 1 ? (
										<div>
											<MinusCircleOutlined
												className="dynamic-delete-button mb-6 p-1"
												onClick={() => remove(name)}
											/>
										</div>
									) : null}
								</div>
							))}
							<Form.Item>
								<Button type="dashed" onClick={() => add()} block icon={<PlusOutlined />}>
									{t('common:button.add_field')}
								</Button>
							</Form.Item>
						</>
					)}
				</Form.List>
			</Form>
		</Modal>
	);
};

export default ModalAddMorePeriod;
