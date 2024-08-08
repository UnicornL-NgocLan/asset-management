import { myColor } from "color"
import to from "../../../images/right-arrow.png"
import moment from "moment"

const TransferInfo = ({data}:{data:{[key:string]:any}[]}) => {
  return (
    <div style={{overflow:'auto',padding:'0rem 0.25rem 1.5rem'}}>
        {
            data.sort((a,b)=> b.id - a.id).map((item)=> {
                console.log(item)
                return <div key={item.id} style={{background:'white',padding:'0.5rem 1rem', marginTop:16, borderRadius:5,boxShadow:'2px 2px 2px rgba(0,0,0,0.2)'}}>
                    <div style={{display:'flex',alignItems:'center',justifyContent:"space-between",gap:10}}>
                        <h4 style={{margin:0,fontWeight:500, fontSize:13, textAlign:'center'}}>{item.source_location_id && item.source_location_id[1] }</h4>
                        <img src={to} alt="" style={{width:13}}/>
                        <h4 style={{margin:0,fontWeight:500, fontSize:13, textAlign:'center'}}>{item.dest_location_id && item.dest_location_id[1] }</h4>
                    </div>
                    <hr/>
                    <div>
                        <div>
                            <p style={{fontSize:13,margin:'0.75rem 0'}}><span style={{fontWeight:500}}>Ngày điều chuyển:</span> {item.validate_date && moment(item.validate_date).format("DD-MM-YYYY")}</p>
                            <p style={{fontSize:13,margin:'0.75rem 0'}}><span style={{fontWeight:500}}>Hoàn thành:</span> {item.quantity_done}/{item.quantity_demanding}</p>
                            <p style={{fontSize:13,margin:'0.75rem 0'}}><span style={{fontWeight:500}}>Công ty nhận: </span> {item.dest_company && item.dest_company[1]}</p>
                            <p style={{fontSize:13,margin:'0.75rem 0'}}><span style={{fontWeight:500}}>Phòng ban nhận:</span> {item.dest_department && item.dest_department[1]}</p>
                            <p style={{fontSize:13,margin:'0.75rem 0'}}><span style={{fontWeight:500}}>Trạng thái khi điều chuyển:</span> {item.asset_status_transfer}</p>
                            <p style={{fontSize:13,margin:'0.75rem 0'}}><span style={{fontWeight:500}}>Ghi chú:</span> {item.note}</p>
                        </div>
                    </div>
                </div>
            })
        }
    </div>
  )
}

export default TransferInfo