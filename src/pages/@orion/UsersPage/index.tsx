import { PlusOutlined } from '@ant-design/icons';
import { Button, Spin, Tabs, TabsProps } from 'antd';
import { PlainLayout } from 'components/layout';
import { ViewMode } from 'configs/const/auth';
import { FuncType } from 'configs/const/general';
import { paths } from 'constant';
import { useAsyncAction, useDataDisplayV2, useDidMount, useHelmet } from 'hooks';
import useView from 'hooks/useView';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { getAllUsersService } from 'services/Users';
import { UserType } from 'services/Users/types';
import { partition } from 'utils/array';
import { QueryCaseType, queryCase } from 'utils/queryParams';
import { UserList } from './partials';

const UsersPage = () => {
  const { t } = useTranslation(['common', 'user']);
  const [openModal, setOpenModal] = useState<string>('');
  const navigate = useNavigate();
  const { currentView, currentViewObj } = useView();
  const [locationCurrent, setLocationCurrent] = useState<QueryCaseType>({
    currentPage: 1,
    perPage: 200,
    expands: 'roles'
  });
  const [currentUser, setCurrentUser] = useState<UserType | undefined>(undefined);

  const [fetchUsers, stateAllUser] = useAsyncAction(getAllUsersService);

  //  pagination
  const handleChangeLocation = (
    {
      currentPage = locationCurrent.currentPage,
      perPage = locationCurrent.perPage,
      expands = locationCurrent.expands
    }: QueryCaseType,
    controller?: AbortController
  ) => {
    const query = queryCase({
      currentPage,
      perPage,
      expands
    });
    fetchUsers(query, controller?.signal);
    navigate(
      `${currentView !== ViewMode.Account ? `/${currentViewObj?.code}` : ``}/${
        paths.users
      }?${query}`
    );
    setLocationCurrent({
      ...locationCurrent,
      currentPage
    });
  };

  useDidMount((controller) => {
    handleChangeLocation({}, controller);
  });

  const userList = useDataDisplayV2<UserType>(stateAllUser);

  const [activeList, deactivateList] = partition<UserType>(
    userList?.list,
    (item) => item?.enabled === true
  );

  const items: TabsProps['items'] = [
    {
      key: '1',
      label: t('user:user'),
      children: (
        <UserList
          currentView={currentView}
          userList={activeList}
          openModal={openModal}
          setOpenModal={setOpenModal}
          fetchUsers={fetchUsers}
          currentUser={currentUser}
          setCurrentUser={setCurrentUser}
        />
      )
    },
    {
      key: '2',
      label: t('user:deactivated'),
      children: (
        <UserList
          openModal={openModal}
          setOpenModal={setOpenModal}
          currentView={currentView}
          userList={deactivateList}
          fetchUsers={fetchUsers}
          currentUser={currentUser}
          setCurrentUser={setCurrentUser}
        />
      )
    }
  ];

  useHelmet({
    title: t('user:user_page')
  });

  return (
    <PlainLayout
      headerprops={{
        title: t('user:title'),
        extra: [
          <Button
            type="primary"
            key="new-user-btn"
            icon={<PlusOutlined />}
            onClick={() => setOpenModal(FuncType.CREATE)}
          >
            {t('button.new_pageName', { pageName: t('user:user') })}
          </Button>
        ]
      }}
      className={`bg-inherit`}
    >
      <Spin spinning={stateAllUser.loading}>
        <Tabs defaultActiveKey="1" items={items} />
      </Spin>
    </PlainLayout>
  );
};

export default UsersPage;
