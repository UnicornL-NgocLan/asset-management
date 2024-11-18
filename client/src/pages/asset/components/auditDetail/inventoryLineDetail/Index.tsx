import { Card, Flex, Form, Input, Radio } from 'antd';
import TextArea from 'antd/es/input/TextArea';
import app from 'axiosConfig';
import { myColor } from 'color'
import { getErrorMessage } from 'helpers/getErrorMessage';
import { IAudit } from 'interface'
import React, { useEffect, useState } from 'react'
import { IoArrowBackSharp } from 'react-icons/io5'
import PageLoading from 'widgets/PageLoading';

const InventoryLineDetail = ({openEdit,setOpenEdit,auditData}:{openEdit:any,setOpenEdit:(i:boolean)=>void,auditData:IAudit}) => {
  const [form] = Form.useForm();
  const [inventoryLine,setInventoryLine] = useState<any>(null) 
  const [loading,setLoading] = useState(true);


  const handleGetInventoryLine = async () => {
    try {
      setLoading(true);
      const {data:{data}} = await app.get(`/api/get-asset-inventory-line/${openEdit.id}`);
      if(data.length > 0){
        setInventoryLine(data[0]);
      }
  } catch (error) {
      const message = getErrorMessage(error);
      alert(message);
  } finally {
      setLoading(false);
  }
  }

  const onFinish = () => {

  }

  const options = [
    { label: 'Đang sử dụng', value: 'dang_su_dung' },
    { label: 'Hư hỏng', value: 'hu_hong' },
  ];

  useEffect(()=>{
    if(!inventoryLine) return;
    const {quantity_thuc_te,note,de_xuat_xu_ly,giai_trinh,status} = inventoryLine;
        form.setFieldValue("tt",quantity_thuc_te);
        form.setFieldValue("npte",note ? note : '');
        form.setFieldValue("dxxy",de_xuat_xu_ly ? de_xuat_xu_ly : '');
        form.setFieldValue("gtdv",giai_trinh ? giai_trinh : '');
        form.setFieldValue("state",status);
  },[inventoryLine]);

  useEffect(() => {
    handleGetInventoryLine()
  }, []);

  if(loading || !inventoryLine) return <PageLoading/>

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

        <div style={{padding:'1rem'}}>
          <Form
            form = {form}
            name="layout-multiple-vertical"
            layout="vertical"
            labelCol={{ span: 4 }}
            onFinish={onFinish}
            wrapperCol={{ span: 20 }}
          >
            <div style={{background:'white',padding:'1rem 1rem',borderRadius:5,boxShadow:'2px 2px 2px rgba(0,0,0,0.2)'}}> 
              <div style={{paddingBottom:10}}>
                <p style={{margin:0,fontSize:13,fontWeight:600}}>Tên tài sản</p>   
                <p style={{margin:0,fontSize:13}}>{inventoryLine.asset_id[1]}</p>   
              </div>
              <div style={{paddingBottom:10}}>
                <p style={{margin:0,fontSize:13,fontWeight:600}}>Số lượng sổ sách: <span style={{margin:0,fontSize:13,fontWeight:400}}>{inventoryLine.quantity_so_sach}</span></p>   
              </div>
              <div style={{paddingBottom:10}}>
                <p style={{margin:0,fontSize:13,fontWeight:600,marginBottom:8}}>Số lượng thực tế <span style={{color:'crimson'}}>*</span></p>   
                <Form.Item
                        name="tt"
                        className='m-0'
                        style={{margin:0}}
                >
                    <Input placeholder="Số lượng thực tế" size="middle" style={{fontSize:13,background:myColor.backgroundColor}}/>
                </Form.Item>
              </div>
              <div style={{paddingBottom:10}}>
                <p style={{margin:0,fontSize:13,fontWeight:600,marginBottom:8}}>Thực trạng</p>   
                <Form.Item
                        className='m-0'
                        style={{margin:0}}
                >
                  <Flex vertical gap="middle">
                    <Radio.Group
                      options={options}
                      size = "middle"
                      optionType="button"
                      buttonStyle="solid"
                      name = "state"
                      block = {true}
                    />
                  </Flex>
                </Form.Item>
              </div>
              <div style={{paddingBottom:10}}>
                <p style={{margin:0,fontSize:13,fontWeight:600,marginBottom:8}}>Ghi chú</p>   
                <Form.Item
                        name="note"
                        className='m-0'
                        style={{margin:0}}
                >
                    <TextArea 
                    autoSize={{ minRows: 2, maxRows: 5 }}
                    placeholder="Nhập ghi chú..." size="middle" style={{fontSize:13,background:myColor.backgroundColor}}/>
                </Form.Item>
              </div>
              <div style={{paddingBottom:10}}>
                <p style={{margin:0,fontSize:13,fontWeight:600,marginBottom:8}}>Đề xuất xử lý</p>   
                <Form.Item
                        name="dxxl"
                        className='m-0'
                        style={{margin:0}}
                >
                    <TextArea 
                    autoSize={{ minRows: 2, maxRows: 5 }}
                    placeholder="Nhập đề xuất xử lý..." size="middle" style={{fontSize:13,background:myColor.backgroundColor}}/>
                </Form.Item>
              </div>
              <div style={{paddingBottom:0}}>
                <p style={{margin:0,fontSize:13,fontWeight:600,marginBottom:8}}>Giải trình của đơn vị</p>   
                <Form.Item
                        name="gtdv"
                        className='m-0'
                        style={{margin:0}}
                >
                    <TextArea 
                    autoSize={{ minRows: 2, maxRows: 5 }}
                    placeholder="Nhập giải trình của đơn vị" size="middle" style={{fontSize:13,background:myColor.backgroundColor}}/>
                </Form.Item>
              </div>
            </div>
          </Form>
        </div>
    </div>
  )
}

export default InventoryLineDetail