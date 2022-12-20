import {
  CheckOutlined,
  ExclamationCircleOutlined,
  FieldStringOutlined,
  LockOutlined,
  MailOutlined,
  UserOutlined,
} from '@ant-design/icons';
import {
  Button,
  Card,
  Checkbox,
  Form,
  Input,
  notification,
  Space,
  Typography,
} from 'antd';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useState } from 'react';
import { useMedia } from 'react-use';
import LayoutContainer from '../../components/Layout';
import { breakPoints } from '../../utils/breakpoint';
import pocketbaseClient from '../../utils/pocketbase';
import useNotification from '../../utils/useNotification';

export interface SignUpFormData {
  username: string;
  email: string;
  emailVisibility: boolean;
  password: string;
  passwordConfirm: string;
  name: string;
}

export default function SignupPage() {
  const router = useRouter();
  const isLg = useMedia(`(min-width: ${breakPoints.lg}px)`, false);
  const [openNotification, contextHolder] = useNotification();
  const [form] = Form.useForm<SignUpFormData>();
  const [loading, setLoading] = useState<boolean>(false);

  const onFinish = async (values: SignUpFormData) => {
    try {
      setLoading(true);
      values.emailVisibility = values.emailVisibility ? true : false;
      const authResponse = await pocketbaseClient.collection('users').create({
        ...values,
      });
      openNotification(
        'Successfully registered',
        'You have signed up successfully, We will navigate you to the sign-in site shortly, or close this notification to navigate immidiately',
        <CheckOutlined />,
        () => {
          router.push('/sign-in');
        }
      );
    } catch (error) {
      openNotification(
        'Error',
        'Could not sign you in - ' + error,
        <ExclamationCircleOutlined />,
        () => {
          console.log(error);
        }
      );
    } finally {
      setLoading(false);
    }
  };

  const onFinishFailed = ({
    values,
    errorFields,
  }: {
    values: SignUpFormData;
    errorFields: any;
  }) => {
    console.log(values);
    console.log(errorFields);
  };

  return (
    <>
      <Head>
        <title>Sign-up</title>
      </Head>
      <LayoutContainer>
        {contextHolder}
        <Card
          style={{
            width: '100%',
            height: '100%',
          }}
          title={<Typography.Title level={2}>Sign up</Typography.Title>}
          bordered={false}
        >
          <Form
            form={form}
            onFinish={onFinish}
            onFinishFailed={onFinishFailed}
            validateTrigger={['onChange', 'onBlur', 'onFinish']}
            size='large'
            labelAlign='left'
            labelCol={{ span: 6 }}
            wrapperCol={{ span: 24 - 6 }}
            style={{ width: '100%' }}
            scrollToFirstError
            labelWrap
          >
            <Form.Item
              label='Username'
              name='username'
              hasFeedback
              rules={[{ required: true, message: 'Required' }]}
            >
              <Input prefix={<UserOutlined />} placeholder='Username' />
            </Form.Item>
            <Form.Item
              label='Email'
              hasFeedback
              name='email'
              rules={[
                { required: true, message: 'Required!' },
                { type: 'email', message: 'Must be a valid email!' },
              ]}
            >
              <Input prefix={<MailOutlined />} placeholder='Email' />
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
            <Form.Item
              label='Confirm password'
              name='passwordConfirm'
              hasFeedback
              dependencies={['password']}
              rules={[
                { required: true, message: 'Required!' },
                ({ getFieldValue }) => ({
                  validator(_, value) {
                    if (!value || getFieldValue('password') === value) {
                      return Promise.resolve();
                    } else
                      return Promise.reject(
                        new Error('Password did not match!')
                      );
                  },
                }),
              ]}
            >
              <Input.Password
                prefix={<LockOutlined />}
                placeholder='Confirm password'
              />
            </Form.Item>
            <Form.Item
              name={'name'}
              label='Display name'
              hasFeedback
              rules={[{ required: true, message: 'Required!' }]}
            >
              <Input prefix={<FieldStringOutlined />} />
            </Form.Item>
            <Form.Item
              name='emailVisibility'
              valuePropName='checked'
              wrapperCol={{ offset: 6, flex: 'auto' }}
            >
              <Checkbox>Should email be visible?</Checkbox>
            </Form.Item>
            <Form.Item wrapperCol={{ offset: 6, flex: 'auto' }}>
              <Space wrap size={20} align={'center'}>
                <Button
                  type='primary'
                  htmlType='submit'
                  className='bg-blue-500'
                  loading={loading}
                >
                  Sign-up
                </Button>
                <Typography.Text>
                  Already have an account?{' '}
                  <Link href={'/sign-in'}>Sign-in.</Link>
                </Typography.Text>
              </Space>
            </Form.Item>
          </Form>
        </Card>
      </LayoutContainer>
    </>
  );
}
