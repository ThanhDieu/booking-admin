import { Tabs, TabsProps } from 'antd';
import { PlainLayout } from 'components/layout';
import { policyType } from 'configs/const/general';
import { paths } from 'constant';
import { useHelmet } from 'hooks';
import useView from 'hooks/useView';
import { useLocation, useNavigate } from 'react-router-dom';
import { displayRole } from 'utils/view';
import { PolicyList } from './partials';
import { useTranslation } from 'react-i18next';

const PoliciesPage = () => {
  const { t } = useTranslation(['policies'])
  const { currentView } = useView();
  const { code: codeProperty } = displayRole(currentView);
  const navigate = useNavigate();
  const location = useLocation();

  const items: TabsProps['items'] = [
    {
      key: `/${codeProperty}/${paths.policies}/${paths.cancellation}`,
      label: t('policies:cancellation'),
      children: <PolicyList type={policyType.CANCELLATION} />
    },
    {
      key: `/${codeProperty}/${paths.policies}/${paths.noShow}`,
      label: t('policies:no_show'),
      children: <PolicyList type={policyType.NO_SHOW} />
    }
  ];

  useHelmet({
    title: `${t('policies:policies')} / ${codeProperty}`
  });

  return (
    <PlainLayout
      headerprops={{
        title: t('policies:policies')
      }}
      className={`bg-inherit`}
    >
      <Tabs
        defaultActiveKey="1"
        activeKey={location.pathname}
        items={items}
        onChange={(key: string) => navigate(`${key}`)}
      />
    </PlainLayout>
  );
};

export default PoliciesPage;
