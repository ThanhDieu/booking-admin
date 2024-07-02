import { CloseOutlined, CloseSquareOutlined, HolderOutlined, KeyOutlined } from '@ant-design/icons';
import { ActionType } from '@types';
import XIcon from 'components/shared/Icon';
import { actionReservationType } from 'configs/const/general';
import { MenuItem, getItem } from 'configs/sidemenus';
import { addSpaceInString } from 'utils/text';

interface Props {
  shows: ActionType[];
}

export const actionIcons = (type: string) => {
  switch (type) {
    case actionReservationType.CheckIn:
      return <XIcon name="planeArrival" />;
    case actionReservationType.CheckOut:
      return <XIcon name="planeDeparture" />;
    case actionReservationType.Cancel:
      return <CloseOutlined />;
    case actionReservationType.AssignUnit:
      return <KeyOutlined />;
    case actionReservationType.UnassignUnit:
      return <CloseSquareOutlined />;
    default:
      return <HolderOutlined />;
  }
};

const MenuActionItem = ({ shows }: Props) => {
  const reservationItems: MenuItem[] = shows.map((show) => {
    return getItem(addSpaceInString(show.action), show.action, actionIcons(show.action));
  });

  return reservationItems;
};
export default MenuActionItem;
