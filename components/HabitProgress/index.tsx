import { getIntervals, getOccurences, HabitRecord } from '../../utils';
import { Card, Space } from 'antd';
import HabitProgress from './HabitProgress';
import { useEffect } from 'react';

export type HabitProgressProps = {
  habit: HabitRecord;
  children?: React.ReactNode;
  key?: number;
};

export function HabitProgressCard(props: HabitProgressProps) {
  useEffect(() => {}, [props.key]);
  return (
    <>
      <Card title={'Progress'} bordered={false}>
        <Space
          direction='vertical'
          style={{
            width: '50%',
          }}
        >
          <HabitProgress habit={props.habit} period='day' />
          <HabitProgress habit={props.habit} period='week' />
          <HabitProgress habit={props.habit} period='month' />
        </Space>
      </Card>
    </>
  );
}
