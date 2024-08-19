import { myColor } from 'color'
import { useEffect, useMemo, useRef, useState } from 'react'
import {Input } from 'antd';
import { BsPersonCircle } from "react-icons/bs";
import {useDispatch, useSelector} from 'react-redux'
import { RootState } from 'redux/store';
import { MdLogout } from "react-icons/md";
import { FaBuilding } from "react-icons/fa";
import { ICompany } from 'interface';
import { FaExchangeAlt } from "react-icons/fa";
import { BsQrCode } from "react-icons/bs";

import type { GetProps } from 'antd';
import DrawerSelection from './Drawer';

import QRScanner from 'widgets/qr/QRScanner';
import { getErrorMessage } from 'helpers/getErrorMessage';
import { Select, Spin } from 'antd';
import type { SelectProps } from 'antd';
import debounce from 'lodash/debounce';
import app from 'axiosConfig';

type SearchProps = GetProps<typeof Input.Search>;

export interface DebounceSelectProps<ValueType = any>
  extends Omit<SelectProps<ValueType | ValueType[]>, 'options' | 'children'> {
  fetchOptions: (search: string) => Promise<ValueType[]>;
  debounceTimeout?: number;
}


const Header = ({handleChangeCompany,setAssetList,handelChosenAsset}:{handleChangeCompany:(i:number)=>void,setAssetList:(i:any[])=>void,handelChosenAsset:(i:number)=> void}) => {
    const dispatch = useDispatch();
    const [openDrawer, setOpenDrawer] = useState(false);
    const companies = useSelector((state: RootState) => state.companies);
    const auth = useSelector((state: RootState) => state.auth) as any;

    const [myCurrentCompanyShortName,setMyCurrentCompanyShortName] = useState<string>('');
    const [isOpen, setOpen] = useState(false);
    const [input,setInput] = useState("");


    const getMyCurrentCompanyShortName = () => {
        if(companies.length>0){
            const currentOne = companies.find((com:ICompany) => com.id === auth?.company_id[0]);
            if(!currentOne) {
                setMyCurrentCompanyShortName("Không tồn tại");
            }else{
                setMyCurrentCompanyShortName(currentOne.short_name);
            }
        }else{
            const comName = auth?.company_id[1];
            setMyCurrentCompanyShortName(comName);
        }
    }

    const handleOpenCompanySelection = () => {
        setOpenDrawer(true);
    }

    const handleClose = () => {
        setOpenDrawer(false);
    };

    const handleLogout = async () => {
        if(window.confirm("Bạn có muốn đăng xuất?")){
            await app.delete("/api/logout")
            dispatch({type:"logout"});
        }
    }

    const openScanQR = () => {
      setOpen(true);
    }

    const handleGetAssetViaCode = async (code:string)  => {
      try {
        const {data:{data}} = await app.post("/api/get-asset",{
          id:code
        })

        const newData = [...data].map((item:any)=> {
          const newItem =  {
            "value":item.id, 
            "label": `[${item.code}] ${item.name}`,
            'location':item.sea_office_id,
            "quantity": item.quantity,
            "status":item.state,
            "total_val":item.value
          }
          return newItem;
        })

        if(newData.length === 0) {
          alert("Không tìm thấy tài sản !")
        }{
          setAssetList(newData);
        }

        if(newData.length === 1){
          handelChosenAsset(newData[0].value)
        }
      } catch (error) {
        const message = getErrorMessage(error);
        alert(message);
      }
    }

    const handleGetAsset: SearchProps['onSearch'] = async (value) => {
      try {
        if(!value) return setAssetList([])
        const {data:{data}} = await app.post("/api/get-asset",{text:value,isCodeAndName:true});
        const newData = [...data].map((item:any)=> {
          const newItem =  {
            "value":item.id, 
            "label": `[${item.code}] ${item.name}`,
            'location':item.sea_office_id,
            "quantity": item.quantity,
            "status":item.state,
            "total_val":item.value
          }
          return newItem;
        })
        setAssetList(newData)
      } catch (error) {
        const message = getErrorMessage(error);
        alert(message);
      }
    }

    const onChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      handleGetAsset(e.target.value)
    };


    useEffect(() => {
      getMyCurrentCompanyShortName();
    }, [auth]);

  return (
    <>
      <div style={{
        position:'sticky',top:0, zIndex:1,
        paddingBottom:10,backgroundColor:myColor.buttonColor,width:'100%',borderBottomLeftRadius:20,borderBottomRightRadius:20}}>
          <div style = {{display:'flex',justifyContent:'space-between',alignItems:'center',padding:'1rem'}}>
              <div style={{display:'flex',alignItems:'center',gap:8}}>
                  <BsPersonCircle style={{fontSize:20,color:'white'}}/>
                  <span style={{color:'white',fontSize:14}}>{auth?.name}</span>
              </div>  
              <div style={{display:'flex',alignItems:'center',gap:20}}>
                <div
                  style={{display:'flex',width:'20px',height:'20px',borderRadius:3,background:'white',padding:1.5,overflow:'hidden'}}>
                    <BsQrCode style={{width:'100%',height:'100%'}}  onClick={openScanQR}/>
                </div>
                  {companies.length > 1 && <FaExchangeAlt style={{fontSize:18,color:'white', marginRight:0}} onClick = {handleOpenCompanySelection}/>}
                  <MdLogout style={{fontSize:20,color:'white'}} onClick={handleLogout}/>
              </div>
          </div>
          <div style={{padding:'0.5rem 1rem'}}>
              <p style={{color:'white',fontWeight:'500',margin:0}}>QUẢN LÝ TÀI SẢN</p>
          </div>
          <div style={{display:'flex',alignItems:'center',padding:'0.5rem 1rem',gap:8}}>
              <FaBuilding style={{fontSize:16,color:'white'}}/>
              <span style={{fontSize:14, color:'white'}}>{myCurrentCompanyShortName}</span>
          </div>

          <div style={{display:'flex',alignItems:'center',padding:'0.5rem 1rem',gap:8}}>
              <Input placeholder="Nhập mã tài sản hoặc tên tài sản" allowClear onChange={debounce(onChange,500)}/>
          </div>
      </div>
      <DrawerSelection open = {openDrawer} handleClose = {handleClose} handleChangeCompany={handleChangeCompany}/>
      {isOpen && <QRScanner isOpen={isOpen} setOpen={()=>setOpen(false)} setDecodedText = {handleGetAssetViaCode}/>}
    </>
  )
}

export default Header