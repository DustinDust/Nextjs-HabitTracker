import Head from 'next/head';
import { useRouter } from 'next/router';
import { BackTop, Card, Layout, Skeleton, Typography } from 'antd';
import Sider from '../../components/Sider';
import { useMedia } from 'react-use';
import { breakPoints } from '../../utils/breakpoint';
import { useEffect, useState } from 'react';
import HabitInfo from '../../components/HabitInfo';
import { HabitRecord } from '../../components/HabitTable';
import pocketbaseClient from '../../utils/pocketbase';

export default function HabitPage() {
  const router = useRouter();
  const isLg = useMedia(`(min-width: ${breakPoints.lg}px)`, false);
  const [habitData, setHabitData] = useState<HabitRecord>();
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    setLoading(true);
    pocketbaseClient
      .collection('habits')
      .getOne<HabitRecord>(router.query.id as string, { expand: 'user' })
      .then((data) => {
        setHabitData(data);
      })
      .catch((err) => {
        console.log(err);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [router.query]);

  return (
    <>
      <Head>
        <title>{habitData?.habit_name}</title>
      </Head>
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
              style={{
                minWidth: '100%',
                minHeight: '100%',
                cursor: 'default',
              }}
              bordered={false}
              title={
                loading ? (
                  <Skeleton.Input active size='large' />
                ) : habitData ? (
                  <Typography.Title level={isLg ? 3 : 4}>
                    {habitData?.habit_name}
                  </Typography.Title>
                ) : (
                  ''
                )
              }
            >
              <Card.Meta
                description={
                  loading ? (
                    <Skeleton.Input size='default' active />
                  ) : habitData ? (
                    <Typography.Text style={{ color: 'GrayText' }}>
                      Display the details of habit{' '}
                      <Typography.Text
                        strong
                        // style={{
                        //   color: 'white',
                        //   backgroundColor: 'darkslategray',
                        //   padding: '1px 5px',
                        //   borderRadius: '5px',
                        // }}
                      >
                        {habitData?.habit_name}
                      </Typography.Text>
                    </Typography.Text>
                  ) : (
                    ''
                  )
                }
              />
              <HabitInfo habit={habitData} loading={loading} />
            </Card>
          </Layout.Content>
        </Layout>
      </div>
    </>
  );
}
