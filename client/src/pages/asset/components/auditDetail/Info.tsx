import { Tag } from 'antd'
import { myColor } from 'color'
import { IAssetInventoriedDept, IAudit, ICommitee } from 'interface'
import moment from 'moment'
import { useSelector } from 'react-redux'
import Empty from 'widgets/Empty'
import { Table } from 'antd';
import Check from '../../../../images/check.png'
import Cross from '../../../../images/letter-x.png'
import empty from '../../../../images/empty-box.png'

const Info = ({auditData,commitee,inventoriedDept}:{auditData:IAudit | null,commitee:ICommitee[],inventoriedDept:IAssetInventoriedDept[]}) => {
    const offices = useSelector((state:any)=>state.offices);
    const departments = useSelector((state:any)=>state.departments);

    const handleShowAuditLocation = (idList:number[]) => {
        if(idList.length === 0) return <></>
        const officeList = [...idList].map((id)=>{
            const office = offices.find((item: {id:number,name:string}) => item.id === id);
            if(!office) return <></>
            return <Tag style={{margin:0,fontSize:10}} key={office.id}>{office?.name}</Tag>
        })

        return officeList

    }

    const handleShowAuditDepartments = (idList:number[]) => {
        if(idList.length === 0) return <></>
        const depLists = [...idList].map((id)=>{
            const dept = departments.find((item: {id:number,name:string}) => item.id === id);
            if(!dept) return <></>
            return <Tag style={{margin:0,fontSize:10}} key={dept.id}>{dept?.name}</Tag>
        })

        return depLists

    }

    const stateTranslator :  { [key: string]: string } = {
        draft:'Nháp',
        process:'Đang thực hiện',
        validated:'Đã hoàn tất',
        cancel:'Bị hủy'
    }

    const stateColor : { [key: string]: string }  = {
        draft:'',
        process:'#FFB534',
        validated:'#0D7C66',
        cancel:'#EE4E4E'
    }

    const columns = [
        {
          title: 'Họ và tên',
          dataIndex: 'employee_id_temp',
          key: 'employee_id_temp',
          width:150,
          render: (text:any) => <span style={{fontSize:12}}>{text ? text[1] : ''}</span>,
        },
        {
          title: 'Vai trò',
          dataIndex: 'position',
          key: 'position',
          render: (text:any) => <span style={{fontSize:12}}>{text ? text[1] : ''}</span>,
        },
    ]

    const columns2 = [
        {
          title: 'Họ và tên',
          dataIndex: 'employee_id_temp',
          key: 'employee_id_temp',
          width:150,
          render: (text:any) => <span style={{fontSize:12}}>{text ? text[1] : ''}</span>,
        },
        {
          title: 'Phòng ban',
          dataIndex: 'department',
          key: 'department',
          render: (text:any) => <span style={{fontSize:12}}>{text ? text[1] : ''}</span>,
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

    if(!auditData) return <Empty/>
  return (
    <div style={{paddingBottom:20,padding:'0 1rem 1rem'}}>
        <div style={{background:'white',padding:'0.5rem 1rem', borderRadius:5,boxShadow:'2px 2px 2px rgba(0,0,0,0.2)'}}>
            <h4 style={{margin:0,fontWeight:500, fontSize:14, color:myColor.buttonColor}}>Thông tin chung</h4>
            <hr/>
            <div>
                <div>
                    <p style={{fontSize:12,margin:'0.5rem 0'}}><span style={{fontWeight:500}}>Tên:</span> {auditData.name}</p>
                    <p style={{fontSize:12,margin:'0.5rem 0'}}><span style={{fontWeight:500}}>Ngày bắt đầu:</span> {auditData.start_time && moment(auditData.start_time).add(7, 'hours').format("DD-MM-YYYY HH:mm:ss")}</p>
                    <p style={{fontSize:12,margin:'0.5rem 0'}}><span style={{fontWeight:500}}>Ngày kết thúc:</span> {auditData.end_time && moment(auditData.end_time).add(7, 'hours').format("DD-MM-YYYY HH:mm:ss")}</p>
                    <p style={{fontSize:12,margin:'0.5rem 0', display:'flex',alignItems:'center',gap:5, flexWrap:'wrap'}}><span style={{fontWeight:500}}>Địa điểm: </span> {handleShowAuditLocation(auditData.sea_office_id)}</p>
                    <p style={{fontSize:12,margin:'0.5rem 0', display:'flex',alignItems:'center',gap:5, flexWrap:'wrap'}}><span style={{fontWeight:500}}>Phòng ban: </span> {handleShowAuditDepartments(auditData.department)}</p>
                    <p style={{fontSize:12,margin:'0.5rem 0'}}><span style={{fontWeight:500}}>Ghi chú: </span> {auditData.note}</p>
                    <p style={{fontSize:12,margin:'0.5rem 0'}}><span style={{fontWeight:500}}>Trạng thái: </span> <Tag color={stateColor[auditData.state]}>{stateTranslator[auditData.state]}</Tag></p>
                </div>
            </div>
        </div>

        <div style={{background:'white',padding:'0.5rem 1rem', marginTop:16, borderRadius:5,boxShadow:'2px 2px 2px rgba(0,0,0,0.2)'}}>
            <h4 style={{margin:0,fontWeight:500, fontSize:14, color:myColor.buttonColor}}>Kiểm kê tài sản có trạng thái</h4>
            <hr/>
            <div>
                <div>
                    <p style={{fontSize:12,margin:'0.5rem 0', display:'flex',alignItems:'center', gap:4}}><span style={{fontWeight:500}}>Nháp:</span> <img alt="" src={auditData.draft_state ? Check : Cross} style={{height:14}}/></p>
                    <p style={{fontSize:12,margin:'0.5rem 0', display:'flex',alignItems:'center', gap:4}}><span style={{fontWeight:500}}>Đang hoạt động:</span> <img alt="" src={auditData.process_state ? Check : Cross} style={{height:14}}/></p>
                    <p style={{fontSize:12,margin:'0.5rem 0', display:'flex',alignItems:'center', gap:4}}><span style={{fontWeight:500}}>Chờ:</span> <img alt="" src={auditData.pending_state ? Check : Cross} style={{height:14}}/></p>
                    <p style={{fontSize:12,margin:'0.5rem 0', display:'flex',alignItems:'center', gap:4}}><span style={{fontWeight:500}}>Đã thanh lý:</span> <img alt="" src={auditData.liquidation_state ? Check : Cross} style={{height:14}}/></p>
                </div>
            </div>
        </div>

        <div style={{background:'white',padding:'0.5rem 1rem 1rem', marginTop:16, borderRadius:5,boxShadow:'2px 2px 2px rgba(0,0,0,0.2)'}}>
            <h4 style={{margin:0,fontWeight:500, fontSize:14, color:myColor.buttonColor}}>Thành viên ban kiểm kê</h4>
            <hr/>
            <div>
                {
                commitee.length === 0 
                ?
                <div style={{display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center'}}>
                    <img src={empty} style={{width:'70px',opacity:0.5}} alt=""/>
                    <span style={{fontSize:12, marginTop:10,opacity:0.5}}>Không có dữ liệu</span>
                </div>
                :
                <Table 
                    columns={columns} 
                    dataSource={commitee} 
                    size='small'
                    locale={locale}
                    bordered
                    pagination={false}
                    rowKey={record => record.id} />
                }
            </div>
        </div>

        <div style={{background:'white',padding:'0.5rem 1rem 1rem', marginTop:16, borderRadius:5,boxShadow:'2px 2px 2px rgba(0,0,0,0.2)'}}>
            <h4 style={{margin:0,fontWeight:500, fontSize:14, color:myColor.buttonColor}}>Đại diện đơn vị được kiểm kê</h4>
            <hr/>
            <div>
                {
                inventoriedDept.length === 0 
                ?
                <div style={{display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center'}}>
                    <img src={empty} style={{width:'70px',opacity:0.5}} alt=""/>
                    <span style={{fontSize:12, marginTop:10,opacity:0.5}}>Không có dữ liệu</span>
                </div>
                :
                <Table 
                    columns={columns2} 
                    dataSource={inventoriedDept} 
                    size='small'
                    locale={locale}
                    bordered
                    pagination={false}
                    rowKey={record => record.id} />
                }
            </div>
        </div>
    </div>
  )
}

export default Info