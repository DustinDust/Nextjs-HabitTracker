import Head from 'next/head';
import { Admin, Record } from 'pocketbase';
import { ExclamationCircleOutlined } from '@ant-design/icons';
import { useState, useEffect } from 'react';
import pocketbaseClient from '../../utils/pocketbase';
import useNotification from '../../utils/useNotification';
import { useRouter } from 'next/router';
import { Layout, Card, Typography } from 'antd';
import Sider from '../../components/Sider';
import { useMedia } from 'react-use';
import { breakPoints } from '../../utils';
import UserProfile from '../../components/UserProfile';

export type AuthStoreType = Record | Admin;

export default function ProfilePage() {
  const isLg = useMedia(`(min-width: ${breakPoints.lg}px)`, false);
  const router = useRouter();
  const [user, setUser] = useState<AuthStoreType>();
  const [openNotification, contextHolder] = useNotification();
  const [loading, setLoading] = useState<boolean>(false);
  const [habitNum, setHabitNum] = useState<number>(0);

  useEffect(() => {
    if (pocketbaseClient.authStore.model) {
      setUser(pocketbaseClient.authStore.model);
      setLoading(true);
      pocketbaseClient
        .collection('habits')
        .getList(1, 1, {
          filter: `user="${user?.id}"`,
        })
        .then((data) => {
          setHabitNum(data.totalItems);
        })
        .catch((err) => {
          console.log(err);
        })
        .finally(() => setLoading(false));
    } else {
      setLoading(true);
      pocketbaseClient
        .collection('users')
        .authRefresh()
        .then((data) => {
          setUser(data.record);
          setLoading(false);
        })
        .catch((err) => {
          openNotification(
            'Unauthorized',
            'We will naviate you to the authentication site shortly',
            <ExclamationCircleOutlined />,
            () => {
              console.log(err);
              router.push('/sign-in');
            },
            1
          );
        });
    }
  }, [openNotification, setUser, router, user?.id]);

  return (
    <>
      <Head>
        <title>{user?.name}&apos;s profile</title>
      </Head>
      {contextHolder}
      <div className='font-mulish'>
        <Layout hasSider style={{ fontFamily: 'inherit' }}>
          <Sider />
          <Layout.Content
            style={{ padding: isLg ? '2rem 4rem' : '1rem', minHeight: '100vh' }}
          >
            <Card
              style={{ minWidth: '100%', minHeight: '100%', cursor: 'default' }}
              bordered={false}
              title={
                <Typography.Title level={isLg ? 3 : 4}>
                  Your profile
                </Typography.Title>
              }
            >
              <UserProfile user={user} loading={loading} habitsNum={habitNum} />
            </Card>
          </Layout.Content>
        </Layout>
      </div>
    </>
  );
}
