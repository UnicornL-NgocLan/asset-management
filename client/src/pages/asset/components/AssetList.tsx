import { List } from 'antd'


const AssetList = ({data,handelChosenAsset}:{data:any[],handelChosenAsset:(i:number)=>void}) => {
    const handleViewDetail = (id:number) => {
        handelChosenAsset(id)
    }

  return (
    <div style={{padding:'1rem'}}>
        <List
            itemLayout="horizontal"
            dataSource={data}
            renderItem={(item, index) => (
            <List.Item 
            onClick={()=>handleViewDetail(item.value)}
            key={index} style={{display:'block',background:'white',marginBottom:10,borderRadius:5, boxShadow:'2px 2px 1px rgba(0,0,0,0.2)',
                padding:8
            }}>
                <List.Item.Meta
                title={<a style={{margin:0, fontSize:14,fontWeight:500}}>{item.label}</a>}
                />
                <div>
                    <p style={{margin:0, fontSize:13}}>{`Địa điểm: ${item.location || ''}`}</p>
                    <p style={{margin:0, fontSize:13}}>{`Số lượng: ${item.quantity}`}</p>
                    <p style={{margin:0, fontSize:13}}>{`Nguyên giá: ${new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(item.total_val)}`}</p>
                </div>
            </List.Item>
            )}
        />
    </div>
  )
}

export default AssetList