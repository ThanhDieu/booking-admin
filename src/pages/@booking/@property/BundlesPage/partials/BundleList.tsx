/* eslint-disable @typescript-eslint/no-explicit-any */
import { App, Checkbox, List } from 'antd';
import { DisplayIBEOptions } from 'configs/const/general';
import { paths } from 'constant';
import { useAsyncAction } from 'hooks';
import { useNavigate } from 'react-router-dom';
import { deleteBundleService, duplicateBundleService, updateBundleService } from 'services/Bundle';
import { BundleListType } from 'services/Bundle/type';
import { useAppSelector } from 'store';
import { QueryCaseType } from 'utils/queryParams';
import { capitalize } from 'utils/text';
import { displayRole } from 'utils/view';
import BundleItem from './BundleItem';

interface BundleProps {
  currentView: any;
  holidayPackage: boolean;
  type: string;
  currentLocation: QueryCaseType;
  onChangeLocation: ({
    currentPage,
    arrival,
    departure,
    adults,
    propertyId,
    perPage,
    isTemplate,
    search
  }: QueryCaseType) => void;
  onSelect: React.Dispatch<React.SetStateAction<string[] | undefined>>;
  selectedValue?: string[];
  perpageDefault: number;
  loading: boolean;
  data: {
    list: BundleListType[];
    pagination: PaginationType | undefined;
  };
}

const BundleList = ({
  currentView,
  holidayPackage,
  type: currentTypeBundle,
  currentLocation,
  onChangeLocation: handleChangeLocation,
  onSelect: handleSelectBundles,
  selectedValue,
  perpageDefault,
  loading,
  data: bundles
}: BundleProps) => {
  //* Declare variable global
  const { code: codeProperty } = displayRole(currentView);
  const navigate = useNavigate();
  const { message } = App.useApp();
  const { data: mediaData } = useAppSelector((state) => state.booking.media);

  //* End declare variable global

  //* Handle api service
  // Action
  /**
   * @param propertyId
   * @param currentPage
   * @param arrival
   * @param departure
   * @param adults
   * @param perPage
   */
  const [updateBundle, stateUpdate] = useAsyncAction(updateBundleService, {
    onSuccess: () => {
      handleChangeLocation({ ...currentLocation });
      message.success('Success!', 2);
    },
    onFailed: (error: any) => {
      if (error) message.error(capitalize(error?.message), 3);
    }
  });

  const [addMorePeriodBundle] = useAsyncAction(duplicateBundleService, {
    onSuccess: () => {
      handleChangeLocation({ ...currentLocation });
      message.success('Success!', 2);
    },
    onFailed: () => {
      message.error('Fail!', 2);
    }
  });

  const [deleteBundle] = useAsyncAction(deleteBundleService, {
    onSuccess: () => {
      handleChangeLocation({ ...currentLocation });
      message.success('Success!', 2);
    },
    onFailed: () => {
      message.error('Fail!', 2);
    }
  });

  const handleDuplicate = (isTemplate: boolean, item?: BundleListType) => {
    if (item) {
      if (!isTemplate) {
        navigate(
          `/${codeProperty}/${paths.bundles}/${paths.bundlesOverview}/${paths.duplicate}/${item?.bundleId}`,
          { replace: true }
        );
      } else {
        navigate(`${paths.duplicate}/${item?.bundleId}`);
      }
    }
  };

  const handleAddMorePeriod = (
    id: string,
    payload: {
      start: number;
      end: number;
    }[]
  ) => {
    addMorePeriodBundle(id, { period: payload });
  };

  const handleDelete = (id: string) => {
    deleteBundle(id);
  };

  const handleOnline = (item: BundleListType) => {
    const payload = {
      ...item,
      title: item?.title ?? '',
      description: (item?.description as any) ?? '',
      activityIds: item?.activities?.map((i) => i.activityId ?? ''),
      landscapeId: item?.landscape?.landscapeId,
      tagIds: item?.tags?.map((i) => i.tagId ?? ''),
      online: !item?.online,
      isHomePage: !item?.online ? item?.isHomePage : false,
      isHotelPage: !item?.online ? item?.isHotelPage : false,
      isTopicPage: !item?.online ? item?.isTopicPage : false
    };
    updateBundle(item?.bundleId, payload);
  };

  const handleArchiveItem = (item: BundleListType) => {
    const payload = {
      ...item,
      title: item?.title ?? '',
      description: (item?.description as any) ?? '',
      activityIds: item?.activities?.map((i) => i.activityId ?? ''),
      landscapeId: item?.landscape?.landscapeId,
      tagIds: item.tags?.map((i) => i.tagId ?? ''),
      isArchive: !item?.isArchive
    };
    updateBundle(item?.bundleId, payload);
  };
  //* End handle interface

  const onHandleDisplay = (checked: boolean, option: string, item: BundleListType) => {
    const displayDefine = () => {
      switch (option) {
        case DisplayIBEOptions.HOME:
          return 'isHomePage';
        case DisplayIBEOptions.HOTEL:
          return 'isHotelPage';
        default:
          return 'isTopicPage';
      }
    };

    const payload = {
      ...item,
      title: item.title ?? '',
      description: (item.description as any) ?? '',
      activityIds: item.activities.map((i) => i.activityId ?? ''),
      landscapeId: item.landscape?.landscapeId,
      tagIds: item.tags.map((i) => i.tagId ?? ''),
      [displayDefine() as any]: checked
    };
    updateBundle(item?.bundleId, payload);
  };

  return (
    <>
      <Checkbox.Group
        className="w-full"
        onChange={(list) => handleSelectBundles(list as any as string[])}
        value={selectedValue}
      >
        <List
          className="bundle-list w-full"
          loading={loading || stateUpdate?.loading}
          itemLayout="horizontal"
          size="large"
          pagination={
            !bundles?.pagination?.total ||
              (bundles?.pagination?.total && bundles?.pagination?.total < perpageDefault)
              ? false
              : {
                pageSize: currentLocation?.perPage || perpageDefault,
                total: bundles?.pagination?.total ? Number(bundles?.pagination.total) : 1,
                showSizeChanger: false,
                disabled: loading,
                current: currentLocation.currentPage,
                onChange: (page: number) => {
                  handleChangeLocation({
                    ...currentLocation,
                    currentPage: page
                  });
                }
              }
          }
          dataSource={bundles.list as BundleListType[]}
          renderItem={(item) => {
            const foundImage = mediaData?.find((value) => value.url === item.media[0]);

            return (
              <BundleItem
                loading={stateUpdate.loading}
                holidayPackage={holidayPackage}
                type={currentTypeBundle}
                data={item}
                image={foundImage}
                onDelete={handleDelete}
                onDuplicate={handleDuplicate}
                onAddMorePeriod={handleAddMorePeriod}
                onOnline={handleOnline}
                onHandleDisplay={onHandleDisplay}
                handleArchiveItem={handleArchiveItem}
              />
            );
          }}
        />
      </Checkbox.Group>
    </>
  );
};

export default BundleList;
