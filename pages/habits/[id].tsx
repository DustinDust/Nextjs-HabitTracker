import Head from 'next/head';
import { useRouter } from 'next/router';
import { Card, Layout, Skeleton, Typography } from 'antd';
import Sider from '../../components/Sider';
import { useMedia } from 'react-use';
import { breakPoints, HabitRecord, pocketbaseClient } from '../../utils';
import { useEffect, useState } from 'react';
import HabitInfo from '../../components/HabitInfo';
import { HabitProgress } from '../../components/HabitProgress';

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
                  <Skeleton.Input size='large' active />
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
                    <Skeleton.Input size='large' active />
                  ) : habitData ? (
                    <Typography.Text style={{ color: 'GrayText' }}>
                      Display the details of habit{' '}
                      <Typography.Text strong>
                        {habitData?.habit_name}
                      </Typography.Text>
                    </Typography.Text>
                  ) : (
                    ''
                  )
                }
              />
              {habitData && !loading ? (
                <HabitInfo habit={habitData} loading={loading} />
              ) : (
                <Skeleton style={{ marginTop: '1rem' }} active={true} />
              )}
              {habitData && !loading ? (
                <HabitProgress habit={habitData} />
              ) : (
                <Skeleton active={true} />
              )}
            </Card>
          </Layout.Content>
        </Layout>
      </div>
    </>
  );
}
