import Login from 'pages/login/Login';
import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';
import { RootState } from 'redux/store';

interface PrivateRouteProps {
  children?: React.ReactNode;
}

const NavigateRoute = ({ children }: PrivateRouteProps) => {
  const auth = useSelector((state: RootState) => state.auth);
  const [isFromInventoryQrCode, setIsFromInventoryQrCode] = useState<any>(false);

  useEffect(() => {
    const pathFromQRCode = localStorage.getItem('pti_01');
    if (pathFromQRCode) {
      setIsFromInventoryQrCode(pathFromQRCode);
    }
  }, []);
  return auth ? (
    isFromInventoryQrCode ? (
      <Navigate to={isFromInventoryQrCode} />
    ) : (
      <Navigate to="/" />
    )
  ) : (
    <Login />
  );
};

export default NavigateRoute;
