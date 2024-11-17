import { myColor } from 'color';
import { IoArrowBackSharp } from "react-icons/io5";
import { useNavigate } from 'react-router-dom';

import type { MenuProps } from 'antd';
import { Dropdown} from 'antd';
import { FaFilter } from "react-icons/fa";

const Header = ({setState}:{setState:(i:number)=> void}) => {
  const navigate = useNavigate();

  const handleFilter = (i:number) => {
    setState(i);
  }

  const items: MenuProps['items'] = [
    {
      key: '0',
      label: 'Tất cả',
      onClick: ()=>handleFilter(0)
    },
    {
      key: '1',
      label: 'Nháp',
      onClick: ()=>handleFilter(1)
    },
    {
      key: '2',
      label: 'Đang thực hiện',
      onClick: ()=>handleFilter(2)
    },
    {
      key: '3',
      label: 'Đã hoàn tất',
      onClick: ()=>handleFilter(3)
    },
    {
        key: '4',
        label: 'Bị hủy',
        onClick: ()=>handleFilter(4)
    },
  ];

  return (
    <header style={{
      position:'sticky',top:0, zIndex:99,
      display:'flex',alignItems:'center',justifyContent:'space-between',padding:'1rem 1rem 1rem',background:myColor.buttonColor}}>
        <div style={{display:'flex',justifyContent:'flex-start'}}>
            <IoArrowBackSharp style={{margin:0, fontSize:20,color:'white'}} onClick={()=>navigate("/",{ replace: true })}/>
        </div>
        <h5 style={{margin:0, fontSize:14,color:'white',fontWeight:500}}>Chứng từ kiểm kê tài sản</h5>
        <Dropdown 
        menu={{ 
          items,
          selectable: true,
          defaultSelectedKeys: ['0'],
         }} placement="bottomRight" arrow={{ pointAtCenter: true }}>
          <div style={{display:'flex',alignItems:'center',gap:2}}>
              <FaFilter style={{fontSize:14,color:'white'}}/>
          </div>  
        </Dropdown>
    </header>
  )
}

export default Header