import {
  Form,
  Button,
  Col,
  Row,
  Typography,
  Select,
  Input,
  InputNumber,
} from 'antd';
import { Cron } from 'react-js-cron';
import { HabitRecord, breakPoints, pocketbaseClient } from '../../utils';
import { useMedia } from 'react-use';
import { useState } from 'react';

export type UpdateHabitFormProps = {
  habit: HabitRecord;
  onSuccess: (data: HabitRecord) => void;
  onFailed: (err: any) => void;
};

type UpdateHabitFormData = {
  habit_name: string;
  target: number | null;
  cron: string;
};

export default function UpdateHabitForm(props: UpdateHabitFormProps) {
  const [form] = Form.useForm();
  const isLg = useMedia(`(min-width): ${breakPoints.lg}px`, false);
  const [loading, setLoading] = useState<boolean>();
  const [isMesurable, setIsMesurable] = useState<boolean>(
    !!props.habit.target && props.habit.target > 0
  );

  const [cron, setCron] = useState<string>(props.habit.cron);

  const onFinish = async (data: UpdateHabitFormData) => {
    try {
      const updateData = {
        ...data,
        user: props.habit.user,
      };
      if (!isMesurable) {
        updateData.target = null;
      }
      setLoading(true);
      const res = await pocketbaseClient
        .collection('habits')
        .update<HabitRecord>(props.habit.id, updateData, {
          expand: 'user',
        });
      props.onSuccess ? props.onSuccess(res) : console.log(res);
    } catch (e) {
      props.onFailed ? props.onFailed(e) : console.log(e);
    } finally {
      form.resetFields();
      setLoading(false);
    }
  };

  const onFinishFailed = ({
    values,
    errorFields,
  }: {
    values: UpdateHabitFormData;
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
          defaultValue={isMesurable ? 'mesurable' : 'yesorno'}
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
          initialValue={props.habit.habit_name}
        >
          <Input disabled={loading} placeholder={'Name'} />
        </Form.Item>
        <Form.Item
          label='Target'
          name='target'
          rules={[{ required: isMesurable, message: 'Required!' }]}
          hidden={!isMesurable}
          initialValue={props.habit.target}
        >
          <InputNumber addonAfter='minutes' disabled={loading} />
        </Form.Item>
        <Form.Item
          label='Schedule'
          name='cron'
          rules={[{ required: true, message: 'Required!' }]}
          initialValue={props.habit.cron}
        >
          <Cron
            value={cron}
            setValue={(value: string) => {
              setCron(value);
              form.setFieldValue('cron', value);
            }}
            humanizeValue={true}
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
