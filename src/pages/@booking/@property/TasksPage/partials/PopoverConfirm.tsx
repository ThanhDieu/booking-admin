import { Button, Input, Popover, PopoverProps, Space, Typography } from 'antd';
import React, { ReactNode, useState } from 'react';
import { Trans, useTranslation } from 'react-i18next';
const { Text, Title } = Typography

interface PopoverConfirmProp extends PopoverProps {
	keyConfirm: string
	name: string,
	tail?: string,
	onConfirm: () => void
	children: ReactNode
}

const PopoverConfirm = (props: PopoverConfirmProp) => {
	const { t } = useTranslation(['common', 'tasks'])
	const {
		keyConfirm = '',
		name = '',
		tail = '',
		children,
		trigger = 'click',
		placement = 'left',
		onConfirm
	} = props

	const [keyValue, setKeyValue] = useState<string>('')

	const renderPopoverContent = () => {
		return <div className='w-72 flex flex-col'>
			<Title level={5} className='font-normal'>{t('common:modal.title_confirm_delete')}</Title>

			<Text className='mb-2'>
				<Trans
					i18nKey={'common:modal.confirm_content_delete_v2'}
					defaultValue={'This action cannot be undone. <br /> This will permanently delete the <i>{{name}}</i> {{tail}}.'}
					values={{ name: name, tail: tail }}
					components={{ italic: <i /> }}
				/>
			</Text>

			<Space direction='vertical' size={[8, 8]}>
				<Text className='mb-1'>
					<Trans
						i18nKey={'common:modal.type_to_confirm'}
						defaultValue={'Please type <bold>{{- keyConfirm}}</bold> to confirm!'}
						values={{ keyConfirm: keyConfirm }}
						components={{ bold: <strong /> }}
					/>
				</Text>
				<Input onChange={(e) => setKeyValue(e.target.value)} />
				<Space size={8}>
					<Button type='primary' disabled={keyValue !== keyConfirm} onClick={onConfirm}>
						{t('common:general.done')}
					</Button>
				</Space>
			</Space>
		</div>
	}

	return (
		<Popover
			content={renderPopoverContent}
			trigger={trigger}
			placement={placement}
		>
			{children}
		</Popover>
	);
};

export default PopoverConfirm;
