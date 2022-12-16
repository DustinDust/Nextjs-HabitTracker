import pocketbaseClient from '../../utils/pocketbase';
import { notification, Card, Layout, Typography, Skeleton } from 'antd';
import { useEffect, useState } from 'react';
import Head from 'next/head';
import { useMedia } from 'react-use';
import Sider from '../../components/Sider';
import HabitTable from '../../components/HabitTable';
import { breakPoints } from '../../utils/breakpoint';
import {
  CheckCircleOutlined,
  ExclamationCircleOutlined,
} from '@ant-design/icons';
import { useRouter } from 'next/router';
import useNotification from '../../utils/useNotification';

export default function UserHomePage() {
  const isLg = useMedia(`(min-width: ${breakPoints.lg}px)`, false);
  const [usernameOrEmail, setUsernameOrEmail] = useState<string>('');
  const [displayName, setDisplayName] = useState<string>('');
  const [openNotification, ContextHolder] = useNotification();
  const [loading, setLoading] = useState<boolean>();
  const router = useRouter();

  useEffect(() => {
    const hasUser =
      pocketbaseClient.authStore.isValid &&
      pocketbaseClient.authStore.token &&
      pocketbaseClient.authStore.model;
    if (!hasUser) {
      setLoading(true);
      pocketbaseClient
        .collection('user')
        .authRefresh()
        .then((data) => {
          openNotification(
            'Success',
            `Successfully sign in as ${data.record.username}`,
            <CheckCircleOutlined />
          );
          setUsernameOrEmail(pocketbaseClient.authStore.model?.username);
          setDisplayName(pocketbaseClient.authStore.model?.name);
          setLoading(true);
        })
        .catch((e) => {
          openNotification(
            'Sign-in error',
            `Some error had occurred while we tried to sign you in, please sign-in againm -- ${e}`,
            <ExclamationCircleOutlined />,
            () => {
              router.push('/sign-in');
            },
            1
          );
        });
    } else {
      setUsernameOrEmail(pocketbaseClient.authStore.model?.username);
      setDisplayName(pocketbaseClient.authStore.model?.name);
    }
  }, [
    router,
    openNotification,
    setUsernameOrEmail,
    setDisplayName,
    setLoading,
  ]);

  return (
    <>
      <Head>
        <title>Habits</title>{' '}
      </Head>
      {ContextHolder}
      <div className='font-mulish'>
        <Layout hasSider style={{ fontFamily: 'inherit' }}>
          <Sider />
          <Layout.Content
            style={{
              padding: isLg ? '2rem 4rem' : '1rem',
              minHeight: '100vh',
            }}
          >
            <Card
              style={{ minWidth: '100%', minHeight: '100%', cursor: 'default' }}
              bordered={false}
              title={
                <Typography.Title level={isLg ? 3 : 4}>Habits</Typography.Title>
              }
              hoverable
            >
              <Card.Meta
                description={
                  loading ? (
                    <Skeleton.Input active />
                  ) : (
                    <Typography.Text style={{ color: 'gray' }}>
                      Displaying the habits of user{' '}
                      <Typography.Text
                        style={{
                          color: 'HighlightText',
                          backgroundColor: 'darkslategray',
                          padding: '1px 5px',
                          borderRadius: '5px',
                        }}
                      >
                        {displayName}
                      </Typography.Text>
                    </Typography.Text>
                  )
                }
              />
              <HabitTable />
            </Card>
          </Layout.Content>
        </Layout>
      </div>
    </>
  );
}
