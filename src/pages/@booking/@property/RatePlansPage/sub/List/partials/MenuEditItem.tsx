import React from 'react';
import { MenuItem, getItem } from 'configs/sidemenus';
import {
  EditOutlined,
  DeleteOutlined,
  StopOutlined,
  CloseCircleOutlined,
  CreditCardOutlined,
  SwitcherOutlined,
  CalendarOutlined,
  PartitionOutlined,
  BankOutlined,
  FunctionOutlined,
  CalculatorOutlined,
  ControlOutlined
} from '@ant-design/icons';
import { MenuProps } from 'antd';
import { editModalType } from 'configs/const/general';

interface Props {
  setOpenModal: React.Dispatch<
    React.SetStateAction<{
      modalType: string;
      modalTitle: string;
    }>
  >;
}

const MenuEditItem = ({ setOpenModal }: Props) => {
  const subRatePlanItem: MenuProps['items'] = [
    getItem('Rate plan restrictions', '1', <StopOutlined className="text-lg" />, undefined, () => {
      setOpenModal({
        modalType: editModalType.RESTRICTION,
        modalTitle: 'Rate plan restrictions'
      });
    }),
    getItem(
      'Cancellation policy',
      '2',
      <CloseCircleOutlined className="text-lg" />,
      undefined,
      () => {
        setOpenModal({
          modalType: editModalType.CANCELLATION,
          modalTitle: 'Cancellation policy'
        });
      }
    ),
    getItem('Minimum guatantee', '3', <CreditCardOutlined className="text-lg" />, undefined, () => {
      setOpenModal({
        modalType: editModalType.GUARANTEE,
        modalTitle: 'Minimum guatantee'
      });
    }),
    getItem(
      'Booking channels',
      '4',
      <PartitionOutlined className="rotate-180 text-lg" />,
      undefined,
      () => {
        setOpenModal({
          modalType: editModalType.CHANNEL,
          modalTitle: 'Booking channels'
        });
      }
    ),
    getItem('Booking periods', '5', <CalendarOutlined className="text-lg" />, undefined, () => {
      setOpenModal({
        modalType: editModalType.PERIODS,
        modalTitle: 'Booking periods'
      });
    }),
    getItem(
      'Accounting configurations',
      '6',
      <BankOutlined className="text-lg" />,
      undefined,
      () => {
        setOpenModal({
          modalType: editModalType.ACCOUNTING,
          modalTitle: 'Accounting configurations'
        });
      }
    )
  ];

  const ratePlantItems: MenuItem[] = [
    getItem('Edit', 'Edit', <EditOutlined className="text-lg" />, subRatePlanItem),
    getItem('Duplicate', 'Duplicate', <SwitcherOutlined className="text-lg" />),
    getItem('Delete', 'Delete', <DeleteOutlined className="text-lg" />)
  ];
  return ratePlantItems;
};

export const MenuEditPriceItem = () => {
  const ratePlantItems: MenuItem[] = [
    getItem('Pricing rule', 'Pricing rule', <FunctionOutlined className="text-lg" />),
    getItem(
      'Price calculation mode',
      'Price calculation mode',
      <CalculatorOutlined className="text-lg" />
    ),
    getItem('Prices', 'Prices', <ControlOutlined className="text-lg" />),
    getItem('Restrictions', 'Restrictions', <StopOutlined className="text-lg" />)
  ];
  return ratePlantItems;
};
export default MenuEditItem;
