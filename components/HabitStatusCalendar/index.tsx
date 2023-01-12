import { Badge, Calendar, Spin, Typography } from 'antd';
import {
  HabitRecord,
  HabitStatusRecord,
  breakPoints,
  getIntervals,
  getOccurences,
  pocketbaseClient,
} from '../../utils';
import { useEffect, useState } from 'react';
import { useMedia } from 'react-use';
import dayjs, { Dayjs } from 'dayjs';
import {
  CheckCircleTwoTone,
  CloseCircleTwoTone,
  StopTwoTone,
} from '@ant-design/icons';

export type HabitStatusCalendarProps = {
  habit: HabitRecord;
};

export default function HabitStatusCalendar(props: HabitStatusCalendarProps) {
  const dateCellRenderer = (value: Dayjs) => {
    if (
      occurences.occurences.filter((occur) => {
        return dayjs(occur).isSame(value, 'day');
      }).length > 0
    ) {
      const status = statuses.find((v) => {
        return value.isSame(dayjs(v.date), 'day');
      });
      if (status) {
        if (status.done) {
          return (
            <div className='w-full h-full flex justify-center items-center'>
              <CheckCircleTwoTone
                twoToneColor={'green'}
                style={{
                  color: 'white',
                  scale: isLg ? '150%' : '50%',
                }}
              />
            </div>
          );
        } else {
          return (
            <div className='flex justify-center items-center w-full h-full'>
              <CloseCircleTwoTone
                twoToneColor={'red'}
                style={{
                  scale: isLg ? '150%' : '50%',
                }}
              />
            </div>
          );
        }
      } else {
        return (
          <div className='flex justify-center items-center w-full h-full'>
            <CloseCircleTwoTone
              twoToneColor={'red'}
              style={{
                scale: isLg ? '150%' : '50%',
              }}
            />
          </div>
        );
      }
    } else {
      if (
        value.isAfter(occurences.occurences.at(-1)) ||
        value.isBefore(occurences.occurences.at(0))
      ) {
        return;
      }
      return (
        <div className='flex justify-center items-center w-full h-full'>
          <StopTwoTone
            twoToneColor={'gray'}
            style={{
              scale: isLg ? '150%' : '50%',
            }}
          />
        </div>
      );
    }
  };

  const [loading, setLoading] = useState<boolean>(false);
  const [currentDate, setCurrentDate] = useState<Dayjs>(dayjs(new Date()));
  const isLg = useMedia(`(min-width: ${breakPoints.lg}px)`, false);
  const [occurences, setOccurences] = useState<{
    count: number;
    occurences: Date[];
  }>(
    getOccurences(getIntervals(props.habit.cron, 'month', currentDate.toDate()))
  );
  const [statuses, setStatuses] = useState<HabitStatusRecord[]>([]);
  const onPanelChange = (date: Dayjs, mode: string) => {
    if (mode === 'year') {
      return;
    }
    setCurrentDate(date);
    const intervals = getIntervals(props.habit.cron, 'month', date.toDate());
    const occurences = getOccurences(intervals);
    setOccurences(occurences);
  };

  useEffect(() => {
    setLoading(true);
    pocketbaseClient
      .collection('habit_status')
      .getFullList<HabitStatusRecord>(occurences.count + 20, {
        $cancelKey: `habit_status_${props.habit.id}_${currentDate}`,
        filter: `
          (habit="${props.habit.id}" && 
          (created>="${occurences.occurences.at(0)?.toISOString()}" &&
          created<="${occurences.occurences.at(-1)?.toISOString()}"))
        `,
      })
      .then((data) => {
        console.log(data);
        setStatuses(data);
      })
      .catch((e) => {
        console.log(e);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [occurences, props.habit.id, currentDate]);
  return (
    <Spin spinning={loading} delay={500}>
      <Calendar
        mode='month'
        dateCellRender={dateCellRenderer}
        fullscreen={isLg}
        onPanelChange={onPanelChange}
      />
    </Spin>
  );
}
