import { myColor } from 'color'
import React, { useEffect, useState } from 'react'
import Header from './components/Header'
import { useDispatch } from 'react-redux'
import axios from 'axios'
import { getErrorMessage } from 'helpers/getErrorMessage'
import { getCompanies } from '../../redux/reducers/companyReducer'
import PageLoading from 'widgets/PageLoading.tsx'
import { addAuth } from '../../redux/reducers/authReducer'

type Props = {}

const Asset = () => {
    const dispatch = useDispatch();
    const [fetchData,setFetchData] = useState(true);

    const fetchCompanies = async () => {
        try {
            const {data} = await axios.get("/api/get-companies");
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
            await axios.patch("/api/change-company",{companyId:id})
            await fetchAllNecessaryData();
        } catch (error) {
            const message = getErrorMessage(error);
            alert(message);
            setFetchData(false);
        }
    }

    const handleFetchUserData = async () => {
        try {
            const {data} = await axios.get("/api/get-user");
            dispatch(addAuth(data?.data))
        } catch (error) {
            const message = getErrorMessage(error);
            alert(message);
            setFetchData(false);
        }
    }
    
    const fetchAllNecessaryData = async () => {
        try {
            await fetchCompanies();
            await handleFetchUserData();
            setFetchData(false);
        } catch (error) {
            const message = getErrorMessage(error);
            alert(message);
            // setFetchData(false);
        }
    }

    useEffect(()=>{
        fetchAllNecessaryData();
    },[]);

    if(fetchData){
        return <PageLoading/>
    }

  return (
    <div style = {{backgroundColor:myColor.backgroundColor, position:'fixed', height:'100vh',overflow:'auto',width:'100vw'}}>
        <Header handleChangeCompany={handleChangeCompany}/>
    </div>
  )
}

export default Asset