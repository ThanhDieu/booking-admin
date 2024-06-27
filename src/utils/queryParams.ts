/* eslint-disable @typescript-eslint/no-explicit-any */
import { convertCameltoSnake } from './text';

export interface QueryCaseType {
  propertyId?: string;
  perPage?: number;
  currentPage?: number;
  sorts?: string;
  type?: string;
  ratePlanInclude?: boolean;
  periods?: string;
  status?: string;
  disabled?: string;
  isGlobal?: string;
  username?: string;
  bundleId?: string;
  arrival?: string;
  departure?: string;
  adults?: number;
  children?: string;
  bookingId?: string;
  online?: boolean | string;
  isTemplate?: boolean;
  isHolidayPackage?: boolean;
  unitGroupId?: string;
  tagIds?: string;
  expands?: string;
  unitCondition?: string;
  includeOutOfService?: string;
  from?: string;
  to?: string;
  timeSliceTemplate?: string;
  search?: string;
  serviceType?: string;
  name?: string;
  tagId?: string;
  isHomePage?: string;
  isHotelPage?: string;
  isNewsletter?: boolean;
  filter?: string;
  isExpired?: string;
  isArchive?: boolean;
}
export const queryCase = ({
  propertyId,
  perPage,
  currentPage = 1,
  sorts,
  type,
  ratePlanInclude = false,
  periods,
  status,
  disabled,
  isGlobal,
  username,
  bundleId,
  arrival,
  departure,
  adults,
  children,
  bookingId,
  online,
  isTemplate,
  isHolidayPackage,
  unitGroupId,
  tagIds,
  expands,
  unitCondition,
  includeOutOfService,
  from,
  to,
  timeSliceTemplate,
  search,
  serviceType,
  name,
  isHomePage,
  isHotelPage,
  isNewsletter,
  isExpired,
  isArchive
}: QueryCaseType) => {
  let query = ``;
  const propertyCode = propertyId ? `propertyId=${propertyId}&` : ``;
  const newType = type ? `type=${type}&` : ``;
  const newServiceType = serviceType ? `serviceType=${serviceType}&` : ``;
  const order = sorts ? `sorts=${convertCameltoSnake(sorts)}&` : ``;
  const ratePlan = ratePlanInclude ? `ratePlanInclude=${ratePlanInclude}&` : ``;
  const multiplePeriods = periods ? `periods=${periods}&` : ``;
  const newStatus = status ? `status=${status}&` : ``;
  const newDisabled = disabled === 'true' || disabled === 'false' ? `disabled=${disabled}&` : ``;
  const newGlobal = isGlobal === 'true' || isGlobal === 'false' ? `isGlobal=${isGlobal}&` : ``;
  const newUsername = username ? `username=${username}&` : ``;
  const newBundleId = bundleId ? `bundleId=${bundleId}&` : ``;
  const customArrival = arrival ? `arrival=${arrival}&` : ``;
  const customDeparture = departure ? `departure=${departure}&` : ``;
  const customAdults = adults ? `adults=${adults}&` : ``;
  const customChildren = children ? `children=${children}&` : ``;
  const newBookingId = bookingId ? `bookingId=${bookingId}&` : ``;
  const newOnline = online === true ? `online=true&` : online === false ? `online=false&` : ``;
  const newIsExpired =
    isExpired === 'true' || isExpired === 'false' ? `isExpired=${isExpired}&` : ``;
  const newIsTemplate =
    isTemplate === true ? `isTemplate=true&` : isTemplate === false ? `isTemplate=false&` : ``;

  const newIsArchive =
    isArchive === true ? `isArchive=true&` : isArchive === false ? `isArchive=false&` : ``;

  const newIsNewsletter =
    isNewsletter === true
      ? `isNewsletter=true&`
      : isNewsletter === false
      ? `isNewsletter=false&`
      : ``;

  const newIsHomePage =
    isHomePage === 'true' || isHomePage === 'false' ? `isHomePage=${isHomePage}&` : ``;
  const newIsHotelPage =
    isHotelPage === 'true' || isHotelPage === 'false' ? `isHotelPage=${isHotelPage}&` : ``;

  const newHolidayPackage =
    isHolidayPackage === true
      ? `isHolidayPackage=true&`
      : isHolidayPackage === false
      ? `isHolidayPackage=false&`
      : ``;
  const newunitGroupId = unitGroupId ? `unitGroupId=${unitGroupId}&` : ``;
  const newtagIds = tagIds ? `tagIds=${tagIds}&` : ``;
  const newExpands = expands ? `expands=${expands}&` : ``;
  const newUnitCondition = unitCondition ? `unitCondition=${unitCondition}&` : ``;
  const newIncludeOutOfService = includeOutOfService
    ? `includeOutOfService=${includeOutOfService}&`
    : ``;
  const newTimeSliceTemplate = timeSliceTemplate ? `timeSliceTemplate=${timeSliceTemplate}&` : ``;
  const newFrom = from ? `from=${from}&` : ``;
  const newTo = to ? `to=${to}&` : ``;

  const newSearch = search ? `search=${search}&` : ``;
  const newName = name ? `name=${name}&` : '';

  const limit = perPage ? `perPage=${perPage}&` : ``;
  const page = currentPage ? `currentPage=${currentPage}` : '';

  const queryIds = `${propertyCode}${newunitGroupId}${newBookingId}${newBundleId}${newtagIds}`;
  const queryGeneral = `${newSearch}${newType}${newStatus}${newDisabled}${order}${newExpands}${newServiceType}${newName}`;
  const queryTime = `${customArrival}${customDeparture}${newFrom}${newTo}`;
  const queryOther = `${newGlobal}${ratePlan}${multiplePeriods}${newUsername}${customAdults}${customChildren}${newOnline}${newIsTemplate}${newIsNewsletter}${newHolidayPackage}${newUnitCondition}${newIncludeOutOfService}${newTimeSliceTemplate}${newIsHomePage}${newIsHotelPage}${newIsExpired}${newIsArchive}`;

  query = `${queryIds}${queryOther}${queryTime}${queryGeneral}${limit}${page}`;

  return query;
};

export const strapiQueryCase = ({ currentPage, perPage }: QueryCaseType) => {
  let query = ``;
  const page = currentPage ? `pagination[page]=${currentPage}&` : '';
  const pageSize = perPage ? `pagination[pageSize]=${perPage}&` : '';
  query = `${page}${pageSize}`;
  return query;
};

export const getLocationObj = (currentLocation: any) => {
  let newObj: QueryCaseType = {};

  const newQuery = currentLocation?.search ? currentLocation.search.replace('?', '') : '';
  const formatString = Object.fromEntries(new URLSearchParams(newQuery));
  if (newQuery) newObj = { ...newObj, ...formatString };

  return newObj;
};
