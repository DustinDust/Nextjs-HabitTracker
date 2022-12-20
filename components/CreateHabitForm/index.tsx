import {
  Form,
  Input,
  InputNumber,
  Select,
  Button,
  Typography,
  Row,
  Col,
} from 'antd';
import { Habit, breakPoints } from '../../utils';
import { useMedia } from 'react-use';
import { useState } from 'react';
import dayjs from 'dayjs';
import { FieldStringOutlined, FieldNumberOutlined } from '@ant-design/icons';
import { Cron } from 'react-js-cron';
import pocketbaseClient from '../../utils/pocketbase';
import { HabitRecord } from '../HabitTable';

export type CreateHabitFormProps = {
  children?: React.ReactNode;
  onSuccess?: (data: HabitRecord) => void;
  onFailed?: (err: any) => void;
};

type CreateHabitFormData = {
  habit_name: string;
  target: number;
  cron: string;
};

export default function CreateHabitForm(props: CreateHabitFormProps) {
  const [form] = Form.useForm<CreateHabitFormData>();
  const isLg = useMedia(`(min-width): ${breakPoints.lg}px`, false);
  const [loading, setLoading] = useState<boolean>(false);
  const [isMesurable, setIsMesurable] = useState<boolean>(false);

  const [cron, setCron] = useState<string>('* * * * *');

  const onFinish = async (data: CreateHabitFormData) => {
    try {
      setLoading(true);
      const res = await pocketbaseClient
        .collection('habits')
        .create<HabitRecord>({
          ...data,
          target: data.target * 60,
          user: pocketbaseClient.authStore.model?.id,
        });
      props.onSuccess ? props.onSuccess(res) : console.log(res);
    } catch (error) {
      props.onFailed ? props.onFailed(error) : console.log(error);
    } finally {
      form.resetFields();
      setLoading(false);
    }
  };

  const onFinishFailed = ({
    values,
    errorFields,
  }: {
    values: CreateHabitFormData;
    errorFields: any;
  }) => {
    console.log(values);
    console.log(errorFields);
  };

  return (
    <>
      <div className='flex flex-row gap-4 items-center mb-4 justify-center border-b-2'>
        <label htmlFor='type-select'>
          <Typography.Text strong>Select type: </Typography.Text>
        </label>
        <Select
          id='type-select'
          defaultValue={'yesorno'}
          bordered={false}
          onChange={(value, options) => {
            if (value === 'yesorno') {
              setIsMesurable(false);
              form.resetFields(['target']);
            } else setIsMesurable(true);
          }}
          options={[
            { value: 'yesorno', label: 'Yes or no' },
            { value: 'mesurable', label: 'Mesurable' },
          ]}
        ></Select>
      </div>
      <Form
        form={form}
        onFinish={onFinish}
        onFinishFailed={onFinishFailed}
        size={'large'}
        labelAlign='left'
        style={{ width: '100%' }}
        labelWrap
        labelCol={{ span: 6 }}
        wrapperCol={{ span: 24 - 6 }}
        scrollToFirstError
        validateTrigger={['onChange', 'onBlur', 'onFinish']}
        preserve={false}
      >
        <Form.Item
          label='Name'
          name='habit_name'
          rules={[{ required: true, message: 'Required!' }]}
        >
          <Input disabled={loading} placeholder={'Name'} />
        </Form.Item>
        <Form.Item
          label='Target'
          name='target'
          rules={[{ required: isMesurable, message: 'Required!' }]}
          hidden={!isMesurable}
        >
          <InputNumber addonAfter='minutes' disabled={loading} />
        </Form.Item>
        <Form.Item
          label='Schedule'
          name='cron'
          rules={[{ required: true, message: 'Required!' }]}
          initialValue={'* * * * *'}
        >
          <Cron
            value={cron}
            setValue={(value: string) => {
              setCron(value);
              form.setFieldValue('cron', value);
            }}
            disabled={loading}
            clearButton={false}
            displayError={form.getFieldError('cron').length > 0}
          />
        </Form.Item>
        <Form.Item wrapperCol={{ offset: 6 }} style={{ marginTop: '1rem' }}>
          <Row gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}>
            <Col>
              <Button
                type='primary'
                htmlType='submit'
                className='bg-blue-500'
                loading={loading}
              >
                Confirm
              </Button>
            </Col>
            <Col>
              <Button htmlType='reset' disabled={loading}>
                Reset
              </Button>
            </Col>
          </Row>
        </Form.Item>
      </Form>
    </>
  );
}
