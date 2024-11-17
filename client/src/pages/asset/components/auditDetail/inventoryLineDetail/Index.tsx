import { myColor } from 'color'
import React from 'react'
import { IoArrowBackSharp } from 'react-icons/io5'

const InventoryLineDetail = ({openEdit,setOpenEdit}:{openEdit:any,setOpenEdit:(i:boolean)=>void}) => {
  return (
    <div style={{position:'fixed',top:0,width:'100vw', overflow:'auto',height:'100vh',zIndex:100,background:myColor.backgroundColor}}>
        <header style={{
        position:'sticky',top:0, zIndex:98,
        display:'flex',alignItems:'center',justifyContent:'center',padding:'1rem 1rem 1rem',background:myColor.buttonColor}}>
            <div style={{display:'flex',justifyContent:'flex-start',position:'absolute',left:20}}>
                <IoArrowBackSharp style={{margin:0, fontSize:20,color:'white'}} onClick={()=>setOpenEdit(false)}/>
            </div>
            <h5 style={{margin:0, fontSize:14,color:'white',fontWeight:500}}>Chi tiết kiểm kê</h5>
        </header>
    </div>
  )
}

export default InventoryLineDetail