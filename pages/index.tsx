import { Card, Result, Typography } from 'antd';
import Head from 'next/head';
import { useRouter } from 'next/router';
import LayoutContainer from '../components/Layout';
import { useEffect } from 'react';
import { pocketbaseClient, useNotification } from '../utils';
import {
  CheckCircleOutlined,
  ExclamationCircleFilled,
} from '@ant-design/icons';

export default function Home() {
  const router = useRouter();
  const [openNoti, contextHolder] = useNotification();
  useEffect(() => {
    if (pocketbaseClient.authStore.isValid) {
      openNoti(
        'Successfully sign you in',
        'Redirecting...',
        <CheckCircleOutlined />
      );
      router.push('/habits');
    } else {
      openNoti(
        'Nothing to see here...',
        'Redirecting you to sign-in',
        <ExclamationCircleFilled />
      );
      router.push('/sign-in');
    }
  }, [openNoti, router]);
  function handleSignin(event: any) {
    router.push('/sign-in');
  }
  function handleSignup(event: any) {
    router.push('/sign-up');
  }
  return (
    <>
      <Head>
        <title>Habit tracker</title>
        <meta name='viewport' content='initial-scale=1.0, width=device-width' />
      </Head>
      {contextHolder}
      <LayoutContainer>
        <Card
          title={
            <Typography.Title level={2}>HABIT TRACKER 3000</Typography.Title>
          }
        >
          <div className='flex flex-col items-center justify-center gap-4'>
            <button
              onClick={handleSignin}
              className='px-8 py-2 rounded-md border-2 bg-blue-500 text-white hover:bg-opacity-90 transition-all ease-in-out hover:transition-all hover:ease-in-out'
            >
              Sign-in
            </button>
            <button
              onClick={handleSignup}
              className='px-8 py-2 rounded-md border-2 bg-blue-500 text-white hover:bg-opacity-90 transition-all ease-in-out hover:transition-all hover:ease-in-out'
            >
              Sign-up
            </button>
          </div>
        </Card>
      </LayoutContainer>
    </>
  );
}
