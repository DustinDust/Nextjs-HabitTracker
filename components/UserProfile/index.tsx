import { Descriptions, Skeleton } from 'antd';
import { Admin, Record } from 'pocketbase';
import { ago } from '../../utils';

export interface UserProfileProps {
  user?: Record | Admin;
  loading?: boolean;
  habitsNum: number;
}

export default function UserProfile(props: UserProfileProps) {
  return (
    <>
      <Descriptions
        title={
          props.loading ? <Skeleton.Input size='large' /> : props.user?.name
        }
        bordered={true}
        column={{ xl: 2, lg: 2, md: 1, sm: 1, xs: 1 }}
      >
        <Descriptions.Item label={'Username'}>
          {props.loading ? <Skeleton.Input /> : props.user?.username}
        </Descriptions.Item>
        <Descriptions.Item label={'Email'}>
          {props.loading ? <Skeleton.Input /> : props.user?.email}
        </Descriptions.Item>
        <Descriptions.Item label={'Member since'}>
          {props.loading ? (
            <Skeleton.Input />
          ) : (
            ago.format(new Date(props.user?.created || 0))
          )}
        </Descriptions.Item>
        <Descriptions.Item label={'Number of habit registered'}>
          {props.loading ? (
            <Skeleton.Input />
          ) : props.habitsNum > 0 ? (
            props.habitsNum
          ) : (
            'N/A'
          )}
        </Descriptions.Item>
      </Descriptions>
    </>
  );
}
