import { List } from 'antd';
import app from 'axiosConfig';
import { getErrorMessage } from 'helpers/getErrorMessage';
import { IAuditItemInList } from 'interface';
import { Tag } from 'antd';
import moment from 'moment';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import stickyNote from '../../../../images/post-it.png';
import marker from '../../../../images/placeholder.png';
import clock from '../../../../images/clock.png';
import rightArrow from '../../../../images/right-arrow.png';

import Skeleton from 'react-loading-skeleton'
import 'react-loading-skeleton/dist/skeleton.css'
import { useSelector } from 'react-redux';
import Empty from 'widgets/Empty';

const AuditList = ({state}:{state:number}) => {
    const [audits,setAudits] = useState<IAuditItemInList[]>([]);
    const [filteredAudits,setFilteredAudits] = useState<IAuditItemInList[]>([]);
    const [loading,setLoading] = useState(true);
    const offices = useSelector((state:any)=>state.offices)

    const navigate = useNavigate()

    const handleGetAuditList = async () => {
        try {
            setLoading(true);
            const {data:{data}} = await app.get("/api/get-audit-list");
            setAudits([...data].sort((a,b)=> b.id - a.id));
            setFilteredAudits([...data]);
        } catch (error) {
            const message = getErrorMessage(error);
            alert(message);
        } finally {
            setLoading(false);
        }
    }

    const handleShowAuditLocation = (idList:number[]) => {
        if(idList.length === 0) return <></>
        const officeList = [...idList].map((id)=>{
            const office = offices.find((item: {id:number,name:string}) => item.id === id);
            if(!office) return <></>
            return <Tag style={{margin:0,fontSize:10}} key={office.id}>{office?.name}</Tag>
        })

        return officeList

    }

    useEffect(()=>{
        handleGetAuditList();
    },[]);

    useEffect(()=>{
        switch(state){
            case 0:
                setFilteredAudits([...audits]);
                break;
            case 1:
                setFilteredAudits([...audits].filter((i)=> i.state === 'draft'));
                break;
            case 2:
                setFilteredAudits([...audits].filter((i)=> i.state === 'process'));
                break;
            case 3:
                setFilteredAudits([...audits].filter((i)=> i.state === 'validated'));
                break;
            case 4:
                setFilteredAudits([...audits].filter((i)=> i.state === 'cancel'));
                break;
            default:
                setFilteredAudits([...audits]);
        }
    },[state])

    const borderColorByState : { [key: string]: string }  = {
        draft:'#F3F3F3',
        process:'#FFB534',
        validated:'#0D7C66',
        cancel:'#EE4E4E'
    }

    if(!loading && filteredAudits.length === 0) return <div style={{padding:'1rem 0'}}><Empty/></div>

  return (
    <div style={{padding:'1rem'}}>
        {
            loading
            ?
            <Skeleton count={3} height={100} borderRadius = {10} style={{marginBottom:6}}/>
            :
            <List
                itemLayout="horizontal"
                dataSource={filteredAudits}
                renderItem={(item:IAuditItemInList, index) => (
                <List.Item 
                onClick={()=>navigate(`/asset/audit/${item.id}`)}
                key={index} style={{
                    display:'block',
                    background:'white',
                    marginBottom:10,
                    borderRadius:5, 
                    boxShadow:'2px 2px 1px rgba(0,0,0,0.2)',
                    borderRight: `8px solid ${borderColorByState[item.state]}`,
                    padding:8
                }}>
                    <List.Item.Meta
                    title={<a style={{margin:0, fontSize:14,fontWeight:500}}>{item.name}</a>}
                    />
                    <div style={{display:'flex',flexDirection:'column',gap:5}}>
                        {
                            item.start_time && item.end_time
                            ?
                            <span style={{margin:0, fontSize:12, display:'flex', gap:10,alignItems:'center'}}>
                                <img alt='' src={clock} style={{height:14}}/>
                                {moment(item.start_time).add(7, 'hours').format("DD-MM-YYYY HH:mm")}
                                <img alt='' src={rightArrow} style={{height:14}}/>
                                {moment(item.end_time).add(7, 'hours').format("DD-MM-YYYY HH:mm")}
                            </span>
                            :
                            item.start_time && !item.end_time
                            ?
                            <span style={{margin:0, fontSize:12, display:'flex', gap:10,alignItems:'center'}}>
                                <img alt='' src={clock} style={{height:14}}/>
                                <span style={{margin:0, fontSize:12}}>{`Ngày bắt đầu: ${item.start_time && moment(item.start_time).add(7, 'hours').format("DD-MM-YYYY HH:mm") || ""}`}</span>
                            </span>
                            :
                            !item.start_time && item.end_time
                            ?
                            <span style={{margin:0, fontSize:12, display:'flex', gap:10,alignItems:'center'}}>
                                <img alt='' src={clock} style={{height:14}}/>
                                <span style={{margin:0, fontSize:12}}>{`Ngày kết thúc: ${item.end_time && moment(item.end_time).add(7, 'hours').format("DD-MM-YYYY HH:mm") || ""}`}</span>
                            </span>
                            :
                            <span style={{margin:0, fontSize:12, display:'flex', gap:10,alignItems:'center'}}>
                                <img alt='' src={clock} style={{height:14}}/>
                                <span style={{margin:0, fontSize:12}}>Không có</span>
                            </span>
                        }
                        <span style={{margin:0, fontSize:12, display:'flex', gap:5,alignItems:'center',flexWrap:'wrap'}}>
                            <img alt='' src={marker} style={{height:14}}/>
                            {item.sea_office_id.length === 0 ? <span>Không có</span> :handleShowAuditLocation(item.sea_office_id)}
                        </span>
                        {item.note && <span style={{margin:0, fontSize:12, display:'flex', gap:5,alignItems:'center'}}>
                            <img alt='' src={stickyNote} style={{height:14}}/>
                            {item.note}
                        </span>}
                    </div>
                </List.Item>
                )}
            />
        }
    </div>
  )
}

export default AuditList