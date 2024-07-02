import dayjs from 'dayjs';

export default interface RatePlansPageProps {
  // timeSlice: string;
}

export interface TableRateProps {
  startDate: dayjs.Dayjs;
  setStartDate: (value: React.SetStateAction<dayjs.Dayjs>) => void;
  className?: string;
}
