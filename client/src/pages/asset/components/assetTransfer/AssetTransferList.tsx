import { Button, Input, InputRef, List, Space, Table, TableColumnType } from 'antd';
import app from 'axiosConfig';
import { getErrorMessage } from 'helpers/getErrorMessage';
import { IAssetTransfer } from 'interface';
import { Tag } from 'antd';
import empty from '../../../../images/empty-box.png';
import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import Highlighter from 'react-highlight-words';
import { SearchOutlined } from '@ant-design/icons';
import { FilterDropdownProps } from 'antd/es/table/interface';

const AssetTransferList = () => {
  const [data, setData] = useState<IAssetTransfer[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchText, setSearchText] = useState('');
  const [searchedColumn, setSearchedColumn] = useState('');
  const searchInput = useRef<InputRef>(null);

  const navigate = useNavigate();

  const handleGetAuditList = async () => {
    try {
      setLoading(true);
      const {
        data: { data },
      } = await app.get('/api/get-asset-transfer-list');
      setData([...data].sort((a, b) => b.id - a.id));
    } catch (error) {
      const message = getErrorMessage(error);
      alert(message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    handleGetAuditList();
  }, []);

  const handleSearch = (
    selectedKeys: string[],
    confirm: FilterDropdownProps['confirm'],
    dataIndex: any
  ) => {
    confirm();
    setSearchText(selectedKeys[0]);
    setSearchedColumn(dataIndex);
  };

  const handleReset = (clearFilters: () => void) => {
    clearFilters();
    setSearchText('');
  };

  const getColumnSearchProps = (dataIndex: any): TableColumnType<IAssetTransfer> => ({
    filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters, close }) => (
      <div style={{ padding: 8 }} onKeyDown={(e) => e.stopPropagation()}>
        <Input
          ref={searchInput}
          size="middle"
          value={selectedKeys[0]}
          onChange={(e) => setSelectedKeys(e.target.value ? [e.target.value] : [])}
          onPressEnter={() => handleSearch(selectedKeys as string[], confirm, dataIndex)}
          style={{ marginBottom: 8, display: 'block', maxWidth: 150 }}
        />
        <Space>
          <Button
            type="primary"
            onClick={() => handleSearch(selectedKeys as string[], confirm, dataIndex)}
            icon={<SearchOutlined />}
            size="small"
          >
            Tìm kiếm
          </Button>
          <Button onClick={() => clearFilters && handleReset(clearFilters)} size="small">
            Xóa
          </Button>
        </Space>
      </div>
    ),
    filterIcon: (filtered: boolean) => (
      <SearchOutlined style={{ color: filtered ? '#1677ff' : undefined }} />
    ),
    onFilter: (value, record) =>
      record[dataIndex as keyof IAssetTransfer]
        .toString()
        .toLowerCase()
        .includes((value as string).toLowerCase()),
    render: (text) =>
      searchedColumn === dataIndex ? (
        <Highlighter
          highlightStyle={{ backgroundColor: '#ffc069', padding: 0 }}
          searchWords={[searchText]}
          autoEscape
          textToHighlight={text ? text.toString() : ''}
        />
      ) : (
        text
      ),
  });

  const borderColorByState: { [key: string]: string } = {
    draft: 'black',
    transfer: '#FFB534',
    done: '#3787c4ff',
    validated: '#0D7C66',
    cancel: '#EE4E4E',
  };

  const stateToVietnamese: { [key: string]: string } = {
    draft: 'Nháp',
    transfer: 'Đang thực hiện',
    done: 'Hoàn thành',
    validated: 'Đã xác nhận',
    cancel: 'Bị hủy',
  };

  const columns = [
    {
      title: 'Mã phiếu',
      dataIndex: 'name',
      width: 50,
      key: 'name',
      render: (text: any) => <span style={{ fontSize: 12 }}>{text}</span>,
      ...getColumnSearchProps('name'),
    },
    {
      title: 'Người giao',
      dataIndex: 'handover_employee',
      width: 40,
      key: 'handover_employee',
      render: (text: any) => <span style={{ fontSize: 12 }}>{text}</span>,
      ...getColumnSearchProps('handover_employee'),
    },
    {
      title: 'Người nhận',
      dataIndex: 'receiver_employee',
      width: 40,
      key: 'receiver_employee',
      render: (text: any) => <span style={{ fontSize: 12 }}>{text}</span>,
      ...getColumnSearchProps('receiver_employee'),
    },
    {
      title: 'Trạng thái',
      dataIndex: 'state',
      key: 'state',
      width: 40,
      align: 'center' as const,
      filters: [
        {
          text: 'Nháp',
          value: 'draft',
        },
        {
          text: 'Đang thực hiện',
          value: 'transfer',
        },
        {
          text: 'Hoàn thành',
          value: 'done',
        },
        {
          text: 'Đã xác nhận',
          value: 'validated',
        },
        {
          text: 'Bị hủy',
          value: 'cancel',
        },
      ],
      onFilter: (value: any, record: any) => record.state === value,
      render: (text: any) => (
        <span style={{ fontSize: 12, textAlign: 'center' }}>{stateToVietnamese[text]}</span>
      ),
    },
  ];

  let locale = {
    emptyText: (
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <img src={empty} style={{ width: '70px', opacity: 0.4 }} alt="" />
        <span style={{ fontSize: 12, marginTop: 10, opacity: 1 }}>Không có dữ liệu</span>
      </div>
    ),
  };

  return (
    <div style={{ padding: '1rem' }}>
      {loading ? (
        <Skeleton count={3} height={100} borderRadius={10} style={{ marginBottom: 6 }} />
      ) : (
        <Table
          columns={columns}
          dataSource={data.map((item) => ({
            ...item,
            receiver_employee: item.receiver_employee_id ? item.receiver_employee_id[1] : '',
            handover_employee: item.handover_employee_id ? item.handover_employee_id[1] : '',
          }))}
          size="small"
          locale={locale}
          bordered
          sticky={true}
          pagination={{
            simple: true,
            size: 'small',
            position: ['topCenter'],
            pageSize: 40,
            showTotal: (total, range) => (
              <span style={{ fontSize: 12 }}>
                {range[0]}-{range[1]} / {total}
              </span>
            ),
          }}
          onRow={(record) => {
            return {
              onClick: (_) => {
                navigate(`/asset/transfer/${record.id}`);
              },
            };
          }}
          rowKey={(record) => record.id}
        />
      )}
    </div>
  );
};

export default AssetTransferList;
