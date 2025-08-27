import { Outlet } from "react-router-dom";
import { useEffect, useState } from "react";

const PreRoute = () => {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const isFromInventoryQR = params.get("inventory-share-qr");
    const path = window.location.pathname

    // Ví dụ: nếu có query đặc biệt thì redirect
    if (isFromInventoryQR) {
      localStorage.setItem('pti_01',path)
    }
    setReady(true);
  }, []);

  if (!ready) return null; // chặn cho đến khi xử lý xong

  return <Outlet />; // render route con nếu hợp lệ
};

export default PreRoute;