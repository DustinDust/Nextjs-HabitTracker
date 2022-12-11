import Head from 'next/head';
import { useRouter } from 'next/router';
import LayoutContainer from '../components/Layout';

export default function Home() {
  const router = useRouter();
  function handleClick(event: any) {
    router.push('/login');
  }
  return (
    <>
      <Head>
        <title>Habit tracker</title>
        <meta name='viewport' content='initial-scale=1.0, width=device-width' />
      </Head>
      <LayoutContainer className='flex flex-col justify-center items-center gap-4'>
        <h1 className='text-3xl text-slate-700'>There is nothing here</h1>
        <button
          onClick={handleClick}
          className='px-8 py-2 rounded-md border-2 text-slate-700 hover:border-slate-300'
        >
          Go to sign-in
        </button>
      </LayoutContainer>
    </>
  );
}
