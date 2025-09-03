import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Asset from 'pages/asset/Asset';
import PrivateRoute from 'PrivateRoute';
import { addAuth } from './redux/reducers/authReducer.tsx';
import { getErrorMessage } from 'helpers/getErrorMessage';
import app from 'axiosConfig.tsx';
import AssetDetail from 'pages/asset/components/assetDetail/AssetDetail.tsx';
import AssetAudit from 'pages/asset/components/assetAudit/Index.tsx';
import AuditDetail from 'pages/asset/components/auditDetail/Index.tsx';
import PageLoading from 'widgets/PageLoading.tsx';
import NavigateRoute from 'NavigateRoute.tsx';
import PreRoute from 'PreRoute.tsx';
import {getOffices} from './redux/reducers/officeReducer'
import {getDepartments} from './redux/reducers/departmentReducer'

function App() {
  const dispatch = useDispatch();
  const [fetchingData,setFetchingData] = useState(false);
  
  const checkAuth = async () => {
    try {
      setFetchingData(true);
      const {data}:any = await app.get("/api/check-auth");
      if(data?.data?.length>0){
        dispatch(addAuth(data.data[0]))
        await handleGetOffices();
        await handleGetDepartments();
      }
    } catch (error:any) {
      alert(getErrorMessage(error))
    } finally {
      setFetchingData(false);
    }
  }

  const handleGetOffices = async () => {
    try {
        const {data} = await app.get("/api/get-offices");
        if(data?.data){
            dispatch(getOffices(data?.data))
        }
    } catch (error:any) {
        const message = getErrorMessage(error);
        alert(message);
    }
  }

  const handleGetDepartments = async () => {
    try {
        const {data} = await app.get("/api/get-departments");
        if(data?.data){
            dispatch(getDepartments(data?.data))
        }
    } catch (error:any) {
        const message = getErrorMessage(error);
        alert(message);
    }
  }

  useEffect(() => {
    checkAuth();
  }, []);
  
  return (
    <>
      {
        fetchingData 
        ?
        <PageLoading/>
        :
        <BrowserRouter>
          <Routes>
            <Route element={<PreRoute/>}>
              <Route path="/login" element={<NavigateRoute/>}/>
              <Route path="/" element={<PrivateRoute><Asset/></PrivateRoute>}/>
              <Route path="/asset/:id" element={<PrivateRoute><AssetDetail/></PrivateRoute>}/>
              <Route path="/asset/audit" element={<PrivateRoute><AssetAudit/></PrivateRoute>}/>
              <Route path="/asset/audit/:id" element={<PrivateRoute><AuditDetail/></PrivateRoute>}/>
            </Route>
          </Routes>
        </BrowserRouter>
      }
    </>
  );
}

export default App;
