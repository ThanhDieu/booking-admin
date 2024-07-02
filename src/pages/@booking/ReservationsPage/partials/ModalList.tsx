import { ReservationDetailAppType } from 'services/Reservation/type';
import {
  ModalAssignUnit,
  ModalCancel,
  ModalCheckInStatus,
  ModalCheckOutStatus,
  ModalUnassignUnit
} from '.';
import { QueryCaseType } from 'utils/queryParams';
import { actionReservationType } from 'configs/const/general';

interface Props {
  openModal: string;
  onChangeModal: (value: string) => void;
  reservationItem?: ReservationDetailAppType;
  onChangeLocation?: (location: QueryCaseType) => void;
}
const IndexModal: React.FC<Props> = ({
  openModal,
  onChangeModal: setOpenModal,
  reservationItem,
  onChangeLocation: handleChangeLocation
}) => {
  return (
    <>
      {openModal === actionReservationType.CheckIn && (
        <ModalCheckInStatus
          modalOpen={openModal === actionReservationType.CheckIn}
          onChangeOpenModal={setOpenModal}
          detail={reservationItem}
          onChangeLocation={(location) => handleChangeLocation && handleChangeLocation(location)}
        />
      )}
      {openModal === actionReservationType.CheckOut && (
        <ModalCheckOutStatus
          modalOpen={openModal === actionReservationType.CheckOut}
          detail={reservationItem}
          onChangeOpenModal={setOpenModal}
          onChangeLocation={(location) => handleChangeLocation && handleChangeLocation(location)}
        />
      )}
      {openModal === actionReservationType.AssignUnit && (
        <ModalAssignUnit
          modalOpen={openModal === actionReservationType.AssignUnit}
          detail={reservationItem}
          onChangeOpenModal={setOpenModal}
          onChangeLocation={(location) => handleChangeLocation && handleChangeLocation(location)}
        />
      )}
      {openModal === actionReservationType.Cancel && (
        <ModalCancel
          modalOpen={openModal === actionReservationType.Cancel}
          detail={reservationItem}
          onChangeOpenModal={setOpenModal}
          onChangeLocation={(location) => handleChangeLocation && handleChangeLocation(location)}
        />
      )}
      {openModal === actionReservationType.UnassignUnit && (
        <ModalUnassignUnit
          modalOpen={openModal === actionReservationType.UnassignUnit}
          detail={reservationItem}
          onChangeOpenModal={setOpenModal}
          onChangeLocation={(location) => handleChangeLocation && handleChangeLocation(location)}
        />
      )}
    </>
  );
};

export default IndexModal;
