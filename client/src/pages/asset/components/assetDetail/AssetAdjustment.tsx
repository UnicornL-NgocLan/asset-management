import moment from 'moment';
import increase from "../../../../images/increase.png"
import decrease from "../../../../images/decrease.png"
import Empty from 'widgets/Empty';

const AssetAdjustment = ({data}:{data:{[key:string]:any}[]}) => {
    const translateState = (text:string)=>{
        switch (text){
            case ('good'):
                return 'Tốt';
            case ('damaged_waiting_for_repair'):
                return 'Hư hỏng chờ sửa chữa';
            case ('damaged_waiting_for_liquidation'):
                return 'Hư hỏng chờ thanh lý';
            case ('self_destruct'):
                return 'Tự hư hỏng';
            case ('open'):
                return 'Đang sử dụng';
            case ('pending'):
                return 'Đang chờ';
            case ('draft'):
                return 'Nháp';
            case ('liquidation'):
                return 'Đã thanh lý'
            default:
                return text;
        }
    }
  return (
    <div style={{overflow:'auto',padding:'0.25rem 0.25rem 1.5rem'}}>
        {
            data.length === 0
            ?
            <Empty/>
            :
            data.sort((a,b)=> b.id - a.id).map((item)=> {
                return <div key={item.id} style={{background:'white',padding:'0.5rem 1rem', marginBottom:16, borderRadius:5,boxShadow:'2px 2px 2px rgba(0,0,0,0.2)'}}>
                    <div>
                        <h4 style={{margin:0,fontWeight:500, fontSize:13}}>{item.date_adjustment && moment(item.date_adjustment).add(7, 'hours').format("DD-MM-YYYY")} {item.adjustment_code && `(${item.adjustment_code})`}</h4>
                        <hr/>
                        <div>
                            <p style={{fontSize:12,margin:'0.5rem 0',display:'flex',alignItems:'center'}}><span style={{fontWeight:500}}>Số lượng điều chỉnh: </span><img src={item.increase_quantity >= 0 ? increase : decrease} alt="" style={{height:15}}/> {item.increase_quantity < 0 ? item.increase_quantity * -1 : item.increase_quantity}</p>
                            <p style={{fontSize:12,margin:'0.5rem 0'}}><span style={{fontWeight:500}}>Mô tả: </span> {item.description}</p>
                            <p style={{fontSize:12,margin:'0.5rem 0'}}><span style={{fontWeight:500}}>Tài liệu tham chiếu: </span> {item.document_ref}</p>
                            <p style={{fontSize:12,margin:'0.5rem 0'}}><span style={{fontWeight:500}}>Nhà cung cấp:</span> {item.vendor_name}</p>
                        </div>
                    </div>
                </div>
            })
        }
    </div>
  )
}

export default AssetAdjustment