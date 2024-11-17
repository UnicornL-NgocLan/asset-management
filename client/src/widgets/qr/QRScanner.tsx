import Modal from './modal/Modal';
import QRScanner from './scanner/Scanner';
import './index.css'
import { FaTimes } from "react-icons/fa";


const QRScannerFeature = ({isOpen,setOpen,setDecodedText}:{isOpen:boolean,setOpen:(i:boolean)=>void,setDecodedText:(i:string)=>void}) => {

  const closeModal = () => {
    setOpen(false);
  };

  const qrScanner = isOpen ? <QRScanner setDecodedText={setDecodedText}/> : null;
  return (
    <>
      <div className="appContainer">
        <FaTimes className="appContainer_btn" onClick ={closeModal} style={{color:'white',fontSize:30}}/>
        <Modal isOpen={isOpen} title="Vui lòng đưa mã vào vùng quét mã">
          <div>{qrScanner}</div>
        </Modal>
      </div>
    </>
  )
}

export default QRScannerFeature
