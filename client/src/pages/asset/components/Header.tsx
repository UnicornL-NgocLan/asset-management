import { myColor } from 'color'
import { useEffect, useRef, useState } from 'react'
import { Button, Drawer, Image, Input } from 'antd';
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
import QrScanner from "qr-scanner";
import axios from 'axios';
import QrFrame from "../../../images/qr-frame.svg"
import { IoMdArrowRoundBack } from "react-icons/io";

import "./qr_code.css";

type SearchProps = GetProps<typeof Input.Search>;

const { Search } = Input;


const Header = ({handleChangeCompany}:{handleChangeCompany:(i:number)=>void}) => {
    const dispatch = useDispatch()
    const [openDrawer, setOpenDrawer] = useState(false);
    const companies = useSelector((state: RootState) => state.companies);
    const auth = useSelector((state: RootState) => state.auth) as any;

    // QR States
    const scanner = useRef<QrScanner>();
    const videoEl = useRef<HTMLVideoElement>(null);
    const qrBoxEl = useRef<HTMLDivElement>(null);
    const [qrOn, setQrOn] = useState<boolean>(true);

    const [myCurrentCompanyShortName,setMyCurrentCompanyShortName] = useState<string>('');

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

    const onSearch: SearchProps['onSearch'] = (value, _e, info) => console.log(info?.source, value);

    const handleOpenCompanySelection = () => {
        setOpenDrawer(true);
    }

    const handleClose = () => {
        setOpenDrawer(false);
    };

    const handleLogout = async () => {
        if(window.confirm("Bạn có muốn đăng xuất?")){
            await axios.delete("/api/logout")
            dispatch({type:"logout"});
        }
    }

    const [scannedResult, setScannedResult] = useState<string | undefined>("");
    const [openQRScanner,setOpenQRScanner] = useState(false);

  // Success
  const onScanSuccess = (result: QrScanner.ScanResult) => {
    // 🖨 Print the "result" to browser console.
    console.log(result);
    // ✅ Handle success.
    // 😎 You can do whatever you want with the scanned result.
    setScannedResult(result?.data);
  };

  // Fail
  const onScanFail = (err: string | Error) => {
    // 🖨 Print the "err" to browser console.
    console.log(err);
  };

  const handleOpenScanner = async () => {
    setOpenQRScanner(true);
    if (videoEl?.current && !scanner.current) {
      // 👉 Instantiate the QR Scanner
      scanner.current = new QrScanner(videoEl?.current, onScanSuccess, {
        onDecodeError: onScanFail,
        // 📷 This is the camera facing mode. In mobile devices, "environment" means back camera and "user" means front camera.
        preferredCamera: "environment",
        // 🖼 This will help us position our "QrFrame.svg" so that user can only scan when qr code is put in between our QrFrame.svg.
        highlightScanRegion: true,
        // 🔥 This will produce a yellow (default color) outline around the qr code that we scan, showing a proof that our qr-scanner is scanning that qr code.
        highlightCodeOutline: true,
        // 📦 A custom div which will pair with "highlightScanRegion" option above 👆. This gives us full control over our scan region.
        overlay: qrBoxEl?.current || undefined,
      });
      console.log("haha111")
      // 🚀 Start QR Scanner
      scanner?.current
        ?.start()
        .then(() => setQrOn(true))
        .catch((err) => {
          if (err) {
            alert(
              "Camera bị chặn hoặc không thể truy cập. Vui lòng cấp quyền truy cập hoặc tải lại trang"
            );
            setOpenQRScanner(false);
          };
        });
    }else{
      setOpenQRScanner(false);
    }
  }

  const handleExitScan = () => {
    scanner?.current?.stop();
    setOpenQRScanner(false);
  }

    useEffect(() => {
      getMyCurrentCompanyShortName();
    }, [auth]);

  return (
    <>
      <div style={{paddingBottom:10,backgroundColor:myColor.buttonColor,width:'100%',borderBottomLeftRadius:20,borderBottomRightRadius:20}}>
          <div style = {{display:'flex',justifyContent:'space-between',alignItems:'center',padding:'1rem'}}>
              <div style={{display:'flex',alignItems:'center',gap:8}}>
                  <BsPersonCircle style={{fontSize:20,color:'white'}}/>
                  <span style={{color:'white',fontSize:14}}>{auth?.name}</span>
              </div>  
              <div style={{display:'flex',alignItems:'center',gap:8}}>
                  {companies.length > 1 && <FaExchangeAlt style={{fontSize:18,color:'white', marginRight:10}} onClick = {handleOpenCompanySelection}/>}
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
              <div
              style={{display:'flex',width:30,height:30, borderRadius:3,background:'white',padding:1.5,overflow:'hidden'}}>
                  <BsQrCode style={{width:'100%',height:'100%'}} onClick = {handleOpenScanner}/>
              </div>
              <Search placeholder="Nhập tên tài sản hoặc mã tài sản" onSearch={onSearch}/>
          </div>
      </div>
      <DrawerSelection open = {openDrawer} handleClose = {handleClose} handleChangeCompany={handleChangeCompany}/>
  
        <div className = {openQRScanner ? "qr-container" : ""}>
          {openQRScanner && <div style={{background: myColor.buttonColor,width:'100%',display:'flex',alignItems:'center',padding:'1rem',gap:8}}>
            <IoMdArrowRoundBack style={{color:'white',fontSize:20}} onClick={handleExitScan}/>
            <span style={{color:'white',fontSize:14}}>Thoát</span>
          </div>}
          <video ref={videoEl}></video>
          {
            openQRScanner 
            && <div className="qr-reader">
            <div ref={qrBoxEl} className="qr-box">
              <img
              src={QrFrame}
              alt="Qr Frame"
              width={256}
              height={256}  
              className="qr-frame"
              />
            </div>

          {scannedResult && (
              <p
              style={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  zIndex: 99999,
                  color: "white",
              }}
              >
              Scanned Result: {scannedResult}
              </p>
          )}
          </div>
          }
        </div>
    </>
  )
}

export default Header