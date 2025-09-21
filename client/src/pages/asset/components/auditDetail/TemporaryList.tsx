import { IAssetInventory, IAssetInventoryAssetTemporary, IAudit } from 'interface'
import empty from '../../../../images/empty-box.png'
import check from '../../../../images/check.png'
import cross from '../../../../images/letter-x.png'
import Table from 'antd/es/table/Table'
import { SearchOutlined } from '@ant-design/icons';
import { InputRef, TableColumnType,Select } from 'antd';
import { Button, Input, Space } from 'antd';
import type { FilterDropdownProps } from 'antd/es/table/interface';
import Highlighter from 'react-highlight-words'
import { useEffect, useRef, useState } from 'react';
import { myColor } from 'color'
import InventoryTemLineDetail from './inventoryTemLineDetail/InventoryTemLineDetail'

type DataIndex = keyof IAssetInventoryAssetTemporary;



const TemporaryList = ({refetchAssetInventoryLines, auditData,inventoryLines}:{refetchAssetInventoryLines:(i:boolean)=>void,auditData:IAudit | null,inventoryLines:IAssetInventoryAssetTemporary[]}) => {
  const [searchText, setSearchText] = useState('');
  const [searchedColumn, setSearchedColumn] = useState('');
  const [open,setOpen] = useState<any>(false)
  const [filteredData,setFilteredData] = useState<IAssetInventoryAssetTemporary[]>([])
  const searchInput = useRef<InputRef>(null);

  const handleSearch = (
    selectedKeys: string[],
    confirm: FilterDropdownProps['confirm'],
    dataIndex: DataIndex,
  ) => {
    confirm();
    setSearchText(selectedKeys[0]);
    setSearchedColumn(dataIndex);
  };

  const handleReset = (clearFilters: () => void) => {
    clearFilters();
    setSearchText('');
  };

  const getColumnSearchProps = (dataIndex: DataIndex): TableColumnType<IAssetInventoryAssetTemporary> => ({
    filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters, close }) => (
      <div style={{ padding: 8,}} onKeyDown={(e) => e.stopPropagation()}>
        <Input
          ref={searchInput}
          size='middle'
          placeholder={`Tìm tên hoặc mã TS`}
          value={selectedKeys[0]}
          onChange={(e) => setSelectedKeys(e.target.value ? [e.target.value] : [])}
          onPressEnter={() => handleSearch(selectedKeys as string[], confirm, dataIndex)}
          style={{ marginBottom: 8, display: 'block',maxWidth:150 }}
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
          <Button
            onClick={() => clearFilters && handleReset(clearFilters)}
            size="small"
          >
            Xóa
          </Button>
        </Space>
      </div>
    ),
    filterIcon: (filtered: boolean) => (
      <SearchOutlined style={{ color: filtered ? '#1677ff' : undefined }} />
    ),
    onFilter: (value, record) =>
      record[dataIndex]
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

  const columns = [
    {
      title: 'Tên tài sản',
      dataIndex: 'name',
      key: 'name',
      render: (text:any) => <span style={{fontSize:12}}>{text}</span>,
      ...getColumnSearchProps("name"),
    },
    {
      title: 'Mô tả',
      dataIndex: 'description',
      key: 'description',
      render: (text:any) => <span style={{fontSize:12}}>{text}</span>,
    },
    {
      title: 'TT',
      dataIndex: 'quantity_thuc_te',
      key: 'quantity_thuc_te',
      width:40,
      align: 'center' as const,
      render: (text:any) => <span style={{fontSize:12}}>{text}</span>,
    },
    {
      title: 'ĐX',
      dataIndex: 'is_done',
      key: 'is_done',
      width:60,
      align: 'center' as const,
      filters: [
        {
          text: 'Đã kiểm kê',
          value: true,
        },
        {
          text: 'Chưa kiểm kê',
          value: false,
      },],
      onFilter: (value:any, record:any) => record.is_done === value,
      render: (text:any) => <span style={{fontSize:12}}><img alt="" style={{height:15}} src={text ? check : cross}/></span>,
    },
  ]

  let locale = {
    emptyText: (
        <div style={{display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center'}}>
        <img src={empty} style={{width:'70px',opacity:0.4}} alt=""/>
        <span style={{fontSize:12, marginTop:10,opacity:1}}>Không có dữ liệu</span>
    </div>
    )
  };

  const handleRefetchInventoryList = async () => {
    refetchAssetInventoryLines(false);
  }

  useEffect(()=>{
    setFilteredData(inventoryLines)
  },[])
  

  return (
    <>
    {['draft','process'].some(i => i === auditData?.state) && <div style={{padding:'0 1rem 0rem', marginBottom: inventoryLines.length === 0  ? 16 : 0}}>
        <Button 
            size='large'
            onClick={()=>setOpen(true)}
            style={{background:myColor.buttonColor, padding:16,textAlign:'center',fontWeight:500,color:'white',width:'100%',fontSize:13}}>
            Tạo mới phát sinh
        </Button>
    </div>}
      {
        inventoryLines.length === 0 
        ?
        <div style={{display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center'}}>
            <img src={empty} style={{width:'70px',opacity:0.5}} alt=""/>
            <span style={{fontSize:12, marginTop:10,opacity:0.5}}>Không có dữ liệu</span>
        </div>
        :
        <div 
          style={{paddingBottom:10,
            padding:'0 1rem 0rem',
            position:'relative',
            marginTop:5,
            height: "calc(100vh - 130px)",
            overflow: "auto"
        }}>
          <Table 
            columns={columns} 
            dataSource={filteredData.map(i => {
                return {
                    ...i,
                    name: i.code ? `[${i.code}] ${i.name}` : i.name
                }
            })} 
            size='small'
            locale={locale}
            bordered
            sticky={true} 
            pagination={{ 
              simple:true,
              size:'small',
              position: ['topCenter'],
              pageSize: 40,
              showTotal:(total, range) => <span style={{fontSize:12}}>{range[0]}-{range[1]} / {total}</span>
            }}
            onRow={(record) => {
              return {
                onClick: (_) => {
                  setOpen(record)
                },
              };
            }}
            rowKey={record => record.id} />
        </div>
      }
      {
        open && auditData && <InventoryTemLineDetail handleRefetchInventoryList={handleRefetchInventoryList} openEdit={open} setOpenEdit={setOpen} auditData={auditData}/>
      }
    </>
  )
}

export default TemporaryList