import { useState, useEffect } from 'react';
import { Habit } from '../../utils/types';
import { Record as PBRecord } from 'pocketbase';
import pocketbaseClient from '../../utils/pocketbase';
import { TablePaginationConfig, TableColumnsType, Table, Tag } from 'antd';
import { FilterValue, SorterResult } from 'antd/es/table/interface';
import prettyMilliseconds from 'pretty-ms';
import cronstrue from 'cronstrue';
import { breakPoints } from '../../utils/breakpoint';
import { useMedia } from 'react-use';
import { useRouter } from 'next/router';
import { ago } from '../../utils';

export type HabitRecord = PBRecord & Habit;

const columns: TableColumnsType<HabitRecord> = [
  {
    title: 'Name',
    dataIndex: 'habit_name',
    key: 'habit_name',
  },
  {
    title: 'Created at',
    dataIndex: 'created',
    key: 'created',
    render: (datestring: string) => {
      const date = new Date(datestring);
      return `${ago.format(date)}`;
    },
    responsive: ['lg'],
  },
  {
    title: 'Updated at',
    dataIndex: 'updated',
    key: 'updated',
    render: (datestring: string) => {
      const date = new Date(datestring);
      return `${ago.format(date)}`;
    },
    responsive: ['lg'],
  },
  {
    title: 'Target',
    dataIndex: 'target',
    key: 'target',
    render: (target: number) => {
      if (target <= 0) {
        return <Tag color='volcano'>N/A</Tag>;
      }
      return <Tag color='cyan'>{prettyMilliseconds(target * 1000)}</Tag>;
    },
  },
  {
    title: 'Schedule',
    dataIndex: 'cron',
    key: 'cron',
    render: (cron: string) => {
      return `${cronstrue.toString(cron)}`;
    },
  },
];

export default function HabitTable() {
  const router = useRouter();
  const isLg = useMedia(`(min-width: ${breakPoints.lg}px)`, false);
  const [page, setPage] = useState<number>(1);
  const [loading, setLoading] = useState<boolean>(false);
  const [pageSize, setPageSize] = useState<number>(10);
  const [totalItems, setTotalItems] = useState<number>(0);
  const [totalPages, setTotalPages] = useState<number>(0);
  const [tableData, setTableData] = useState<HabitRecord[]>([]);

  useEffect(() => {
    setLoading(true);
    pocketbaseClient
      .collection('habits')
      .getList<HabitRecord>(page, pageSize)
      .then((data) => {
        // console.log(data);
        setTableData(data.items);
        setPage(data.page);
        setPageSize(data.perPage);
        setTotalItems(data.totalItems);
        setTotalPages(data.totalPages);
      })
      .catch((err) => {
        console.log(err);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [page, pageSize]);

  const handleTableChange = (
    pagination: TablePaginationConfig,
    filters: Record<string, FilterValue | null>,
    sorter: SorterResult<HabitRecord> | SorterResult<HabitRecord>[]
  ) => {
    setPage(pagination.current || 1);
    setPageSize(pagination.pageSize || 10);
  };
  return (
    <Table
      style={{
        marginTop: '2rem',
      }}
      onRow={(data, index) => {
        return {
          style: { cursor: 'pointer' },
          onClick: (e) => {
            router.push(`/habits/${data.id}`);
          },
        };
      }}
      size={isLg ? 'large' : 'small'}
      columns={columns}
      rowKey={'id'}
      dataSource={tableData}
      pagination={{
        position: ['topCenter'],
        size: isLg ? 'default' : 'small',
        pageSize: pageSize,
        current: page,
        total: totalItems,
        showQuickJumper: true,
        showSizeChanger: true,
        showTotal: (total, range) => {
          return `Displaying ${range[0]}-${range[1]} of total ${totalItems} habits`;
        },
      }}
      loading={loading}
      onChange={handleTableChange}
    />
  );
}
