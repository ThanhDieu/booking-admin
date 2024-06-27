/* eslint-disable @typescript-eslint/no-explicit-any */
export type RoomTypes = {
  name: string;
  prices: number[];
  average: number;
  median: number;
};

export type ModifiedDataType = {
  hotelId: number;
  hotelName: string;
  currency: string;
  roomTypes: RoomTypes[];
};

export interface TransformedRoomType {
  [key: string]: any;
  id: string;
  average: number;
  average_interval: number;
  median: number;
  median_base: number;
  [hotelId: number]: {
    name: string;
    price: number;
    currency: string;
  };
}

export interface EditableCellProps {
  title: React.ReactNode;
  children: React.ReactNode;
  dataIndex: keyof TransformedRoomType;
  record: TransformedRoomType;
  cellVal?: any;
  handleSelect: () => void;
}
