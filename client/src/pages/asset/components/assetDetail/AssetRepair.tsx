import moment from "moment";
import Empty from "widgets/Empty";

const AssetRepair = ({data}:{data:{[key:string]:any}[]}) => {
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
                        <div>
                            <p style={{fontSize:12,margin:'0.5rem 0'}}><span style={{fontWeight:500}}>Ngày bắt đầu: </span> {item.repair_date_start && moment(item.repair_date_start).add(7, 'hours').format("DD-MM-YYYY")}</p>
                            <p style={{fontSize:12,margin:'0.5rem 0'}}><span style={{fontWeight:500}}>Ngày kết thúc: </span> {item.repair_date_end && moment(item.repair_date_end).add(7, 'hours').format("DD-MM-YYYY")}</p>
                            <p style={{fontSize:12,margin:'0.5rem 0'}}><span style={{fontWeight:500}}>Số lượng: </span> {item.quantity}</p>
                            <p style={{fontSize:12,margin:'0.5rem 0'}}><span style={{fontWeight:500}}>Đơn vị sửa chữa:</span> {item.repair_party}</p>
                            <p style={{fontSize:12,margin:'0.5rem 0'}}><span style={{fontWeight:500}}>Nơi xảy ra sự có:</span> {item.accident_place}</p>
                            <p style={{fontSize:12,margin:'0.5rem 0'}}><span style={{fontWeight:500}}>Miêu tả:</span> {item.description}</p>
                        </div>
                    </div>
                </div>
            })
        }
    </div>
  )
}

export default AssetRepair