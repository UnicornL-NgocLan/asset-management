import { myColor } from 'color'
import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { getErrorMessage } from 'helpers/getErrorMessage'
import { getCompanies } from '../../redux/reducers/companyReducer'
import PageLoading from 'widgets/PageLoading.tsx'
import { addAuth } from '../../redux/reducers/authReducer'
import {getOffices} from '../../redux/reducers/officeReducer'
import {getDepartments} from '../../redux/reducers/departmentReducer'
import AssetList from './components/AssetList'
import app from 'axiosConfig'
import Header from './components/Header'
import { useNavigate } from 'react-router-dom'
import { SearchProps } from 'antd/es/input/Search'

import Skeleton from 'react-loading-skeleton'
import 'react-loading-skeleton/dist/skeleton.css'
import Empty from 'widgets/Empty'


const Asset = () => {
    const dispatch = useDispatch();
    const [fetchData,setFetchData] = useState(true);
    const [assetList, setAssetList] = useState<any[]>([]);
    const [loading,setLoading] = useState(false);
    const companies = useSelector((state) => (state as any).companies);
    const searchInput = useSelector((state) => (state as any).searchInput);

    const navigate = useNavigate()

    const fetchCompanies = async () => {
        try {
            const {data} = await app.get("/api/get-companies");
            if(data?.data){
                dispatch(getCompanies(data?.data))
            }
        } catch (error:any) {
            const message = getErrorMessage(error);
            alert(message);
            setFetchData(false);
        }
    }

    const handleChangeCompany = async (id:number) => {
        try {
            setFetchData(true);
            await app.patch("/api/change-company",{companyId:id})
            await fetchAllNecessaryData();
            setAssetList([]);
        } catch (error) {
            const message = getErrorMessage(error);
            alert(message);
            setFetchData(false);
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
            setFetchData(false);
        }
    }

    const handleFetchUserData = async () => {
        try {
            const {data} = await app.get("/api/get-user");
            dispatch(addAuth(data?.data))
        } catch (error) {
            const message = getErrorMessage(error);
            alert(message);
            setFetchData(false);
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
            setFetchData(false);
        }
    }
    
    const fetchAllNecessaryData = async () => {
        try {
            setFetchData(true);
            await Promise.all([
                fetchCompanies(),
                handleFetchUserData(),
                handleGetOffices(),
                handleGetDepartments()
            ])
        } catch (error) {
            const message = getErrorMessage(error);
            alert(message);
        } finally {
            setFetchData(false);
        }
    }

    const handleGetAsset: SearchProps['onSearch'] = async (value) => {
        try {
            if(!value) return setAssetList([]);
            setLoading(true);
            const {data:{data}} = await app.post("/api/get-asset",{text:value,isCodeAndName:true});
            const newData = [...data].map((item:any)=> {
                const newItem =  {
                "value":item.id, 
                "label": `[${item.code}] ${item.name}`,
                'location':item.sea_office_id,
                "quantity": item.quantity,
                "status":item.state,
                "total_val":item.value,
                "asset_user": item.asset_user_temporary,
                "related_handover_party": item.related_handover_party
                }
            return newItem;
          })
          setAssetList(newData);
        } catch (error) {
          const message = getErrorMessage(error);
          alert(message);
        } finally {
            setLoading(false);
        }
      }

    const handelChosenAsset = (id:number)=> {
        navigate(`/asset/${id}`)
    }

    useEffect(()=>{
        if(companies.length > 0){
            const timemout = setTimeout(() => {
                setFetchData(false);
            },300)

            return () => clearTimeout(timemout)
        };
        fetchAllNecessaryData();
    },[]);

    useEffect(()=>{
        if(searchInput){
            handleGetAsset(searchInput)
        }
    },[])

    if(fetchData){
        return <PageLoading/>
    }

  return (
    <div style = {{backgroundColor:myColor.backgroundColor, height:'100vh',overflow:'auto',width:'100vw'}}>
        <Header handleChangeCompany={handleChangeCompany} setAssetList={setAssetList} handelChosenAsset={handelChosenAsset} handleGetAsset={handleGetAsset}/>
        {
            loading
            ?
            <div style={{padding:'1rem'}}>
                <Skeleton count={5} height={100} borderRadius ={5} style={{marginBottom:6}}/>
            </div>
            :
            assetList.length === 0
            ?
            <div style={{padding:'1rem 0'}}><Empty/></div>
            :
            <AssetList data={assetList} handelChosenAsset={handelChosenAsset}/>
        }
    </div>
  )
}

export default Asset