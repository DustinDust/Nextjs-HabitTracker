import { Card, Typography } from 'antd';
import Head from 'next/head';
import { useRouter } from 'next/router';
import LayoutContainer from '../components/Layout';

export default function Home() {
  const router = useRouter();
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
