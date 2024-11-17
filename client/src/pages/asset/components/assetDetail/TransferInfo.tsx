import to from "../../../../images/right-arrow.png"
import moment from "moment"
import Empty from "widgets/Empty"

const TransferInfo = ({data}:{data:{[key:string]:any}[]}) => {
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
    <div style={{overflow:'auto',padding:'0.25rem 0.25rem 1rem'}}>
        {
            data.length === 0
            ?
            <Empty/>
            :
            data.sort((a,b)=> b.id - a.id).map((item)=> {
                return <div key={item.id} style={{background:'white',padding:'0.5rem 1rem', marginBottom:16, borderRadius:5,boxShadow:'2px 2px 2px rgba(0,0,0,0.2)'}}>
                    <div style={{display:'flex',alignItems:'center',justifyContent:"space-between",gap:10}}>
                        <h4 style={{margin:0,fontWeight:500, fontSize:13, textAlign:'center'}}>{item.source_location_id && item.source_location_id[1] }</h4>
                        <img src={to} alt="" style={{width:13}}/>
                        <h4 style={{margin:0,fontWeight:500, fontSize:13, textAlign:'center'}}>{item.dest_location_id && item.dest_location_id[1] }</h4>
                    </div>
                    <hr/>
                    <div>
                        <div>
                            <p style={{fontSize:12,margin:'0.5rem 0'}}><span style={{fontWeight:500}}>Ngày điều chuyển:</span> {item.validate_date && moment(item.validate_date).add(7, 'hours').format("DD-MM-YYYY")}</p>
                            <p style={{fontSize:12,margin:'0.5rem 0'}}><span style={{fontWeight:500}}>Hoàn thành:</span> {item.quantity_done}/{item.quantity_demanding}</p>
                            <p style={{fontSize:12,margin:'0.5rem 0'}}><span style={{fontWeight:500}}>Công ty nhận: </span> {item.dest_company && item.dest_company[1]}</p>
                            <p style={{fontSize:12,margin:'0.5rem 0'}}><span style={{fontWeight:500}}>Phòng ban nhận:</span> {item.dest_department && item.dest_department[1]}</p>
                            <p style={{fontSize:12,margin:'0.5rem 0'}}><span style={{fontWeight:500}}>Trạng thái khi điều chuyển:</span> {translateState(item.asset_status_transfer)}</p>
                            <p style={{fontSize:12,margin:'0.5rem 0'}}><span style={{fontWeight:500}}>Ghi chú:</span> {item.note}</p>
                        </div>
                    </div>
                </div>
            })
        }
    </div>
  )
}

export default TransferInfo