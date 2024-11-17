
import QrScanner from 'qr-scanner';
import { useEffect, useRef } from 'react';
import './Scanner.css'

const QRScanner = ({setDecodedText}:any) => {
  const videoElementRef = useRef(null);

  useEffect(() => {
    const video: HTMLVideoElement = videoElementRef?.current as any;
    const qrScanner = new QrScanner(
      video,
      (result) => {
        setDecodedText(result.data);
      },
      {
        returnDetailedScanResult: true,
        highlightScanRegion: true,
        highlightCodeOutline: true,
      }
    );
    qrScanner.start().then(
        () => {
        },
        (error) => {
            if(error === "Camera not found.") {
                alert("Quyền truy cập Camera bị chặn. Vui lòng cấp quyền truy cập")
            } else {
                alert(error);
            }
        }
    );

    return () => {
      qrScanner.stop();
      qrScanner.destroy();
    };
  }, []);

  return (
    <div>
      <div className="videoWrapper">
        <video className="qrVideo" ref={videoElementRef}/>
      </div>
    </div>
  );
};

export default QRScanner;
