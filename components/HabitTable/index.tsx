import { useState, useEffect, MouseEventHandler } from 'react';
import {
  TablePaginationConfig,
  TableColumnsType,
  Table,
  Tag,
  Button,
} from 'antd';
import { FilterValue, SorterResult } from 'antd/es/table/interface';
import prettyMilliseconds from 'pretty-ms';
import cronstrue from 'cronstrue';
import { useMedia } from 'react-use';
import { useRouter } from 'next/router';
import { ago, pocketbaseClient, breakPoints, HabitRecord } from '../../utils';
import { DeleteOutlined } from '@ant-design/icons';

const columns: TableColumnsType<HabitRecord> = [
  {
    title: 'Name',
    dataIndex: 'habit_name',
    key: 'habit_name',
    render: (value: string) => {
      return <span className='text-xs sm:text-sm md:text-base'>{value}</span>;
    },
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
        return (
          <Tag className='scale-75 sm:scale-100' color='volcano'>
            N/A
          </Tag>
        );
      }
      return (
        <Tag className='scale-75 sm:scale-100' color='cyan'>
          {prettyMilliseconds(target * 1000)}
        </Tag>
      );
    },
  },
  {
    title: 'Schedule',
    dataIndex: 'cron',
    key: 'cron',
    render: (cron: string) => {
      return (
        <span className='text-xs sm:text-sm md:text-base'>
          {cronstrue.toString(cron)}
        </span>
      );
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
  const [selectedRecords, setSelectedRecords] = useState<string[]>([]);
  const [key, setKey] = useState(0);

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
  }, [page, pageSize, key]);

  const handleTableChange = (
    pagination: TablePaginationConfig,
    filters: Record<string, FilterValue | null>,
    sorter: SorterResult<HabitRecord> | SorterResult<HabitRecord>[]
  ) => {
    setPage(pagination.current || 1);
    setPageSize(pagination.pageSize || 10);
  };

  const rowSelection = {
    onChange: (selectedRowKeys: React.Key[], selectedRows: HabitRecord[]) => {
      setSelectedRecords(selectedRows.map((v) => v.id));
    },
  };

  const onDeleteSelectedClick: MouseEventHandler = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      await Promise.all(
        selectedRecords.map((id) => {
          return pocketbaseClient.collection('habits').delete(id, {
            // $cancelKey: `delete ${id}`,
            $autoCancel: false,
          });
        })
      );
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
      setSelectedRecords([]);
      setKey(Math.random());
    }
  };

  return (
    <Table
      key={key}
      title={() => {
        return (
          <Button
            disabled={selectedRecords.length <= 0}
            style={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
            }}
            onClick={onDeleteSelectedClick}
            danger
          >
            <DeleteOutlined />
            Remove selected
          </Button>
        );
      }}
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
      // scroll={{ y: 420 }}
      size={isLg ? 'large' : 'small'}
      columns={columns}
      rowKey={'id'}
      rowSelection={{
        type: 'checkbox',
        ...rowSelection,
      }}
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
