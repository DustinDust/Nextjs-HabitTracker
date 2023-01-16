import Head from 'next/head';
import { useRouter } from 'next/router';
import {
  Button,
  Card,
  Layout,
  Modal,
  Popconfirm,
  Skeleton,
  Space,
  Spin,
  Typography,
} from 'antd';
import Sider from '../../components/Sider';
import { useMedia } from 'react-use';
import {
  breakPoints,
  HabitRecord,
  pocketbaseClient,
  useNotification,
} from '../../utils';
import { useEffect, useState } from 'react';
import HabitInfo from '../../components/HabitInfo';
import { HabitProgressCard } from '../../components/HabitProgress';
import {
  CheckCircleOutlined,
  DeleteOutlined,
  EditOutlined,
  ExclamationCircleOutlined,
} from '@ant-design/icons';
import UpdateHabitForm from '../../components/UpdateHabitForm';
import HabitStatusCalendar from '../../components/HabitStatusCalendar';

export default function HabitPage() {
  const router = useRouter();
  const isLg = useMedia(`(min-width: ${breakPoints.lg}px)`, false);
  const [habitData, setHabitData] = useState<HabitRecord>();
  const [loading, setLoading] = useState<boolean>(false);
  const [updateFormShow, setUpdateFormShow] = useState<boolean>(false);
  const [deleteDialougeShow, setDeleteDialougeShow] = useState<boolean>(false);
  const [deleteLoading, setDeleteLoading] = useState<boolean>(false);
  const [openNotification, contextHolder] = useNotification();
  const [key, setKey] = useState<number>(0);

  useEffect(() => {
    setLoading(true);
    if (!router.query.id) {
      return;
    }
    pocketbaseClient
      .collection('habits')
      .getOne<HabitRecord>(router.query.id as string, {
        $cancelKey: `habit_${router.query.id}`,
        expand: 'user',
      })
      .then((data) => {
        setHabitData(data);
      })
      .catch((err) => {
        console.log(`Error on habit page ${err}`);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [router.query]);

  const handleDeleteConfirm = async () => {
    try {
      setDeleteLoading(true);
      const id = router.query.id;
      if (!id) {
        throw new Error('Undefined id');
      } else if (id instanceof Array) {
        throw new Error('Invalid id');
      }
      await pocketbaseClient.collection('habits').delete(id, {
        $cancelKey: `deletehabit${id}`,
      });
      router.replace('/habits');
    } catch (e) {
      openNotification(
        'Error',
        'Failed to delete item' + e,
        <ExclamationCircleOutlined />
      );
    } finally {
      setDeleteLoading(false);
    }
  };
  const onDeleteCancel = () => {
    setDeleteDialougeShow(false);
  };

  const onUpdateHabitSuccess = (data: HabitRecord) => {
    openNotification(
      'Success',
      'Successfully updated',
      <CheckCircleOutlined />
    );
    setUpdateFormShow(false);
    setHabitData(data);
  };

  const onUpdateHabitFailed = (err: any) => {
    openNotification(
      'Error',
      'Failed to update habit - ' + err,
      <ExclamationCircleOutlined />
    );
  };

  return (
    <>
      <Head>
        <title>{habitData?.habit_name}</title>
      </Head>
      {contextHolder}
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
                  <div className='flex flex-row justify-between'>
                    <Typography.Title level={isLg ? 3 : 4}>
                      {habitData?.habit_name}
                    </Typography.Title>
                    <div className='flex gap-2'>
                      <Button
                        style={{
                          display: 'flex',
                          justifyContent: 'center',
                          alignItems: 'center',
                        }}
                        onClick={() => {
                          setUpdateFormShow(true);
                        }}
                      >
                        <EditOutlined style={{ marginTop: 0, paddingTop: 0 }} />
                      </Button>
                      <Popconfirm
                        title='Are you sure?'
                        open={deleteDialougeShow}
                        okText='Yea'
                        cancelText='Nah'
                        icon={<ExclamationCircleOutlined />}
                        okButtonProps={{
                          loading: deleteLoading,
                          type: 'default',
                          danger: true,
                        }}
                        onConfirm={handleDeleteConfirm}
                        onCancel={onDeleteCancel}
                        showArrow
                        showCancel
                      >
                        <Button
                          style={{
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                          }}
                          danger
                          onClick={() => {
                            setDeleteDialougeShow(true);
                          }}
                        >
                          <DeleteOutlined
                            style={{ marginTop: 0, paddingTop: 0 }}
                          />
                        </Button>
                      </Popconfirm>
                    </div>
                  </div>
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
              <Spin spinning={!habitData || loading}>
                <HabitInfo habit={habitData} loading={loading} />
              </Spin>
              <Spin spinning={loading}>
                {habitData ? (
                  <HabitProgressCard habit={habitData} key={key} />
                ) : (
                  <Skeleton />
                )}
              </Spin>
              <Spin spinning={loading}>
                {habitData ? (
                  <Card title='Calendar'>
                    <HabitStatusCalendar
                      habit={habitData}
                      keygen={() => setKey(Math.random() * 10000)}
                    />
                  </Card>
                ) : (
                  <Skeleton />
                )}
              </Spin>
            </Card>
          </Layout.Content>
        </Layout>
        {habitData ? (
          <Modal
            title='Update'
            onCancel={() => {
              setUpdateFormShow(false);
            }}
            open={updateFormShow}
            okButtonProps={{ hidden: true }}
            width={'1000px'}
            destroyOnClose={true}
          >
            <UpdateHabitForm
              habit={habitData}
              onFailed={onUpdateHabitFailed}
              onSuccess={onUpdateHabitSuccess}
            />
          </Modal>
        ) : (
          <Skeleton />
        )}
      </div>
    </>
  );
}
