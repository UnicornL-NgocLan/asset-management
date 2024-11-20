import moment from "moment"
import Empty from "widgets/Empty";

const InventoryInfo = ({data}:{data:{[key:string]:any}[]}) => {
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
                    <div>
                        <h4 style={{margin:0,fontWeight:500, fontSize:13}}>{item.validated_date && moment(item.validate_date).add(7, 'hours').format("DD-MM-YYYY")} {item.asset_inventory_id && `(${item.asset_inventory_id[1]})`}</h4>
                        <hr/>
                        <div>
                            <p style={{fontSize:12,margin:'0.5rem 0'}}><span style={{fontWeight:500}}>Số lượng sổ sách:</span> {item.quantity_so_sach}</p>
                            <p style={{fontSize:12,margin:'0.5rem 0'}}><span style={{fontWeight:500}}>Số lượng thực tế: </span> {item.quantity_thuc_te}</p>
                            <p style={{fontSize:12,margin:'0.5rem 0'}}><span style={{fontWeight:500}}>Người sử dụng: </span> {item.asset_user_temporary && item.asset_user_temporary[1]}</p>
                            <p style={{fontSize:12,margin:'0.5rem 0'}}><span style={{fontWeight:500}}>Trạng thái:</span> {item.status === 'dang_su_dung'? "Đang sử dụng" : "Hư hỏng"}</p>
                            <p style={{fontSize:12,margin:'0.5rem 0'}}><span style={{fontWeight:500}}>Ghi chú:</span> {item.note}</p>
                            <p style={{fontSize:12,margin:'0.5rem 0'}}><span style={{fontWeight:500}}>Đề xuất xử lý:</span> {item.de_xuat_xu_ly}</p>
                            <p style={{fontSize:12,margin:'0.5rem 0'}}><span style={{fontWeight:500}}>Giải trình:</span> {item.giai_trinh}</p>
                        </div>
                    </div>
                </div>
            })
        }
    </div>
  )
}

export default InventoryInfo