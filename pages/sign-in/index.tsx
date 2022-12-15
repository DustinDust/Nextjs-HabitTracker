import {
  Form,
  Typography,
  Input,
  Button,
  notification,
  message,
  Space,
  Card,
} from 'antd';
import {
  UserOutlined,
  LockOutlined,
  ExclamationCircleOutlined,
} from '@ant-design/icons';
import LayoutContainer from '../../components/Layout';
import pocketbaseClient from '../../utils/pocketbase';
import { useState } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import Link from 'next/link';

type LoginFormData = {
  usernameOrEmail: string;
  password: string;
};

export default function LoginPage() {
  const router = useRouter();
  const [api, contextHolder] = notification.useNotification();
  const [form] = Form.useForm<LoginFormData>();
  const [loading, setLoading] = useState<boolean>(false);

  function openNotification(message: string, description: any) {
    api.open({
      message: message,
      description: description,
      duration: 3,
      icon: <ExclamationCircleOutlined />,
    });
  }
  const onFinish = async (values: LoginFormData) => {
    try {
      setLoading(true);
      const authResponse = await pocketbaseClient
        .collection('users')
        .authWithPassword(values.usernameOrEmail, values.password);
      router.push('/habits');
    } catch (error) {
      openNotification('Error', 'Could not sign you in - ' + error);
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const onFinishFailed = ({
    values,
    errorFields,
  }: {
    values: LoginFormData;
    errorFields: any;
  }) => {
    console.log(values);
    console.log(errorFields);
  };

  return (
    <>
      <Head>
        <title>Sign-in</title>
      </Head>
      <LayoutContainer className='flex flex-col items-start justify-start gap-4'>
        {contextHolder}
        <Card
          style={{ width: '100%', height: '100%' }}
          bordered={false}
          title={<Typography.Title level={2}>Sign-in</Typography.Title>}
        >
          <Form
            form={form}
            onFinish={onFinish}
            validateTrigger={['onChange', 'onBlur']}
            onFinishFailed={onFinishFailed}
            size='large'
            labelAlign='left'
            labelCol={{ span: 6 }}
            wrapperCol={{ span: 24 - 6 }}
            style={{ width: '100%' }}
            labelWrap
          >
            <Form.Item
              label='Username or Email'
              name='usernameOrEmail'
              hasFeedback
              rules={[{ required: true, message: 'Required!' }]}
            >
              <Input
                prefix={<UserOutlined />}
                placeholder='Username or Email'
              />
            </Form.Item>
            <Form.Item
              label='Password'
              name='password'
              hasFeedback
              rules={[
                { required: true, message: 'Required!' },
                {
                  min: 8,
                  message: 'Password must be at least 8 characters long',
                },
              ]}
            >
              <Input.Password
                prefix={<LockOutlined />}
                placeholder='Password'
              />
            </Form.Item>
            <Form.Item wrapperCol={{ offset: 6, span: 16 }}>
              <Space wrap size={40} align={'center'}>
                <Button
                  type='primary'
                  htmlType='submit'
                  className='bg-blue-500'
                  loading={loading}
                >
                  Sign-in
                </Button>
                <Typography.Text>
                  ...or <Link href={'/sign-up'}>create a new account.</Link>
                </Typography.Text>
              </Space>
            </Form.Item>
          </Form>
        </Card>
      </LayoutContainer>
    </>
  );
}
