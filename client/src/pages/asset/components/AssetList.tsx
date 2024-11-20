import { List } from 'antd'
import marker from '../../../images/placeholder.png'
import money from '../../../images/dollar.png'
import user from '../../../images/user.png'


const AssetList = ({data,handelChosenAsset}:{data:any[],handelChosenAsset:(i:number)=>void}) => {
    const handleViewDetail = (id:number) => {
        handelChosenAsset(id)
    }

    const handleGetAssetUser = (asset:any) => {
        return asset.asset_user 
            ? asset.asset_user[1] 
            : 'Không có'
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
                title={<span style={{margin:0, fontSize:14,fontWeight:500}}>{item.label}</span>}
                />
                <div>
                    <span style={{margin:0, fontSize:13, display:'flex', gap:5,alignItems:'center'}}>
                        <img alt='' src={marker} style={{height:14}}/>
                        {item.location &&  item.location[1]}
                    </span>
                    <span style={{margin:0, fontSize:13, display:'flex', gap:5,alignItems:'center'}}>
                        <img alt='' src={money} style={{height:14}}/>
                        {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(item.total_val)}
                    </span>
                    <span style={{margin:0, fontSize:13, display:'flex', gap:5,alignItems:'center'}}>
                        <img alt='' src={user} style={{height:14}}/>
                        {handleGetAssetUser(item)}
                    </span>
                </div>
            </List.Item>
            )}
        />
    </div>
  )
}

export default AssetList