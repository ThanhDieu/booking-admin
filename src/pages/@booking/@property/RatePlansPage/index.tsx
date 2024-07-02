import { Radio } from 'antd';
import { PlainLayout } from 'components/layout';
import { COPYRIGHT, paths } from 'constant';
import useView from 'hooks/useView';
import React, { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { displayRole } from 'utils/view';
import RatePlanListPage from './sub/List';
import RatePlanPricePage from './sub/Prices';

const RatePlansPage = () => {
  const navigate = useNavigate();
  const view = displayRole(useView().currentView);

  const menus = [
    {
      key: `/${paths.rates}/${paths.ratePlans}/${paths.list}`,
      label: 'List',
      children: <RatePlanListPage />
    },
    {
      key: `/${paths.rates}/${paths.ratePlans}/${paths.prices}`,
      label: 'Prices',
      children: <RatePlanPricePage />
    }
  ];

  const newTabs = useMemo(() => {
    return menus.map((menu) => {
      return {
        ...menu,
        key: `/${view?.code}${menu.key}`
      };
    });
  }, [location.pathname]);

  return (
    <PlainLayout
      headerprops={{
        title: 'Rate Plans'
        // TODO
        // extra: [
        //   <Button type="primary" key="new-user-btn" icon={<PlusOutlined />}>
        //     New Rate Plan
        //   </Button>
        // ]
      }}
      footerprops={{
        children: COPYRIGHT,
        className: 'text-center'
      }}
    >
      <div className="rate-overview ">
        <div className="flex mb-[10px] p-4 gap-8">
          <Radio.Group
            options={newTabs.map((item) => ({ value: item.key, label: item.label }))}
            onChange={(e) => {
              navigate(`${e.target.value}`);
            }}
            value={location.pathname}
            optionType="button"
            buttonStyle="solid"
          />
          {/* TODO */}
          {/* <Select
            options={timeSliceOptions}
            defaultValue={timeSlice}
            onSelect={(value: string) => setTimeSlice(value)}
          /> */}
        </div>
        {newTabs
          .filter((item) => item.key === location.pathname)
          .map((item) => (
            <React.Fragment key={item.key}>{item.children}</React.Fragment>
          ))}
      </div>
    </PlainLayout>
  );
};

export default RatePlansPage;
