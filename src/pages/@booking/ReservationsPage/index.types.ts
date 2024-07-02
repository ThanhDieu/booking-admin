/* eslint-disable @typescript-eslint/no-explicit-any */
import { ReservationDetailAppType } from 'services/Reservation/type';
import { QueryCaseType } from 'utils/queryParams';

export default interface ReservationsPageProps {}

export interface ReservationDetailPageProps {
  reservationDetail: ReservationDetailAppType;
  onChangeDetail?: () => void;
  getReservationDetail?: (
    propetyId: string,
    id: string,
    signal?: AbortSignal | undefined
  ) => Promise<any>;
}

export interface ModalActionReservationProps {
  modalOpen: boolean;
  onChangeOpenModal: (value: string) => void;
  onChangeLocation?: (location: QueryCaseType) => void;
  detail?: ReservationDetailAppType;
}
