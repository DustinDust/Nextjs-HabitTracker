import { Form, Typography, Input, Button, notification, message } from 'antd';
import {
  UserOutlined,
  LockOutlined,
  ExclamationCircleOutlined,
} from '@ant-design/icons';
import LayoutContainer from '../../components/Layout';
import pocketbaseClient from '../../utils/pocketbase';
import { useState } from 'react';
import { useRouter } from 'next/router';

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
    <LayoutContainer className='flex flex-col items-start justify-start gap-4'>
      {contextHolder}
      <h1 className='text-3xl'>Sign-in</h1>
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
          rules={[{ required: true, message: 'Required!' }]}
        >
          <Input prefix={<UserOutlined />} placeholder='Username or Email' />
        </Form.Item>
        <Form.Item
          label='Password'
          name='password'
          rules={[{ required: true, message: 'Required!' }]}
        >
          <Input.Password prefix={<LockOutlined />} placeholder='Password' />
        </Form.Item>
        <Form.Item wrapperCol={{ offset: 6, span: 16 }}>
          <Button
            type='primary'
            htmlType='submit'
            className='bg-blue-500'
            loading={loading}
          >
            Submit
          </Button>
        </Form.Item>
      </Form>
    </LayoutContainer>
  );
}
