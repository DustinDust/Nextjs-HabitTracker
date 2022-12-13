import { Avatar, Layout, Typography } from 'antd';
import { useState, useEffect } from 'react';
import pocketbaseClient from '../../utils/pocketbase';
export interface SiderProps {}

export default function Sider(props: SiderProps) {
  const [sidebarCollapsed, setSidebarCollapsed] = useState<boolean>(true);

  const [username, setUsername] = useState<string>();
  const [avt, setAvt] = useState('');

  useEffect(() => {
    setUsername(pocketbaseClient.authStore.model?.username);
    setAvt(pocketbaseClient.authStore.model?.avatar);
  }, [setUsername, setAvt]);

  return (
    <>
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
        collapsible
        defaultCollapsed={sidebarCollapsed}
        collapsed={sidebarCollapsed}
        collapsedWidth='0'
        onCollapse={(collapsed) => {
          setSidebarCollapsed(collapsed);
        }}
      >
        <div className='flex flex-col items-center justify-center px-6 py-4 gap-2'>
          {avt ? (
            <Avatar src={avt} alt={'PFP'} size='large' />
          ) : (
            <Avatar
              alt={'PFP'}
              size='large'
              style={{ backgroundColor: 'white', color: 'CaptionText' }}
            >
              {username?.toUpperCase().at(0)}
            </Avatar>
          )}
          <Typography.Text style={{ color: 'white' }} strong>
            {username}
          </Typography.Text>
        </div>
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
