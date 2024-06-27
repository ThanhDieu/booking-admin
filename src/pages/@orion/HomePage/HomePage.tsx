import { PlainLayout } from 'components/layout';
import ProtectedComponent from 'components/wrapper/ProtectedComponent';
import { COPYRIGHT } from 'constant';
import { useHelmet } from 'hooks';
import useView from 'hooks/useView';
import { useTranslation } from 'react-i18next';
import { BundleIBEDisplayList, TaskList } from './partials';

export interface HomePageProps {}

const Page: React.FC<HomePageProps> = () => {
  const { allowedApprove } = useView();
  const { t } = useTranslation('dashboard');
  useHelmet({
    title: 'Home Page'
  });

  return (
    <PlainLayout
      headerprops={{
        title: t('dashboard_page.title')
      }}
      footerprops={{
        children: COPYRIGHT,
        className: 'text-center'
      }}
      className="bg-inherit"
    >
      <div className="flex gap-9 w-full">
        <div className="flex flex-col gap-9 ">
          <div className="max-w-[600px] w-full min-w-[400px]">
            <BundleIBEDisplayList />
          </div>
          {/* <ProtectedComponent renderIfTrue={() => currentView === ViewMode.Account && allowedViewAll} >
            <div className="max-w-[600px]">
              <MaintenanceChart />
            </div>
          </ProtectedComponent> */}
        </div>
        <ProtectedComponent renderIfTrue={() => allowedApprove}>
          <div className="w-full max-w-[400px]">
            <TaskList />
          </div>
        </ProtectedComponent>
      </div>
    </PlainLayout>
  );
};

export default Page;
