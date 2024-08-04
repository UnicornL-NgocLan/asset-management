import React, { useEffect } from 'react';
import Login from 'pages/login/Login';
import { useSelector,useDispatch } from 'react-redux';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { RootState } from 'redux/store';
import Asset from 'pages/asset/Asset';
import PrivateRoute from 'PrivateRoute';
import axios from 'axios';
import { addAuth } from './redux/reducers/authReducer.tsx';
import { getErrorMessage } from 'helpers/getErrorMessage';

function App() {
  const dispatch = useDispatch();
  const auth = useSelector((state: RootState) => state.auth);

  const checkAuth = async () => {
    try {
      const {data}:any = await axios.get("/api/check-auth");
      if(data?.data?.length>0){
        dispatch(addAuth(data.data[0]))
      }
    } catch (error:any) {
      alert(getErrorMessage(error))
    }
  }

  useEffect(() => {
    checkAuth();
  }, []);
  
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={auth ? <Navigate to="/" /> : <Login/>}/>
          <Route path="/" element={<PrivateRoute><Asset/></PrivateRoute>}/>
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
