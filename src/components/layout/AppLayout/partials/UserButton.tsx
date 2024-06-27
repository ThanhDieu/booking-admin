/* eslint-disable @typescript-eslint/no-explicit-any */
import { LogoutOutlined, UserOutlined } from '@ant-design/icons';
import { Avatar, Button, Divider, Menu as MenuAntd, Popover, Space, Tag, Typography } from 'antd';
import XIcon from 'components/shared/Icon';
import { ViewMode } from 'configs/const/auth';
import { DATE_TIME_FORMAT_2, TIME_FORMAT_3 } from 'configs/const/format';
import { MenuItem } from 'configs/sidemenus';
import { paths } from 'constant';
import localesOptions from 'constant/data/localeType';
import dayjs from 'dayjs';
import { useDidMount } from 'hooks';
import useView from 'hooks/useView';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { PropertyDetailAppType } from 'services/Properties/type';
import { useAppDispatch, useAppSelector } from 'store';
import { initialUserSessionAction, logout } from 'store/orion/Auth';
import { loadAccessToken } from 'utils/storage';
import { capitalize } from 'utils/text';
import('dayjs/locale/de');

const { Text } = Typography;

function UserButton() {
  const { i18n, t } = useTranslation(['sidebar']);
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { profile } = useAppSelector((state) => state.orion.auth);
  const { detail: propertyDetail } = useAppSelector((state) => state.orion.property);
  const { currentView } = useView();
  const [currentTime, setCurrentTime] = useState(dayjs());
  const [open, setOpen] = useState(false);
  const currentLanguage = i18n.language;

  // TODO
  const handleLogout = () => {
    dispatch(logout());
    navigate(`/${paths.login}`);
  };

  const handleOpenChange = (newOpen: boolean) => {
    setOpen(newOpen);
  };

  const menuItems: MenuItem[] = [
    // {
    //   key: 'profile',
    //   label: 'Profile',
    //   icon: <ProfileOutlined />,
    //   onClick: () => handleNavigate(`${paths.profile}/${paths.general}`)
    // },
    // {
    //   key: 'setting',
    //   label: 'Settings',
    //   icon: <SettingOutlined />,
    //   onClick: () => handleNavigate(`${paths.setting}/${paths.notification}`)
    // },
    // {
    //   key: 'help',
    //   label: 'Help',
    //   icon: <InfoCircleOutlined />
    // },
    {
      key: 'language',
      label: t('sidebar:user_box.change_language'),
      icon: <XIcon name="global" />,
      children: Object.keys(localesOptions).map((locale) => {
        return {
          key: locale,
          label: localesOptions[locale].title,
          icon: <></>,
          onClick: () => {
            i18n.changeLanguage(locale);
          }
        };
      })
    },
    null,
    {
      key: 'logout',
      label: t('sidebar:user_box.logout'),
      icon: <LogoutOutlined />,
      onClick: handleLogout
    }
  ];

  // LIFE

  useDidMount(() => {
    const token = loadAccessToken();
    if (token && !profile) dispatch(initialUserSessionAction(token));
  });

  useEffect(() => {
    let interval: any;
    if (open) {
      interval = setInterval(() => {
        setCurrentTime(dayjs());
      }, 1000);
    }

    // Xóa interval khi open chuyển sang false
    return () => {
      clearInterval(interval);
    };
  }, [open, currentTime]);

  const renderTime = (property?: PropertyDetailAppType) => {
    return (
      <Space direction="vertical" size="small">
        <Typography.Text>
          {property
            ? t('sidebar:user_box.time_mode_properties')
            : t('sidebar:user_box.time_mode_browser')}
        </Typography.Text>
        <Space size="small" align="center">
          <Typography.Title level={3} className="mb-0">
            {property
              ? dayjs(currentTime).tz(property.data?.timeZone).locale(currentLanguage).format(TIME_FORMAT_3)
              : dayjs(currentTime).locale(currentLanguage).format(TIME_FORMAT_3)}
          </Typography.Title>
          <Typography.Text>
            {property
              ? dayjs(currentTime).tz(property.data?.timeZone).locale(currentLanguage).format('Z')
              : dayjs().format('Z')}
          </Typography.Text>
        </Space>

        <Typography.Text>
          {property
            ? dayjs(currentTime).tz(property.data?.timeZone).locale(currentLanguage).format(DATE_TIME_FORMAT_2)
            : dayjs(currentTime).locale(currentLanguage).format(DATE_TIME_FORMAT_2)}
        </Typography.Text>
      </Space>
    );
  };

  return (
    <Popover
      placement="bottomRight"
      title={<Space className='flex justify-between items-center'>{capitalize(profile?.name || '')}
        {profile?.roles?.[0]?.name && <Tag>{capitalize(profile.roles?.[0]?.name.replaceAll('_', ' '))}</Tag>}
      </Space>}
      content={
        <>
          <Space direction="vertical" size="small">
            {profile?.email && <Typography.Text>{profile.email}</Typography.Text>}

            <Typography.Text>{profile?.username}</Typography.Text>
          </Space>
          <Divider className="my-3 " />
          {renderTime(currentView === ViewMode.Account ? undefined : propertyDetail)}
          <Divider className="my-3 " />

          <MenuAntd items={menuItems} defaultSelectedKeys={[i18n.language]} />
          {/* <Menu items={menuItems} /> */}
        </>
      }
      trigger="click"
      open={open}
      onOpenChange={handleOpenChange}
    >
      <Button type="text" className="h-[45px] px-2">
        {profile?.avatar ? <Avatar src={profile.avatar} /> : <Avatar icon={<UserOutlined size={24} className="text-[16px]" />} />}
        <Text className="ps-3">{profile?.username}</Text>
      </Button>
    </Popover>
  );
}

export default UserButton;
