import {
  Card,
  Layout,
  Typography,
  Skeleton,
  Col,
  Row,
  Button,
  Modal,
} from 'antd';
import { useEffect, useState } from 'react';
import Head from 'next/head';
import { useMedia } from 'react-use';
import Sider from '../../components/Sider';
import HabitTable from '../../components/HabitTable';
import {
  CheckCircleOutlined,
  ExclamationCircleOutlined,
} from '@ant-design/icons';
import { useRouter } from 'next/router';
import CreateHabitForm from '../../components/CreateHabitForm';
import {
  HabitRecord,
  pocketbaseClient,
  breakPoints,
  useNotification,
} from '../../utils';

export default function HabitsPage() {
  const isLg = useMedia(`(min-width: ${breakPoints.lg}px)`, false);
  const [displayName, setDisplayName] = useState<string>('');
  const [tableKey, setTableKey] = useState<number>(0);
  const [openNotification, ContextHolder] = useNotification();
  const [loading, setLoading] = useState<boolean>();
  const router = useRouter();
  const [modalOpen, setModalOpen] = useState<boolean>(false);

  const onAddHabitBtnClick = () => {
    setModalOpen(true);
  };

  const onCreateHabitFailed = (error: any) => {
    openNotification(
      'Error',
      'Failed to create habit - ' + error,
      <ExclamationCircleOutlined />
    );
  };

  const onCreateHabitSuccess = (data: HabitRecord) => {
    openNotification('Success', 'Habit created', <CheckCircleOutlined />);
    setModalOpen(false);
    setTableKey(Math.random() * 10000);
  };

  const handleModalClose = () => {
    setModalOpen(false);
  };

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
      setDisplayName(pocketbaseClient.authStore.model?.name);
    }
  }, [router, openNotification, setDisplayName, setLoading]);

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
              style={{
                cursor: 'default',
                minHeight: '100%',
              }}
              bordered={true}
              title={
                <Typography.Title level={isLg ? 3 : 4}>Habits</Typography.Title>
              }
              hoverable
            >
              <Card.Meta
                description={
                  loading ? (
                    <Row>
                      <Col>
                        <Skeleton.Input active />
                      </Col>
                      <Col offset={10}>
                        <Skeleton.Button active />
                      </Col>
                    </Row>
                  ) : (
                    <Row
                      justify={'center'}
                      align={'middle'}
                      gutter={{
                        xs: 8,
                        sm: 16,
                        md: 24,
                        lg: 32,
                      }}
                    >
                      <Col flex={1}>
                        <div
                          className={`flex flex-row justify-start items-center`}
                        >
                          <Typography.Text style={{ color: 'gray' }}>
                            Displaying the habits of user{' '}
                            <Typography.Text
                              style={{
                                color: 'white',
                                backgroundColor: 'black',
                                padding: '1px 5px',
                                borderRadius: '5px',
                              }}
                            >
                              {displayName}
                            </Typography.Text>
                          </Typography.Text>
                        </div>
                      </Col>
                      <Col
                        xs={{ flex: 1 }}
                        sm={{ flex: 1 }}
                        lg={{ flex: 0 }}
                        xl={{ flex: 0 }}
                        xxl={{ flex: 0 }}
                      >
                        <div
                          className={`flex flex-row justify-center items-center`}
                        >
                          <Button
                            style={{ marginTop: isLg ? 'none' : '1rem' }}
                            onClick={onAddHabitBtnClick}
                          >
                            Add new habit
                          </Button>
                        </div>
                      </Col>
                    </Row>
                  )
                }
              />
              <HabitTable key={tableKey} />
            </Card>
            <Modal
              title={'Add new habit'}
              onCancel={handleModalClose}
              open={modalOpen}
              okButtonProps={{ hidden: true }}
              width={'1000px'}
              destroyOnClose={true}
            >
              <CreateHabitForm
                onFailed={onCreateHabitFailed}
                onSuccess={onCreateHabitSuccess}
              />
            </Modal>
          </Layout.Content>
        </Layout>
      </div>
    </>
  );
}
