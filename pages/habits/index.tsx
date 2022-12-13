import pocketbaseClient from '../../utils/pocketbase';
import { notification, Card, Layout, Typography } from 'antd';
import { useEffect, useState } from 'react';
import Head from 'next/head';
import { useMedia } from 'react-use';
import Sider from '../../components/Sider';
import HabitTable from '../../components/HabitTable';
import { breakPoints } from '../../utils/breakpoint';
import { ExclamationCircleOutlined } from '@ant-design/icons';

export default function UserHomePage() {
  const isLg = useMedia(`(min-width: ${breakPoints.lg}px)`, false);
  const [usernameOrEmail, setUsernameOrEmail] = useState<string>('');
  const [api, ContextHolder] = notification.useNotification();
  useEffect(() => {
    function openNotification(message: string, description: any) {
      api.open({
        message: message,
        description: description,
        duration: 3,
        icon: <ExclamationCircleOutlined />,
      });
    }
    const hasUser =
      pocketbaseClient.authStore.isValid &&
      pocketbaseClient.authStore.token &&
      pocketbaseClient.authStore.model;
    if (!hasUser) {
      pocketbaseClient
        .collection('user')
        .authRefresh()
        .then((data) => {
          openNotification(
            'Success',
            `Successfully sign in as ${data.record.username}`
          );
          setUsernameOrEmail(pocketbaseClient.authStore.model?.username);
        })
        .catch((e) => {
          openNotification(
            'Sign-in error',
            `Some error had occurred while we tried to sign you in, please sign-in againm -- ${e}`
          );
        });
    } else {
      setUsernameOrEmail(pocketbaseClient.authStore.model?.username);
    }
  }, [setUsernameOrEmail, api]);

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
                      {usernameOrEmail}
                    </Typography.Text>
                  </Typography.Text>
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
