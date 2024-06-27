import { DATE_TIME_FORMAT_1 } from 'configs/const/format';
import dayjs from 'dayjs';

export const createDateWithoutTime = (date: Date) => new Date(date).setHours(0, 0, 0, 0);

export const formatTime = (timestamp: number, type?: string) => {
  const date = new Date(timestamp * 1000);

  const month = (date.getMonth() + 1 < 10 ? '0' : '') + (date.getMonth() + 1);
  const day = (date.getDate() < 10 ? '0' : '') + date.getDate();
  const hour = (date.getHours() < 10 ? '0' : '') + date.getHours();
  const min = (date.getMinutes() < 10 ? '0' : '') + date.getMinutes();
  const sec = (date.getSeconds() < 10 ? '0' : '') + date.getSeconds();

  const str = `${date.getFullYear()}/${month}/${day}${
    type === 'time' ? `, ${hour}:${min}:${sec}` : ''
  }`;
  return str;
};
export const convertTimeToMils = (time: number, timeUnit: 'second' | 'minute' | 'hour') => {
  switch (timeUnit) {
    case 'second':
      return time * 1000;
    case 'minute':
      return time * 60 * 1000;
    case 'hour':
      return time * 60 * 60 * 1000;
    default:
  }
  return time;
};

export const convertTimeToSecTimestamp = (dateObj: dayjs.Dayjs, numberOfDays?: number) => {
  let secTimestamp;
  if (numberOfDays) {
    secTimestamp = dateObj?.add(numberOfDays, 'day').unix().toString();
  } else {
    secTimestamp = dateObj?.unix().toString();
  }
  return secTimestamp;
};

export const checkIsToday = (time?: number) => {
  const timestamp = time ? Number(time) * 1000 : 0;
  const currentDate = dayjs();
  const timestampDate = dayjs(timestamp);
  const isToday = timestampDate.isSame(currentDate, 'day');
  return isToday;
};

export const dateFormat = (secondTimeStamp: number | string, format: string) => {
  const result = dayjs(Number(secondTimeStamp) * 1000).format(format);

  return result;
};

export const arrayDateInDateRange = (
  arrivalTimestamp: number,
  departureTimestamp: number,
  hasEnd?: boolean
) => {
  // Chuyển đổi timestamp thành đối tượng dayjs
  const arrivalDate = dayjs.unix(arrivalTimestamp);
  const departureDate = dayjs.unix(departureTimestamp);

  // Tạo một danh sách các ngày nằm giữa hai timestamp
  const datesInRange = [];

  // Duyệt qua các ngày từ ngày đến ngày đi
  let currentDate = arrivalDate;
  while (currentDate.isBefore(departureDate)) {
    datesInRange.push(currentDate);
    currentDate = currentDate.add(1, 'day');
  }
  if (hasEnd) {
    datesInRange.push(departureDate);
  }

  return datesInRange;
};

export const formatDateTimeByTimezone = (
  value: string | number,
  timezone = 'Europe/Berlin',
  format = DATE_TIME_FORMAT_1
) => {
  return dayjs.tz(dayjs.utc(value), timezone).format(format);
};

export const countingNights = (arrivalInSecond: number, departureInSecond: number) => {
  const numberOfNight = dayjs(departureInSecond * 1000).diff(dayjs(arrivalInSecond * 1000), 'day');
  return numberOfNight;
};

export const sortDayOfWeekWithOrder = (dayArr: string[], dayOrder: string[]) => {
  return dayArr?.slice().sort((x, y) => dayOrder?.indexOf(x) - dayOrder?.indexOf(y));
};

export const countConsecutiveDaysFunc = (selectedDays: string[]) => {
  const consecutiveDays = {
    min: 0,
    max: 0
  };
  if (!Array.isArray(selectedDays) || selectedDays.length === 0) {
    return consecutiveDays;
  }
  const dayOrder = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
  const sortSelectedDays = sortDayOfWeekWithOrder(selectedDays, dayOrder);

  //Get missing element in selectedDays array base on day arr order
  const missingDays = dayOrder?.filter((day) => !sortSelectedDays?.includes(day));
  switch (missingDays.length) {
    //Selected days is a week
    case 0:
      consecutiveDays.min = sortSelectedDays.length;
      consecutiveDays.max = sortSelectedDays.length;
      break;
    //Selected days is 6 consecutive days
    case 1:
      consecutiveDays.min = dayOrder.length - missingDays.length - 1;
      consecutiveDays.max = dayOrder.length - missingDays.length - 1;
      break;

    default: {
      const subArr: string[][] = [];
      let currSubArr: string[] = [];
      for (const day of dayOrder) {
        if (missingDays?.includes(day)) {
          if (currSubArr.length > 0) {
            subArr?.push([...currSubArr]);
            currSubArr = [];
          }
        } else {
          currSubArr?.push(day);
        }
      }
      if (currSubArr.length > 0) {
        subArr?.push([...currSubArr]);
      }

      //Merge Monday and Sunday
      let curMonday = 0;
      for (const i of subArr) {
        if (i?.includes('Monday') && !i?.includes('Sunday')) {
          curMonday = subArr?.indexOf(i);
        }
        if (i?.includes('Sunday') && selectedDays?.includes('Monday')) {
          i?.push(...subArr[curMonday]);
        }
      }
      if (subArr[0]?.includes('Monday') && subArr[-1]?.includes('Sunday')) {
        subArr.shift();
      }

      //Get min and max consecutive days
      const min_length = Math.min(...subArr.map((mi) => mi.length).filter((length) => length > 1));
      const max_length = Math.max(...subArr.map((ma) => ma.length));
      consecutiveDays.min = min_length - 1 === Infinity ? 0 : min_length - 1;
      consecutiveDays.max = max_length - 1 === Infinity ? 0 : max_length - 1;
      break;
    }
  }
  return consecutiveDays;
};
