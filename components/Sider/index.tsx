import { Avatar, Layout, Typography, MenuProps, Menu } from 'antd';
import {
  UserOutlined,
  AreaChartOutlined,
  LogoutOutlined,
  GithubOutlined,
  MenuOutlined,
  CloseOutlined,
  ExclamationCircleOutlined,
} from '@ant-design/icons';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { pocketbaseClient, useNotification } from '../../utils';

export interface SiderProps {}

type MenuItem = Required<MenuProps>['items'][number];

function getItem(
  label: React.ReactNode,
  key: React.Key,
  icon?: React.ReactNode,
  children?: MenuItem[],
  type?: 'group'
): MenuItem {
  return {
    key,
    icon,
    children,
    label,
    type,
  } as MenuItem;
}

const menuItems: MenuProps['items'] = [
  getItem('Habits', 'habits', <AreaChartOutlined />),
  getItem('Profile', 'profile', <UserOutlined />),
  getItem('Sign-out', 'signout', <LogoutOutlined />),
  getItem('Source', 'about', <GithubOutlined />),
];

export default function Sider(props: SiderProps) {
  const [sidebarCollapsed, setSidebarCollapsed] = useState<boolean>(true);
  const [username, setUsername] = useState<string>();
  const router = useRouter();
  const [avt, setAvt] = useState('');
  const [openNotification, contextHolder] = useNotification();

  const onMenuItemClicked: MenuProps['onClick'] = (inf) => {
    switch (inf.key) {
      case 'habits':
        setSidebarCollapsed(true);
        router.push('/habits');
        break;
      case 'profile':
        setSidebarCollapsed(true);
        router.push('/profile');
        break;
      case 'signout':
        try {
          setSidebarCollapsed(true);
          pocketbaseClient.authStore.clear();
          router.push('/sign-in');
        } catch (err) {
          openNotification(
            'Error',
            'Could not sign you out',
            <ExclamationCircleOutlined />
          );
        }
        break;
      case 'about':
        window.open(
          'https://github.com/DustinDust/Nextjs-HabitTracker',
          '_blank'
        );
        break;
    }
  };

  useEffect(() => {
    setUsername(pocketbaseClient.authStore.model?.name);
    setAvt(pocketbaseClient.authStore.model?.avatar);
  }, [setUsername, setAvt]);

  return (
    <>
      {contextHolder}
      <Layout.Sider
        style={{
          // background: 'white',
          boxShadow:
            '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
          height: '100vh',
          position: 'fixed',
          top: 0,
          left: 0,
          bottom: 0,
          zIndex: 20,
        }}
        trigger={sidebarCollapsed ? <MenuOutlined /> : <CloseOutlined />}
        width='230px'
        collapsible
        defaultCollapsed={sidebarCollapsed}
        collapsed={sidebarCollapsed}
        collapsedWidth='0'
        onCollapse={(collapsed) => {
          setSidebarCollapsed(collapsed);
        }}
        theme='light'
      >
        <div className='flex flex-col items-center justify-center px-6 py-4 gap-2'>
          {avt ? (
            <Avatar src={avt} alt={'PFP'} size='large' />
          ) : (
            <Avatar
              alt={'PFP'}
              size='large'
              style={{
                backgroundColor: 'black',
                color: 'white',
              }}
            >
              {username?.toUpperCase().at(0)}
            </Avatar>
          )}
          <Typography.Text strong>{username}</Typography.Text>
        </div>
        <Menu items={menuItems} mode='inline' onClick={onMenuItemClicked} />
      </Layout.Sider>
      {!sidebarCollapsed ? (
        <div
          className='z-10 fixed top-0 left-0 min-h-screen min-w-[100vw] opacity-10 bg-black'
          onClick={() => {
            setSidebarCollapsed(true);
          }}
        />
      ) : undefined}
    </>
  );
}
