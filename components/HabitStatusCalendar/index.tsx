import {
  Badge,
  Calendar,
  Card,
  InputNumber,
  Modal,
  Spin,
  Switch,
  Form,
} from 'antd';
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
import { CheckOutlined } from '@ant-design/icons';
import prettyMilliseconds from 'pretty-ms';
import DateCell from './DateCell';

export type HabitStatusCalendarProps = {
  habit: HabitRecord;
  keygen?: () => void;
};

export default function HabitStatusCalendar(props: HabitStatusCalendarProps) {
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
  const [statusModalOpen, setStatusModalOpen] = useState<boolean>(false);
  const [statusModalLoading, setStatusModalLoading] = useState<boolean>(false);
  const [statusValue, setStatusValue] = useState<{
    time: number | undefined;
    done: boolean;
  }>({
    time: 0,
    done: false,
  });
  const [key, setKey] = useState<number>(0);

  const onSelect = (value: Dayjs) => {
    setCurrentDate(value);
    const status = statuses.find((v) => dayjs(v.date).isSame(value, 'day'));
    console.log(status);
    setStatusValue({
      done: status?.done || false,
      time: status ? status.time : undefined,
    });
    setStatusModalOpen(true);
  };

  const disabledDate = (value: Dayjs) => {
    if (
      occurences.occurences.filter((occur) => {
        return dayjs(occur).isSame(value, 'day');
      }).length > 0
    ) {
      return false;
    } else {
      return true;
    }
  };

  const dateCellRenderer = (value: Dayjs) => {
    if (value.isAfter(dayjs(new Date()))) {
      return <DateCell date={value} />;
    }
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
            <DateCell
              date={value}
              onClick={() => onSelect(value)}
              responsiveStyle={{
                backgroundColor: '#ABC270',
                color: 'white',
              }}
            >
              <div className='w-full h-full flex justify-center items-center p-6'>
                <CheckOutlined
                  style={{
                    color: 'green',
                    scale: '125%',
                  }}
                />
              </div>
            </DateCell>
          );
        } else {
          if (!props.habit.target || props.habit.target <= 0) {
            return (
              <DateCell
                date={value}
                onClick={() => {
                  onSelect(value);
                }}
              />
            );
          } else
            return (
              <DateCell
                date={value}
                onClick={() => onSelect(value)}
                responsiveStyle={{
                  backgroundColor: '#567189',
                  color: 'white',
                }}
              >
                <div className='w-full flex justify-start'>
                  <Badge
                    status='processing'
                    text={`${prettyMilliseconds(
                      status.time * 60 * 1000
                    )}/${prettyMilliseconds(props.habit.target * 60 * 1000)} `}
                  />
                </div>
              </DateCell>
            );
        }
      } else {
        if (!props.habit.target || props.habit.target <= 0) {
          return <DateCell date={value} onClick={() => onSelect(value)} />;
        }
        return (
          <DateCell
            date={value}
            onClick={() => onSelect(value)}
            responsiveStyle={{
              backgroundColor: '#EE6983',
              color: 'white',
            }}
          >
            <div className='w-full flex justify-start'>
              <Badge status='error' text={`No data`} />
            </div>
          </DateCell>
        );
      }
    } else {
      if (
        value.isAfter(occurences.occurences.at(-1)) ||
        value.isBefore(occurences.occurences.at(0))
      ) {
        return <DateCell date={value} />;
      }
      return <DateCell date={value} />;
    }
  };

  const onStatusModalOk = async () => {
    const exist = statuses.find((v) =>
      dayjs(v.date).isSame(currentDate, 'day')
    );
    setStatusModalLoading(true);
    try {
      if (exist) {
        await pocketbaseClient.collection('habit_status').update(exist.id, {
          time: statusValue.time ? statusValue.time : undefined,
          done: statusValue.done,
        });
      } else {
        await pocketbaseClient.collection('habit_status').create({
          habit: props.habit.id,
          time: statusValue.time ? statusValue.time : undefined,
          done: statusValue.done,
          date: currentDate.toISOString(),
        });
      }
      setStatusModalLoading(false);
      setStatusModalOpen(false);
      setKey(Math.random());
      if (props.keygen) props.keygen();
    } catch (e) {
      console.log(e);
    }
  };

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
        $cancelKey: `habit_statuses_${props.habit.id}`,
        filter: `
          (habit="${props.habit.id}" && 
          (date>="${occurences.occurences.at(0)?.toISOString()}" &&
          date<="${occurences.occurences.at(-1)?.toISOString()}"))
        `,
      })
      .then((data) => {
        setStatuses(data);
      })
      .catch((e) => {
        console.log(e);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [occurences, props.habit.id, key]);

  return (
    <Spin spinning={loading} delay={500}>
      <Calendar
        mode='month'
        dateFullCellRender={dateCellRenderer}
        fullscreen={isLg}
        onPanelChange={onPanelChange}
        disabledDate={disabledDate}
        value={currentDate}
        key={key}
      />
      <Modal
        afterClose={() => {
          setStatusValue({ done: false, time: undefined });
        }}
        open={statusModalOpen}
        onCancel={() => {
          setStatusModalOpen(false);
        }}
        confirmLoading={statusModalLoading}
        onOk={onStatusModalOk}
        okButtonProps={{
          style: {
            backgroundColor: '#3b82f6',
          },
        }}
      >
        <Card
          title={`${currentDate.format('YYYY - MM/DD')}`}
          bordered={false}
          style={{
            marginTop: '2rem',
          }}
        >
          {props.habit.target && props.habit.target > 0 ? (
            <Form.Item label={'Progress'}>
              <InputNumber
                addonAfter={`minutes out of ${prettyMilliseconds(
                  props.habit.target * 60 * 1000
                )}`}
                onChange={(value: number | null) => {
                  setStatusValue({
                    done: !!value && value >= props.habit.target,
                    time: value || 0,
                  });
                }}
                value={statusValue.time}
              />
            </Form.Item>
          ) : (
            <Form.Item label={'Done?'}>
              <Switch
                style={{ marginLeft: '2rem' }}
                onChange={(checked) => {
                  setStatusValue({
                    done: checked,
                    time: undefined,
                  });
                }}
                checked={statusValue.done}
              />
            </Form.Item>
          )}
        </Card>
      </Modal>
    </Spin>
  );
}
