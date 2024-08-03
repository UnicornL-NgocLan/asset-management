import React from 'react';
import Login from 'pages/login/Login';
import { useSelector,useDispatch } from 'react-redux';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { RootState } from 'redux/store';
import AppList from 'pages/apps/AppList';

function App() {
  const dispatch = useDispatch();
  const auth = useSelector((state: RootState) => state.auth);
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={auth ? <Navigate to="/" /> : <Login/>}/>
          <Route path='/' element = {<AppList/>}/>
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
