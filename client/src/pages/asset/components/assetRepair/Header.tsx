import { myColor } from 'color';
import { IoArrowBackSharp } from 'react-icons/io5';
import { useNavigate } from 'react-router-dom';

const Header = () => {
  const navigate = useNavigate();
  return (
    <header
      style={{
        position: 'sticky',
        top: 0,
        zIndex: 99,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '1rem 1rem 1rem',
        background: myColor.buttonColor,
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'flex-start' }}>
        <IoArrowBackSharp
          style={{ margin: 0, fontSize: 20, color: 'white' }}
          onClick={() => navigate('/', { replace: true })}
        />
      </div>
      <h5 style={{ margin: 0, fontSize: 14, color: 'white', fontWeight: 500 }}>
        Phiếu sửa chữa tài sản
      </h5>
      <div></div>
    </header>
  );
};

export default Header;
