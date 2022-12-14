import { Descriptions, Empty, Skeleton, Tag, Tooltip, Typography } from 'antd';
import type { HabitRecord } from '../HabitTable';
import prettyMilliSeconds from 'pretty-ms';
import cronstrue from 'cronstrue';
import { ago } from '../../utils';
import { Record } from 'pocketbase';

export interface HabitInfoProps {
  habit?: HabitRecord;
  loading: boolean;
}
const hightlightTextStyle = {
  // color: 'white',
  // backgroundColor: 'darkslategray',
  // padding: '1px 4px',
  // borderRadius: '5px',
};

export default function HabitInfo(props: HabitInfoProps) {
  if (props.loading) {
    return <Skeleton.Input style={{ marginTop: '1rem' }} active />;
  } else if (!props.habit) {
    return <Empty />;
  } else
    return (
      <>
        <div className='mt-4'>
          <Descriptions
            title='Basic Info'
            bordered
            column={{
              xxl: 3,
              xl: 2,
              lg: 2,
              md: 1,
              sm: 1,
              xs: 1,
            }}
          >
            <Descriptions.Item label={'Name'}>
              <Typography.Text style={hightlightTextStyle}>
                {props.habit.habit_name}
              </Typography.Text>
            </Descriptions.Item>
            <Descriptions.Item label={'Targeted time (per action)'}>
              {!props.habit.target || props.habit.target <= 0 ? (
                <Tooltip
                  title={
                    'Something you do and get done, does not require to invest a specific amount of time'
                  }
                >
                  <Tag color='volcano'>N/A</Tag>
                </Tooltip>
              ) : (
                <Tag color='cyan'>
                  {prettyMilliSeconds(props.habit.target * 1000 || 0)}
                </Tag>
              )}
            </Descriptions.Item>
            <Descriptions.Item label='Schedule'>
              <Typography.Text style={hightlightTextStyle}>
                {cronstrue.toString(props.habit?.cron!)}
              </Typography.Text>
            </Descriptions.Item>
            <Descriptions.Item label={'Created'}>
              <Typography.Text style={hightlightTextStyle}>
                {ago.format(new Date(props.habit.created))}
              </Typography.Text>
            </Descriptions.Item>
            <Descriptions.Item label={'Updated'}>
              <Typography.Text style={hightlightTextStyle}>
                {ago.format(new Date(props.habit.updated))}
              </Typography.Text>
            </Descriptions.Item>
            <Descriptions.Item label={'Created By'}>
              <Typography.Text style={hightlightTextStyle}>
                {(props.habit.expand.user as Record).username}
              </Typography.Text>
            </Descriptions.Item>
          </Descriptions>
        </div>
      </>
    );
}
