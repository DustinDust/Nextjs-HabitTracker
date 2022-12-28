import { useEffect, useMemo, useState } from 'react';
import {
  getIntervals,
  getOccurences,
  HabitRecord,
  HabitStatusRecord,
  pocketbaseClient,
} from '../../utils';
import { Card, Progress, Skeleton, Space } from 'antd';

export type HabitProgressProps = {
  habit: HabitRecord;
  children?: React.ReactNode;
};

export function HabitProgress(props: HabitProgressProps) {
  const isMersurable = props.habit.target && props.habit.target > 0;
  const { weeklyIntervals, monthlyIntervals, yearlyIntervals } = useMemo(
    () => getIntervals(props.habit.cron),
    [props.habit.cron]
  );
  const weeklyOccurences = useMemo(
    () => getOccurences(weeklyIntervals),
    [weeklyIntervals]
  );
  const monthlyOccurences = useMemo(
    () => getOccurences(monthlyIntervals),
    [monthlyIntervals]
  );
  const yearlyOccurences = useMemo(
    () => getOccurences(yearlyIntervals),
    [yearlyIntervals]
  );

  const [weeklyStatuses, setWeeklyStatuses] = useState<number>();
  const [monthlyStatuses, setMonthlyStatuses] = useState<number>();
  const [yearlyStatuses, setYearlyStatuses] = useState<number>();
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    setLoading(true);
    Promise.all([
      pocketbaseClient
        .collection('habit_status')
        .getList<HabitStatusRecord>(1, 1, {
          $autoCancel: false,
          filter: `(habit="${
            props.habit.id
          }" && done=true && (created>="${weeklyOccurences.occurences
            .at(0)
            ?.toISOString()}" && created<="${weeklyOccurences.occurences
            .at(-1)
            ?.toISOString()}"))`,
        }),
      pocketbaseClient
        .collection('habit_status')
        .getList<HabitStatusRecord>(1, 1, {
          $autoCancel: false,
          filter: `(habit="${
            props.habit.id
          }" && done=true && (created>="${monthlyOccurences.occurences
            .at(0)
            ?.toISOString()}" && created<="${monthlyOccurences.occurences
            .at(-1)
            ?.toISOString()}"))`,
        }),
      pocketbaseClient
        .collection('habit_status')
        .getList<HabitStatusRecord>(1, 1, {
          $autoCancel: false,
          filter: `(habit="${
            props.habit.id
          }" && done=true && created>="${yearlyOccurences.occurences
            .at(1)
            ?.toISOString()}" && created <= "${yearlyOccurences.occurences
            .at(-1)
            ?.toISOString()}")`,
        }),
    ])
      .then((values) => {
        setWeeklyStatuses(values[0].totalItems);
        setMonthlyStatuses(values[1].totalItems);
        setYearlyStatuses(values[2].totalItems);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [
    setLoading,
    monthlyOccurences.occurences,
    weeklyOccurences.occurences,
    yearlyOccurences.occurences,
    props.habit.id,
  ]);

  return (
    <>
      <Card title={'Progress'} bordered={false}>
        {loading ? (
          <Skeleton />
        ) : (
          <Space direction='vertical' size={'large'} style={{ width: '50%' }}>
            <Progress
              percent={parseFloat(
                (
                  ((weeklyStatuses || 0) / weeklyOccurences.count) *
                  100
                ).toFixed(1)
              )}
              format={(percent) => {
                return `${percent}% of weekly goal - ${weeklyStatuses || 0}/${
                  weeklyOccurences.count
                }`;
              }}
            />
            <Progress
              percent={parseFloat(
                (
                  ((monthlyStatuses || 0) / monthlyOccurences.count) *
                  100
                ).toFixed(1)
              )}
              format={(percent) => {
                return `${percent}% of monthly goal - ${monthlyStatuses || 0}/${
                  monthlyOccurences.count
                }`;
              }}
            />
            <Progress
              // type='circle'
              percent={parseFloat(
                (
                  ((yearlyStatuses || 0) / yearlyOccurences.count) *
                  100
                ).toFixed(1)
              )}
              format={(percent) => {
                return `${percent}% of yearly goal - ${yearlyStatuses || 0}/${
                  yearlyOccurences.count
                }`;
              }}
            />
          </Space>
        )}
      </Card>
    </>
  );
}
