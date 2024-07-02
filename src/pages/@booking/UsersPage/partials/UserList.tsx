/* eslint-disable @typescript-eslint/no-explicit-any */
import { EditOutlined } from '@ant-design/icons';
import { RoleType } from '@types';
import { App, Button, Table, Tag, Typography } from 'antd';
import { TagCustomComponent } from 'components/common';
import renderMenuLabel from 'components/shared/i18nextRender';
import { RoleMode, ViewMode } from 'configs/const/auth';
import { FuncType } from 'configs/const/general';
import { languages } from 'constant';
import { HORIZONTAL_SCROLL } from 'constant/size';
import { useAppSize, useAsyncAction, useDidMount } from 'hooks';
import useView from 'hooks/useView';
import { useMemo } from 'react';
import { createUserService, updateUserService } from 'services/Users';
import { UserPayload, UserType } from 'services/Users/types';
import { useAppDispatch, useAppSelector } from 'store';
import { getRoleList } from 'store/booking/Role';
import { capitalize } from 'utils/text';
import ModalUpdateUser from './ModalUpdateUser';
import { logout } from 'store/booking/Auth';

export interface UserListProps {
  currentView?: string;
  userList: UserType[];
  openModal?: string;
  setOpenModal?: React.Dispatch<React.SetStateAction<string>>;
  fetchUsers?: (queryText: string, signal?: AbortSignal | undefined) => Promise<any>;
  currentUser: UserType | undefined;
  setCurrentUser: React.Dispatch<React.SetStateAction<UserType | undefined>>;
}

function UserList(props: UserListProps) {
  const { message } = App.useApp();
  const { userList, openModal, setOpenModal, fetchUsers, currentUser, setCurrentUser } = props;
  const dispatch = useAppDispatch();
  const { data: roleList } = useAppSelector((state) => state.booking.role);
  const { profile } = useAppSelector((state) => state.booking.auth);
  const { innerAppHeight } = useAppSize();
  const { currentView } = useView();

  const [createUser, createUserState] = useAsyncAction(createUserService, {
    onSuccess: () => {
      setOpenModal && setOpenModal('');
      fetchUsers && fetchUsers('expands=roles');
      message.success('User created!', 2);
    },
    onFailed: () => {
      // setOpenModal && setOpenModal('');
      // // message.error('Failed!', 2);
    }
  });

  const [updateUser, updateUserState] = useAsyncAction(updateUserService, {
    onSuccess: () => {
      fetchUsers && fetchUsers('expands=roles');
      setOpenModal && setOpenModal('');
      message.success('User updated!', 2);
    },
    onFailed: () => {
      // setOpenModal && setOpenModal('');
      // // message.error('Failed!', 2);
    }
  });

  const handleUpdateUser = async (id: string, payload: UserPayload) => {
    await updateUser(id, payload)
    if (id === profile?.userId
      && payload?.roles?.[0] !== profile?.roles?.[0]?.roleId) {
      setTimeout(() => {
        dispatch(logout())
      }, 2000)
    }
  }


  const checkRoles = profile?.roles?.[0]?.extendedData?.priority || RoleMode.HotelAdmin;

  const columns: any = useMemo(() => {
    const newArr = [
      {
        title: renderMenuLabel('table.name', 'common'),
        key: 'name',
        dataIndex: 'name'
      },
      {
        title: renderMenuLabel('table.username', 'common'),
        key: 'username',
        dataIndex: 'username'
      },

      {
        title: renderMenuLabel('table.roles', 'common'),
        key: 'roles',
        dataIndex: 'roles',
        render: (value: RoleType[]) => {
          return value?.map((role, key) => (
            <TagCustomComponent
              key={key}
              color={role.color}
              value={capitalize(role?.name?.replaceAll('_', ' '))}
            />
          ));
        }
      },
      {
        title: renderMenuLabel('form.language', 'common'),
        key: 'language',
        dataIndex: 'language',
        render: (language: string) => (
          <Typography.Text>{languages[language as keyof typeof languages]}</Typography.Text>
        )
      },
      {
        title: renderMenuLabel('table.property', 'common'),
        key: 'property',
        dataIndex: ['property', 'name'],
        render: (value: string) => value && <Tag color="blue">{value}</Tag>
      },
      {
        title: renderMenuLabel('table.action', 'common'),
        key: 'action',
        align: 'right',
        width: 200,
        render: (_: any, record: UserType) => (
          <div className="flex justify-end">
            <Button
              type="link"
              icon={<EditOutlined />}
              disabled={
                !!(
                  record?.roles?.[0]?.extendedData?.priority &&
                  checkRoles > record?.roles?.[0]?.extendedData?.priority
                )
              }
              onClick={() => {
                setCurrentUser(record);
                setOpenModal && setOpenModal(FuncType.UPDATE);
              }}
            />
          </div>
        )
      }
    ];
    if (currentView !== ViewMode?.Account) {
      return newArr.filter((item) => item.key !== 'property');
    }
    return newArr;
  }, [currentView]);

  useDidMount((controller) => {
    if (!roleList?.length) dispatch(getRoleList({ signal: controller?.signal }));
  });

  return (
    <>
      <Table
        rowKey="userId"
        columns={columns}
        dataSource={userList}
        pagination={false}
        scroll={{
          y: innerAppHeight - 200,
          x: HORIZONTAL_SCROLL
        }}
      />
      {(openModal === FuncType.UPDATE || openModal === FuncType.CREATE) && (
        <ModalUpdateUser
          userDetail={openModal === FuncType.UPDATE ? currentUser : undefined}
          createUser={createUser}
          updateUser={handleUpdateUser}
          roleList={roleList}
          openModal={openModal && openModal}
          onChangeModal={() => setOpenModal && setOpenModal('')}
          loading={createUserState.loading || updateUserState.loading}
        />
      )}
    </>
  );
}

export default UserList;
