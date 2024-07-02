/* eslint-disable @typescript-eslint/no-explicit-any */
import { useMemo } from 'react';
import { ModifiedDataType, RoomTypes } from './index.types';
import { RateHQrevenueType } from 'services/@HQrevenue/type';

export const useModifiedData = (dataState: any, limit = 1) => {
  const modifiedData = useMemo(() => {
    if (!dataState || dataState?.data?.status !== 200) return;
    const originalData = dataState?.data?.data as any as RateHQrevenueType[];

    const transformedData = originalData.reduce((result: ModifiedDataType[], item) => {
      const existingHotel = result.find(
        (hotel: ModifiedDataType) => hotel.hotelId === item.hotelId
      );

      if (existingHotel) {
        const existingRoomType = existingHotel.roomTypes.find(
          (rt: RoomTypes) => rt.name === item.roomType
        );

        if (existingRoomType) {
          existingRoomType.prices.push(item.price);
        } else {
          existingHotel.roomTypes.push({
            name: item.roomType,
            prices: [item.price],
            average: 0,
            median: 0
          });
        }
      } else {
        result.push({
          hotelId: item.hotelId,
          hotelName: item.hotelName,
          currency: item.currency,
          roomTypes: [
            {
              name: item.roomType,
              prices: [item.price],
              average: 0,
              median: 0
            }
          ]
        });
      }

      return result;
    }, []);

    transformedData.forEach((hotel: ModifiedDataType) => {
      hotel.roomTypes.forEach((roomType: RoomTypes) => {
        roomType.average =
          roomType.prices.reduce((sum, price) => sum + price, 0) / roomType.prices.length;

        const sortedPrices = roomType.prices.slice().sort((a, b) => a - b);
        const middleIndex = Math.floor(sortedPrices.length / 2);
        roomType.median =
          sortedPrices.length % 2 === 1
            ? sortedPrices[middleIndex]
            : (sortedPrices[middleIndex - 1] + sortedPrices[middleIndex]) / 2;
      });
    });

    transformedData.forEach((hotel: ModifiedDataType) => {
      hotel.roomTypes = hotel.roomTypes.filter((roomType: RoomTypes) => {
        return roomType.name !== 'Undefined' && !roomType.prices.every((price) => price === 0);
      });
    });

    return transformedData.splice(0, limit);
  }, [dataState?.data?.data, limit]);

  return modifiedData;
};
