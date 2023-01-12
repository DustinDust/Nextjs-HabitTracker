import { useEffect, useState } from 'react';
import {
  HabitRecord,
  HabitStatusRecord,
  getIntervals,
  getOccurences,
  pocketbaseClient,
} from '../../utils';
import { Progress, Skeleton } from 'antd';

export type HabitProgressProps = {
  habit: HabitRecord;
  period: 'week' | 'month' | 'year' | 'day';
  // occurences: { count: number; occurences: Date[] };
};

export default function HabitProgress(props: HabitProgressProps) {
  const isMersurable = props.habit.target && props.habit.target > 0;
  const [statusesCount, setStatusesCount] = useState<number>();
  const [occurencesCount, setOccurencesCount] = useState<number>(100);
  const [loading, setLoading] = useState<boolean>();

  useEffect(() => {
    setLoading(true);
    console.log('habit' + props.period);
    if (!props.habit.cron) {
      return;
    }
    const intervals = getIntervals(props.habit.cron, props.period);
    const occurences = getOccurences(intervals);
    setOccurencesCount(occurences.count);
    pocketbaseClient
      .collection('habit_status')
      .getList<HabitStatusRecord>(1, 1, {
        $cancelKey: `${props.habit.id} ${props.period}`,
        filter: `(habit="${
          props.habit.id
        }" && done=true && (created>="${occurences.occurences
          .at(0)
          ?.toISOString()}" && created<="${occurences.occurences
          .at(-1)
          ?.toISOString()}"))`,
      })
      .then((data) => {
        setStatusesCount(data.totalItems);
      })
      .catch((err) => {
        console.log(`Error on component habit progress ${err}`);
      })
      .finally(() => setLoading(false));
  }, [props.habit.cron, props.period, props.habit.id]);
  return (
    <>
      {loading ? (
        <Skeleton.Input />
      ) : (
        <Progress
          percent={parseFloat(
            (((statusesCount || 0) / occurencesCount) * 100).toFixed(1)
          )}
          format={(percent) => {
            return `${percent}% of per ${props.period} goal - ${
              statusesCount || 0
            }/${occurencesCount}`;
          }}
        />
      )}
    </>
  );
}
