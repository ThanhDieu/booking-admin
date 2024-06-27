export interface OwnHotelInfoType {
  accountId: string;
  myHotel: {
    id: number;
    name: string;
    rank: number;
  };
  city: string;
  timezone: string;
  currency: string;
  temperature: string;
  roomCategories: {
    id: number;
    name: string;
  }[];
  competitors: {
    id: number;
    name: string;
    rank: number;
  }[];
  channels: {
    id: number;
    name: string;
    isMaster: boolean;
  }[];
  compsets: {
    name: string;
    isMaster: boolean;
    hotels: number[];
  }[];
  claims: string[];
}

export interface RateHQrevenueType {
  channelId: number;
  hotelId: number;
  price: number;
  targetDate: string;
  updatedAt: string;
  rateName: string;
  los: number;
  roomType: string;
  currency: string;
  isSoldout: boolean;
  isCancelable: boolean;
  mealPlan: string;
  leadTime: number;
  occupancy: number;
  hotelName: string;
}
