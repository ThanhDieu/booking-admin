import { SearchOutlined } from '@ant-design/icons';
import { Button, Image, Layout, Menu, Modal, Space } from 'antd';
import Sider from 'antd/es/layout/Sider';
import { Content, Header } from 'antd/es/layout/layout';
import logo from 'assets/images/logo-sm.png';
import clsx from 'clsx';
import { GlobalSearchComponent } from 'components/common';
import { Breadcrumb } from 'components/shared';
import { ViewMode } from 'configs/const/auth';
import { ThemeType } from 'configs/const/general';
import menus, { propertyItems } from 'configs/sidemenus';
import { paths } from 'constant';
import { useDidMount, useImagePreloader } from 'hooks';
import useView from 'hooks/useView';
import { useEffect, useMemo, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { MediaStrapiType } from 'services/@strapi/type';
import { useAppDispatch, useAppSelector } from 'store';
import { selectTheme } from 'store/app/theme';
import { updateView } from 'store/booking/Auth';
import { getCampaignListThunk } from 'store/booking/Mailchimp';
import { getMediaDataAction } from 'store/booking/Media';
import { getPropertyDetails } from 'store/booking/Property';
import { getAllSettingLanguage } from 'store/booking/SettingLanguage';
import { fallbackImageStrapiResolution } from 'utils/media';
import { saveThemeToStorage } from 'utils/storage';
import RanderRoleLayout from '../RoleLayout';
import './AppLayout.style.less';
import { SwitchTheme, UserButton } from './partials';

export interface AppLayoutProps {
  children?: React.ReactElement;
}

const XLayout: React.FC<AppLayoutProps> = (props) => {
  const { children } = props;
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useAppDispatch();
  const { currentView, currentViewObj, allowedViewAll, allowedApprove } = useView();

  const { selected } = useAppSelector((state) => state.app.theme);
  const { profile } = useAppSelector((state) => state.booking.auth);
  const mediaData: MediaStrapiType[] = useAppSelector((state) => state.booking.media.data);

  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [collapsed, setCollapsed] = useState<boolean>(false);
  const [selectedMenu, setSelectedMenu] = useState<string[]>();

  //ROLE
  const renderedRoleComponent = RanderRoleLayout.selectViewBox(collapsed);

  const handleNavigate = ({ key: path }: { key: React.Key }) => {
    if (currentView === ViewMode.Account) {
      navigate(path as string);
    } else {
      const code = currentViewObj?.code || '';
      navigate((path as string).replace(':code', code || ''));
    }
  };

  const handleToggle = (value: boolean) => setCollapsed(value);

  const showModal = () => {
    setIsModalOpen(true);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  useDidMount(async (controller) => {
    await dispatch(getAllSettingLanguage({ signal: controller?.signal }));
    if (currentView === ViewMode.Account) dispatch(getCampaignListThunk());
    dispatch(getMediaDataAction());
  });

  useImagePreloader(
    mediaData
      ?.slice(0, 24)
      .map((item) =>
        item?.url
          ? `${item?.formats && Object.keys(item?.formats).length
            ? fallbackImageStrapiResolution(item.formats) || []
            : item.url
          }`
          : '/no-image.png'
      ),
    import.meta.env.REACT_APP_BASE_URL_STRAPI
  );

  useEffect(() => {
    const pathName = location.pathname.slice(1);
    if (currentView && currentView !== ViewMode.Account) {
      const code = currentViewObj?.code;
      if (code) {
        const arrayPathname = pathName.replace(code, ':code').split('/');

        const isStringInObject = Object.values(paths).includes(
          arrayPathname[arrayPathname.length - 2]
        );
        const isStringInObject1 = !Object.values(paths).includes(
          arrayPathname[arrayPathname.length - 1]
        );

        if (isStringInObject && isStringInObject1) {
          setSelectedMenu([
            pathName.replace(code, ':code').split('/').slice(0, -1).join('/').replaceAll(' ', '')
          ]);
        } else {
          setSelectedMenu([pathName.replace(code, ':code')]);
        }
      }
    } else {
      setSelectedMenu([pathName]);
    }
  }, [location, currentView]);
  const newMenus = useMemo(() => {
    if (allowedViewAll) {
      if (currentView === ViewMode.Account) {
        return menus;
      }
      return allowedApprove
        ? propertyItems
        : propertyItems?.filter((item) => item?.key !== `${paths.propertyCode}/${paths.tasks}`);
    }
    return allowedApprove
      ? propertyItems
      : propertyItems?.filter((item) => item?.key !== `${paths.propertyCode}/${paths.tasks}`);
  }, [currentView, allowedViewAll, allowedApprove]);

  useDidMount(() => {
    if (!allowedViewAll && profile?.property) {
      dispatch(updateView(`${profile.property?.extId}@${profile.property?.name}`));
      if (profile.property?.extId) {
        dispatch(getPropertyDetails({ id: profile.property?.extId }));
      }
    }
  }, [allowedViewAll, profile?.property]);

  useDidMount(() => {
    if (
      !allowedViewAll &&
      profile?.property?.extId &&
      !location?.pathname?.includes(profile?.property?.extId)
    ) {
      navigate(`/${profile?.property?.extId}`);
    }
  }, [allowedViewAll, profile?.property, location]);

  return (
    <Layout className="flex-row h-screen">
      <Sider
        collapsible
        collapsed={collapsed}
        onCollapse={handleToggle}
        className="shadow-[0_2px_8px_0px_rgba(0,0,0,0.15)] !overflow-scroll"
      >
        <Space className="pl-[16px] px-[12px] w-full gap-0 h-[48px] shadow-[inset_0px_-1px_0px_#F0F0F0] items-center">
          <Space
            className={clsx(
              collapsed && 'w-8',
              'w-8 h-8 m-auto flex items-center',
              selected === ThemeType.DARK && 'bg-white rounded-full'
            )}
            size="small"
          >
            <Image src={logo} alt="avatar" className="w-6 h-6 flex-1 " preview={false} />
          </Space>

          {/* ROLE */}
          {renderedRoleComponent}
        </Space>
        <div className="grow no-scrollbar flex flex-col">
          <Menu
            defaultSelectedKeys={[paths.home]}
            mode="inline"
            onClick={handleNavigate}
            items={newMenus}
            className="h-full border-none "
            selectedKeys={selectedMenu}
          />
          <div className="mb-12">
            <SwitchTheme
              isCollapse={collapsed}
              onChangeTheme={() => {
                const seletedTheme =
                  selected === ThemeType.DARK ? ThemeType.DEFAULT : ThemeType.DARK;
                dispatch(selectTheme(seletedTheme));
                saveThemeToStorage(seletedTheme);
              }}
            />
          </div>
        </div>
      </Sider>
      <Layout className="site-layout">
        <Header className="site-layout-header shadow-[inset_0px_-1px_0px_#F0F0F0] ">
          {/* Left section */}
          <div className="flex flex-col">
            <Breadcrumb />
          </div>
          {/* Right section */}
          <div className="flex gap-1 items-center justify-center">
            <Button shape="circle" icon={<SearchOutlined />} onClick={showModal} />
            {isModalOpen && (
              <Modal
                className="w-[700px] "
                open={isModalOpen}
                footer={false}
                onCancel={handleCancel}
                maskClosable={false}
              >
                <GlobalSearchComponent onClickResult={handleCancel} />
              </Modal>
            )}
            <UserButton />
          </div>
        </Header>
        <Content className="flex flex-col my-0 mx-[16px] max-w-[1600px]">{children}</Content>
      </Layout>
    </Layout>
  );
};

export default XLayout;
