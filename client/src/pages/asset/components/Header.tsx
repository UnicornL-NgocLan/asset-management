import { myColor } from 'color';
import { useEffect, useState } from 'react';
import { Input, Form } from 'antd';
import { FaBuilding } from 'react-icons/fa';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from 'redux/store';
import { GrLogout } from 'react-icons/gr';
import { ICompany } from 'interface';
import { FaExchangeAlt } from 'react-icons/fa';
import { BsQrCode } from 'react-icons/bs';
import { GiNotebook } from 'react-icons/gi';
import type { MenuProps } from 'antd';
import DrawerSelection from './assetDetail/Drawer';
import QRScanner from 'widgets/qr/QRScanner';
import { getErrorMessage } from 'helpers/getErrorMessage';
import { Button, Dropdown } from 'antd';
import { FaCaretDown } from 'react-icons/fa';
import type { SelectProps } from 'antd';
import debounce from 'lodash/debounce';
import app from 'axiosConfig';
import _ from 'lodash';
import { useNavigate } from 'react-router-dom';
import { setInput } from '../../../redux/reducers/searchInputReducer';
import { PiPackage } from 'react-icons/pi';
import { PiMoneyFill } from 'react-icons/pi';
import { FaWrench } from 'react-icons/fa6';

export interface DebounceSelectProps<ValueType = any> extends Omit<
  SelectProps<ValueType | ValueType[]>,
  'options' | 'children'
> {
  fetchOptions: (search: string) => Promise<ValueType[]>;
  debounceTimeout?: number;
}

const Header = ({
  handleChangeCompany,
  setAssetList,
  handelChosenAsset,
  handleGetAsset,
}: {
  handleChangeCompany: (i: number) => void;
  setAssetList: (i: any[]) => void;
  handleGetAsset: (i: string) => void;
  handelChosenAsset: (i: number) => void;
}) => {
  const dispatch = useDispatch();
  const [openDrawer, setOpenDrawer] = useState(false);
  const companies = useSelector((state: RootState) => state.companies);
  const searchInput = useSelector((state: RootState) => state.searchInput);
  const navigate = useNavigate();
  const auth = useSelector((state: RootState) => state.auth) as any;

  const [myCurrentCompanyShortName, setMyCurrentCompanyShortName] = useState<string>('');
  const [isOpen, setOpen] = useState(false);
  const [form] = Form.useForm();

  const getMyCurrentCompanyShortName = () => {
    if (companies.length > 0) {
      const currentOne = companies.find((com: ICompany) => com.id === auth?.company_id[0]);
      if (!currentOne) {
        setMyCurrentCompanyShortName('Không tồn tại');
      } else {
        setMyCurrentCompanyShortName(currentOne.short_name);
      }
    } else {
      const comName = auth?.company_id[1];
      setMyCurrentCompanyShortName(comName);
    }
  };

  const handleOpenCompanySelection = () => {
    setOpenDrawer(true);
  };

  const handleClose = () => {
    setOpenDrawer(false);
  };

  const handleLogout = async () => {
    if (window.confirm('Bạn có muốn đăng xuất?')) {
      await app.delete('/api/logout');
      dispatch({ type: 'logout' });
      localStorage.removeItem('pti_01');
    }
  };

  const openScanQR = () => {
    setOpen(true);
  };

  const items: MenuProps['items'] = [
    {
      label: <span style={{ fontSize: 13 }}>Đổi công ty</span>,
      key: '1',
      icon: <FaExchangeAlt />,
      onClick: () => handleOpenCompanySelection(),
    },
    {
      label: <span style={{ color: 'red', fontSize: 13 }}>Đăng xuất</span>,
      key: '2',
      icon: <GrLogout style={{ color: 'red' }} />,
      onClick: () => handleLogout(),
    },
  ];

  const handleGetAssetViaCode = async (code: string) => {
    try {
      if (!_.isInteger(parseInt(code))) return alert('Nội dung mã QR không hợp lệ');
      const {
        data: { data },
      } = await app.post('/api/get-asset', {
        id: code,
      });

      const newData = [...data].map((item: any) => {
        const newItem = {
          value: item.id,
          label: `[${item.code}] ${item.name}`,
          location: item.sea_office_id,
          quantity: item.quantity,
          status: item.state,
          total_val: item.value,
        };
        return newItem;
      });

      if (newData.length === 0) {
        alert('Không tìm thấy tài sản !');
      }
      {
        setAssetList(newData);
        setOpen(false);
      }

      if (newData.length === 1) {
        handelChosenAsset(newData[0].value);
        setOpen(false);
      }
    } catch (error) {
      const message = getErrorMessage(error);
      alert(message);
    }
  };

  const onChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    dispatch(setInput(e.target.value));
    handleGetAsset(e.target.value);
  };

  useEffect(() => {
    getMyCurrentCompanyShortName();
  }, [auth]);

  useEffect(() => {
    if (searchInput) {
      form.setFieldsValue({
        name: searchInput,
      });
    }
  }, []);

  return (
    <>
      <div
        style={{
          position: 'sticky',
          top: 0,
          zIndex: 1,
          paddingBottom: 10,
          backgroundColor: myColor.buttonColor,
          width: '100%',
          borderBottomLeftRadius: 20,
          borderBottomRightRadius: 20,
        }}
      >
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: '1rem',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 5, padding: 0 }}>
            <FaBuilding style={{ fontSize: 13, color: 'white' }} />
            <span style={{ fontSize: 11.5, color: 'white' }}>{myCurrentCompanyShortName}</span>
          </div>
          <Dropdown menu={{ items }} placement="bottomRight" arrow>
            <div style={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <span style={{ color: 'white', fontSize: 13 }}>{auth?.name}</span>
              <FaCaretDown style={{ fontSize: 14, color: 'white' }} />
            </div>
          </Dropdown>
        </div>

        {(auth.in_group_132 || auth.in_group_131) && (
          <div style={{ display: 'flex', alignItems: 'center', padding: '0 1rem 0.5rem', gap: 8 }}>
            <Form form={form} style={{ width: '100%' }}>
              <Form.Item name="name" style={{ margin: 0 }}>
                <Input
                  placeholder="Nhập mã tài sản hoặc tên tài sản"
                  allowClear
                  onChange={debounce(onChange, 500)}
                />
              </Form.Item>
            </Form>
          </div>
        )}

        <div style={{ padding: '0 1rem', display: 'grid', gridTemplateColumns: '1fr 1fr' }}>
          <Button
            onClick={() => navigate('/asset/audit')}
            style={{ padding: '0.25rem', justifyContent: 'flex-start' }}
            type="text"
          >
            <GiNotebook style={{ color: 'white', fontSize: 16 }} />
            <span style={{ fontSize: 12, color: 'white' }}>Kiểm kê tài sản</span>
          </Button>
          {(auth.in_group_132 || auth.in_group_131) && (
            <Button
              onClick={openScanQR}
              style={{ padding: '0.25rem', justifyContent: 'flex-start' }}
              type="text"
            >
              <div
                style={{
                  display: 'flex',
                  width: '17px',
                  height: '17px',
                  borderRadius: 3,
                  background: 'white',
                  padding: 2,
                  overflow: 'hidden',
                }}
              >
                <BsQrCode style={{ width: '100%', height: '100%' }} />
              </div>
              <span style={{ fontSize: 12, color: 'white' }}>Quét mã QR</span>
            </Button>
          )}
          <Button
            onClick={() => navigate('/asset/transfer')}
            style={{ padding: '0.25rem', justifyContent: 'flex-start' }}
            type="text"
          >
            <PiPackage style={{ color: 'white', fontSize: 16 }} />
            <span style={{ fontSize: 12, color: 'white' }}>Điều chuyển tài sản</span>
          </Button>
          <Button
            onClick={() => navigate('/asset/purchase-handover')}
            style={{ padding: '0.25rem', justifyContent: 'flex-start' }}
            type="text"
          >
            <PiMoneyFill style={{ color: 'white', fontSize: 16 }} />
            <span style={{ fontSize: 12, color: 'white' }}>Bàn giao mua mới</span>
          </Button>
          <Button
            onClick={() => navigate('/asset/repair')}
            style={{ padding: '0.25rem', justifyContent: 'flex-start' }}
            type="text"
          >
            <FaWrench style={{ color: 'white', fontSize: 16 }} />
            <span style={{ fontSize: 12, color: 'white' }}>Sửa chữa tài sản</span>
          </Button>
        </div>
      </div>
      <DrawerSelection
        open={openDrawer}
        handleClose={handleClose}
        handleChangeCompany={handleChangeCompany}
      />
      {isOpen && (
        <QRScanner isOpen={isOpen} setOpen={setOpen} setDecodedText={handleGetAssetViaCode} />
      )}
    </>
  );
};

export default Header;
