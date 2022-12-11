import Image from 'next/image';
import LayoutContainer from '../../components/Layout';
import pocketbaseClient from '../../utils/pocketbase';
import { Avatar } from 'antd';
import { UserOutlined } from '@ant-design/icons';
import { useEffect, useState } from 'react';

export default function UserHomePage() {
  const [usernameOrEmail, setUsernameOrEmail] = useState();
  const [avt, setAvt] = useState('');
  useEffect(() => {
    setUsernameOrEmail(pocketbaseClient.authStore.model?.email);
    setAvt(pocketbaseClient.authStore.model?.avatar);
  }, [setUsernameOrEmail, setAvt]);
  return (
    <>
      <LayoutContainer>
        <h1>Hello, user {usernameOrEmail}</h1>
        {avt ? (
          <Avatar size={'large'} src={avt} shape='square' />
        ) : (
          <Avatar icon={<UserOutlined />} size='large' shape='square' />
        )}
      </LayoutContainer>
    </>
  );
}
