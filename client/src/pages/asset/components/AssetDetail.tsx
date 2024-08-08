import axios from 'axios';
import { myColor } from 'color'
import { getErrorMessage } from 'helpers/getErrorMessage';
import React, { useEffect, useState } from 'react'
import { IoArrowBackSharp } from "react-icons/io5";
import GeneralInfo from './GeneralInfo';
import PageLoading from 'widgets/PageLoading';
import TransferInfo from './TransferInfo';
import InventoryInfo from './InventoryInfo';
import AssetAdjustment from './AssetAdjustment';
import AssetRepair from './AssetRepair';

const AssetDetail = ({setOpenDetail,id}:{setOpenDetail:(i:boolean)=>void,id:number}) => {
    const [active,setActive] = useState(1);
    const [assetData,setAssetData] = useState<{[key:string]:any}>({});
    const [assetTransferData,setAssetTransferData] = useState<{[key:string]:any}[]>([]);
    const [assetInventoryData,setAssetInventoryData] = useState<{[key:string]:any}[]>([]);
    const [assetAdjustmentData,setAssetAdjustmentData] = useState<{[key:string]:any}[]>([]);
    const [assetRepairData,setAssetRepairData] = useState<{[key:string]:any}[]>([]);
    const [dataFetching,setDataFetching]=  useState(true);

    const handleFetchData = async () => {
        try {
        setDataFetching(true);
        const response = await Promise.all([
        axios.post("/api/get-asset",{id}),
        axios.post("/api/get-asset-transfer",{id}),
        axios.post("/api/get-asset-inventory",{id}),
        axios.post("/api/get-asset-adjustment",{id}),
        axios.post("/api/get-asset-repair",{id})
        ]);

        if(response[0].data.data.length===0) return alert("Dữ liệu tài sản không có")
        setAssetData(response[0].data.data[0]);
        setAssetTransferData(response[1].data.data);
        setAssetInventoryData(response[2].data.data);
        setAssetAdjustmentData(response[3].data.data);
        setAssetRepairData(response[4].data.data);
        } catch (error) {   
          const message = getErrorMessage(error);
          alert(message);
        } finally {
            setDataFetching(false);
        }
      }
  
    useEffect(()=>{
        handleFetchData();
    },[]);

    if(dataFetching){
        return <PageLoading/>
    }

    const handleViewContent = () => {
        switch (active){
            case 1:
                return <GeneralInfo data={assetData}/>
            case 2:
                return <TransferInfo data={assetTransferData}/>
            case 3:
                return <InventoryInfo data={assetInventoryData}/>
            case 4:
                return <AssetAdjustment data={assetAdjustmentData}/>
            case 5:
                return <AssetRepair data={assetRepairData}/>
            default:
                return <GeneralInfo data={assetData}/>
        }
    }

  return (
    <div style={{
        background:myColor.backgroundColor,
        position:'fixed',top:0,width:'100vw',height:'100vh', zIndex:2,overflow:'auto'}}>
        <div style={{background:myColor.buttonColor,position:'sticky',top:0}}>
            <header style={{display:'flex',position:'relative',alignItems:'center',justifyContent:'center',padding:'1.2rem 1rem 1rem',background:myColor.buttonColor}}>
                <div style={{display:'flex',justifyContent:'flex-start',position:'absolute',left:20}}>
                    <IoArrowBackSharp style={{margin:0, fontSize:24,color:'white'}} onClick={()=>setOpenDetail(false)}/>
                </div>
                <h5 style={{margin:0, fontSize:16,color:'white',fontWeight:500}}>Thông tin chi tiết</h5>
            </header>
            <div style={{
                borderTopLeftRadius:30,borderTopRightRadius:30,
                display:'flex', justifyContent:'space-evenly',background:myColor.backgroundColor,padding:'1rem 0.5rem'}}>
                <div onClick={()=>setActive(1)}>
                    <span style={{fontSize:13, color:`${active===1 ? myColor.buttonColor : "grey"}`,
                    fontWeight: `${active === 1 ? '700': '500'}`
                    }}>Chung</span>
                </div>
                <div onClick={()=>setActive(2)}>
                    <span style={{
                        fontWeight: `${active === 2 ? '700': '500'}`,
                        fontSize:13, color:`${active===2 ? myColor.buttonColor : "grey"}`}}>Điều chuyển</span>
                </div>
                <div onClick={()=>setActive(3)}>
                    <span style={{
                        fontWeight: `${active === 3 ? '700': '500'}`,
                        fontSize:13, color:`${active===3 ? myColor.buttonColor : "grey"}`}}>Kiểm kê</span>
                </div>
                <div onClick={()=>setActive(4)}>
                    <span style={{
                        fontWeight: `${active === 4 ? '700': '500'}`,
                        fontSize:13, color:`${active===4 ? myColor.buttonColor : "grey"}`}}>Điều chỉnh</span>
                </div>
                <div onClick={()=>setActive(5)}>
                    <span style={{
                        fontWeight: `${active === 5 ? '700': '500'}`,
                        fontSize:13, color:`${active===5 ? myColor.buttonColor : "grey"}`}}>Sửa chữa</span>
                </div>
            </div>

        </div>
        <div style={{padding:'0.5rem 1rem',background:myColor.backgroundColor, overflow:'auto'}}>
            {handleViewContent()}
            {/* <GeneralInfo data={assetData}/> */}
        </div>
    </div>
  )
}

export default AssetDetail