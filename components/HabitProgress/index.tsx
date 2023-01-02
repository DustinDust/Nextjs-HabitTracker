import { getIntervals, getOccurences, HabitRecord } from '../../utils';
import { Card, Space } from 'antd';
import HabitProgress from './HabitProgress';

export type HabitProgressProps = {
  habit: HabitRecord;
  children?: React.ReactNode;
};

export function HabitProgressCard(props: HabitProgressProps) {
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
