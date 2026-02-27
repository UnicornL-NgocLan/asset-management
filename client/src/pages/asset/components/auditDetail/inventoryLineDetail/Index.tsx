import { Button, Form, Radio, Select } from 'antd';
import TextArea from 'antd/es/input/TextArea';
import app from 'axiosConfig';
import { myColor } from 'color';
import { getErrorMessage } from 'helpers/getErrorMessage';
import { IAudit } from 'interface';
import { useEffect, useState } from 'react';
import { IoArrowBackSharp } from 'react-icons/io5';
import PageLoading from 'widgets/PageLoading';
import { InputNumber } from 'antd';
import Empty from 'widgets/Empty';
import _, { set } from 'lodash';
import 'leaflet/dist/leaflet.css';
import '../../../../../index.css';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';

import { Icon, divIcon, point } from 'leaflet';

// Define a custom icon for the map markers
const customIcon = new Icon({
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
  shadowSize: [41, 41],
});

const InventoryLineDetail = ({
  handleRefetchInventoryList,
  openEdit,
  setOpenEdit,
  auditData,
}: {
  handleRefetchInventoryList: () => void;
  openEdit: any;
  setOpenEdit: (i: boolean) => void;
  auditData: IAudit;
}) => {
  const [form] = Form.useForm();
  const [inventoryLine, setInventoryLine] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState('');
  const [state, setState] = useState('');
  const [hasStamp, setHasStamp] = useState(true);
  const [employee, setEmployee] = useState<{ id: number; name: string }[]>([]);
  const [assetUser, setAssetUser] = useState('');
  const [usingDept, setUsingDept] = useState('');
  const [canEdit, setCanEdit] = useState(true);
  const [isUpdating, setIsUpdating] = useState(false);
  const [geoLocation, setGeolocation] = useState<any>(null);
  const [departments, setDepartments] = useState<{ id: number; name: string }[]>([]);

  const handleGetInventoryLine = async () => {
    try {
      setLoading(true);
      const {
        data: { data },
      } = await app.get(`/api/get-asset-inventory-line/${openEdit.id}`);
      if (data.length > 0) {
        setInventoryLine({ ...data[0], opennedByQR: openEdit.opennedByQR });
      }
    } catch (error) {
      const message = getErrorMessage(error);
      alert(message);
    } finally {
      setLoading(false);
    }
  };

  const handleGetEmployeeTemporary = async () => {
    try {
      setLoading(true);
      const {
        data: { data },
      } = await app.get(`/api/get-employee-temporary`);
      if (data.length > 0) {
        setEmployee(data);
      }
    } catch (error) {
      const message = getErrorMessage(error);
      alert(message);
    } finally {
      setLoading(false);
    }
  };

  const handleGetDepartmentTemporarie = async () => {
    try {
      setLoading(true);
      if (!openEdit.asset_using_company_id || openEdit.asset_using_company_id.length === 0) {
        return;
      }
      const {
        data: { data },
      } = await app.get(`/api/get-department-temporary/${openEdit.asset_using_company_id[0]}`);
      if (data.length > 0) {
        console.log(data);
        setDepartments(data);
      }
    } catch (error) {
      const message = getErrorMessage(error);
      alert(message);
    } finally {
      setLoading(false);
    }
  };

  const handleGetData = async () => {
    try {
      await Promise.all([
        handleGetEmployeeTemporary(),
        handleGetInventoryLine(),
        handleGetDepartmentTemporarie(),
      ]);
    } catch (error) {
      const message = getErrorMessage(error);
      alert(message);
    } finally {
      setLoading(false);
    }
  };

  const getCurrentPosition = () => {
    return new Promise((resolve) => {
      if (!navigator.geolocation) {
        resolve(null); // Geolocation not supported
      } else {
        navigator.geolocation.getCurrentPosition(
          (position) => resolve(position),
          () => resolve(null), // If user denies or error occurs
          {
            enableHighAccuracy: true, // yêu cầu vị trí chính xác nhất có thể
            timeout: 10000, // timeout 10 giây
            maximumAge: 0,
          }
        );
      }
    });
  };

  const onFinish = async () => {
    try {
      setIsUpdating(true);
      const { tt, note, dxxl, gtdv } = form.getFieldsValue(['tt', 'note', 'dxxl', 'gtdv']);
      if (!tt && tt !== 0) return alert('Vui lòng nhập só lượng thực tế');
      if (!_.isNumber(tt)) return alert('Trường số thực tế phải là kiểu số');
      if (tt < 0) return alert('Số thực tế phải lớn hơn 0');

      // Attempt to get geolocation
      const position: any = await getCurrentPosition();
      let lat = position?.coords?.latitude ?? null;
      let lng = position?.coords?.longitude ?? null;
      if (position?.coords?.accuracy > 100) {
        lat = null;
        lng = null;
        alert(
          `Vị trí có thể không chính xác! Tọa độ hệ thống ghi nhận lệch ${Math.round(position?.coords?.accuracy)}m. Nếu như bạn đang cập nhật kiểm kê bằng trình duyệt thì vui lòng thử lại`
        );
      }

      const updateData = {
        quantity_thuc_te: tt,
        note,
        de_xuat_xu_ly: dxxl,
        giai_trinh: gtdv,
        status: state,
        latest_inventory_status: status,
        asset_user_temporary: assetUser ? assetUser : null,
        da_dan_tem: hasStamp,
        using_dept: usingDept ? usingDept : null,
        is_done: true,
        inventory_latitude: lat,
        inventory_longitude: lng,
      };
      await app.patch(`/api/update-inventory-line/${openEdit.id}`, updateData);
      handleRefetchInventoryList();
    } catch (error) {
      console.log(error);
      const message = getErrorMessage(error);
      alert(message);
    } finally {
      setIsUpdating(false);
    }
  };

  useEffect(() => {
    if (!inventoryLine) return;
    const {
      quantity_thuc_te,
      note,
      de_xuat_xu_ly,
      giai_trinh,
      latest_inventory_status,
      status: thuc_trang,
      da_dan_tem,
      asset_user_temporary,
      opennedByQR,
      is_done,
      using_dept,
      inventory_latitude,
      inventory_longitude,
    } = inventoryLine;
    form.setFieldValue('tt', !quantity_thuc_te && canEdit ? 0 : quantity_thuc_te);
    form.setFieldValue('note', note ? note : '');
    form.setFieldValue('dxxl', de_xuat_xu_ly ? de_xuat_xu_ly : '');
    form.setFieldValue('gtdv', giai_trinh ? giai_trinh : '');
    setState(thuc_trang);
    setStatus(latest_inventory_status);
    let hasStamp = opennedByQR ? opennedByQR : is_done ? da_dan_tem : false;
    setHasStamp(hasStamp);
    setAssetUser(asset_user_temporary ? asset_user_temporary[0] : '');
    setUsingDept(using_dept ? using_dept[0] : '');
    if (inventory_latitude && inventory_longitude) {
      setGeolocation({ inventory_latitude, inventory_longitude });
    }
  }, [inventoryLine]);

  useEffect(() => {
    if (!['draft', 'process'].some((i) => i === auditData.state)) {
      setCanEdit(false);
    }
  }, []);

  useEffect(() => {
    handleGetData();
  }, []);

  if (loading) return <PageLoading />;

  if (!loading && !inventoryLine)
    return (
      <div style={{ padding: '1rem 0' }}>
        <Empty />
      </div>
    );

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        width: '100vw',
        overflow: 'auto',
        height: '100vh',
        zIndex: 100,
        background: myColor.backgroundColor,
      }}
    >
      <header
        style={{
          position: 'sticky',
          top: 0,
          zIndex: 98,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '1rem 1rem 1rem',
          background: myColor.buttonColor,
        }}
      >
        <div
          style={{ display: 'flex', justifyContent: 'flex-start', position: 'absolute', left: 20 }}
        >
          <IoArrowBackSharp
            style={{ margin: 0, fontSize: 20, color: 'white' }}
            onClick={() => setOpenEdit(false)}
          />
        </div>
        <h5 style={{ margin: 0, fontSize: 14, color: 'white', fontWeight: 500 }}>
          Chi tiết kiểm kê
        </h5>
      </header>

      <div style={{ padding: '1rem' }}>
        <Form
          form={form}
          name="layout-multiple-vertical"
          layout="vertical"
          disabled={!canEdit}
          labelCol={{ span: 4 }}
          onFinish={onFinish}
          wrapperCol={{ span: 20 }}
        >
          <div
            style={{
              background: 'white',
              padding: '1rem 1rem',
              borderRadius: 5,
              boxShadow: '2px 2px 2px rgba(0,0,0,0.2)',
            }}
          >
            <div style={{ paddingBottom: 10 }}>
              <p style={{ margin: 0, fontSize: 13, fontWeight: 600 }}>Tên tài sản</p>
              <p style={{ margin: 0, fontSize: 13 }}>{inventoryLine.asset_id[1]}</p>
            </div>
            <div style={{ paddingBottom: 10 }}>
              <p style={{ margin: 0, fontSize: 13, fontWeight: 600 }}>
                Số lượng sổ sách:{' '}
                <span style={{ margin: 0, fontSize: 13, fontWeight: 400 }}>
                  {inventoryLine.quantity_so_sach}
                </span>
              </p>
            </div>
            <div style={{ paddingBottom: 10 }}>
              <p style={{ margin: 0, fontSize: 13, fontWeight: 600, marginBottom: 8 }}>
                Số lượng thực tế <span style={{ color: 'crimson' }}>*</span>
              </p>
              <Form.Item name="tt" className="m-0" style={{ margin: 0 }}>
                <InputNumber
                  min={0}
                  placeholder="Số lượng thực tế"
                  size="middle"
                  style={{ fontSize: 13, background: myColor.backgroundColor, width: '100%' }}
                />
              </Form.Item>
            </div>
            <div style={{ paddingBottom: 10 }}>
              <p style={{ margin: 0, fontSize: 13, fontWeight: 600, marginBottom: 8 }}>
                Thực trạng
              </p>
              <Select
                style={{ width: '100%' }}
                value={state}
                onChange={(value) => setState(value)}
                options={[
                  { label: 'Đang sử dụng', value: 'dang_su_dung' },
                  { label: 'Hư hỏng', value: 'hu_hong' },
                ]}
              />
            </div>
            <div style={{ paddingBottom: 10 }}>
              <p style={{ margin: 0, fontSize: 13, fontWeight: 600, marginBottom: 8 }}>
                Chi tiết tình trạng kiểm kê gần nhất
              </p>
              <Select
                style={{ width: '100%' }}
                value={status}
                onChange={(value) => setStatus(value)}
                options={[
                  { label: 'Sử dụng tốt', value: 'good' },
                  { label: 'Hư hỏng chờ sửa chữa', value: 'damaged_waiting_for_repair' },
                  { label: 'Hư hỏng chờ thanh lý', value: 'damaged_waiting_for_liquidation' },
                  { label: 'Tự hư hỏng', value: 'self_destruct' },
                ]}
              />
            </div>
            <div style={{ paddingBottom: 10 }}>
              <p style={{ margin: 0, fontSize: 13, fontWeight: 600, marginBottom: 8 }}>
                Phòng ban sử dụng
              </p>
              <Select
                showSearch
                allowClear
                style={{ width: '100%' }}
                value={usingDept}
                filterOption={(input, option) => {
                  const label = String(option?.label ?? '');
                  return label.toLowerCase().includes(input.toLowerCase());
                }}
                onChange={(value) => setUsingDept(value)}
                options={[...departments].map((item) => {
                  return { label: item.name, value: item.id };
                })}
              />
            </div>
            <div style={{ paddingBottom: 10 }}>
              <p style={{ margin: 0, fontSize: 13, fontWeight: 600, marginBottom: 8 }}>
                Người sử dụng
              </p>
              <Select
                showSearch
                allowClear
                style={{ width: '100%' }}
                value={assetUser}
                filterOption={(input, option) => {
                  const label = String(option?.label ?? '');
                  return label.toLowerCase().includes(input.toLowerCase());
                }}
                onChange={(value) => setAssetUser(value)}
                options={[...employee].map((item) => {
                  return { label: item.name, value: item.id };
                })}
              />
            </div>
            <div style={{ paddingBottom: 10 }}>
              <p style={{ margin: 0, fontSize: 13, fontWeight: 600, marginBottom: 8 }}>
                Đã dán tem ?
              </p>
              <Radio.Group
                onChange={(e) => setHasStamp(e.target.value)}
                value={hasStamp}
                style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-around' }}
              >
                <Radio value={true} style={{ fontSize: 13 }}>
                  Đã dán
                </Radio>
                <Radio value={false} style={{ fontSize: 13 }}>
                  Chưa dán
                </Radio>
              </Radio.Group>
            </div>
            <div style={{ paddingBottom: 10 }}>
              <p style={{ margin: 0, fontSize: 13, fontWeight: 600, marginBottom: 8 }}>Ghi chú</p>
              <Form.Item name="note" className="m-0" style={{ margin: 0 }}>
                <TextArea
                  autoSize={{ minRows: 2, maxRows: 5 }}
                  placeholder="Nhập ghi chú..."
                  size="middle"
                  style={{ fontSize: 13, background: myColor.backgroundColor }}
                />
              </Form.Item>
            </div>
            <div style={{ paddingBottom: 10 }}>
              <p style={{ margin: 0, fontSize: 13, fontWeight: 600, marginBottom: 8 }}>
                Đề xuất xử lý
              </p>
              <Form.Item name="dxxl" className="m-0" style={{ margin: 0 }}>
                <TextArea
                  autoSize={{ minRows: 2, maxRows: 5 }}
                  placeholder="Nhập đề xuất xử lý..."
                  size="middle"
                  style={{ fontSize: 13, background: myColor.backgroundColor }}
                />
              </Form.Item>
            </div>
            <div style={{ paddingBottom: 0 }}>
              <p style={{ margin: 0, fontSize: 13, fontWeight: 600, marginBottom: 8 }}>
                Giải trình của đơn vị
              </p>
              <Form.Item name="gtdv" className="m-0" style={{ margin: 0 }}>
                <TextArea
                  autoSize={{ minRows: 2, maxRows: 5 }}
                  placeholder="Nhập giải trình của đơn vị"
                  size="middle"
                  style={{ fontSize: 13, background: myColor.backgroundColor }}
                />
              </Form.Item>
            </div>
            {geoLocation && inventoryLine.is_done && (
              <div style={{ paddingTop: 10 }}>
                <p style={{ margin: 0, fontSize: 13, fontWeight: 600, marginBottom: 8 }}>
                  Vị trí lần cập nhật giá trị kiểm kê gần nhất
                </p>
                <MapContainer
                  center={[geoLocation?.inventory_latitude, geoLocation?.inventory_longitude]}
                  zoom={17}
                >
                  <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  />
                  <Marker
                    position={
                      [geoLocation?.inventory_latitude, geoLocation?.inventory_longitude] as [
                        number,
                        number,
                      ]
                    }
                    icon={customIcon}
                  ></Marker>
                </MapContainer>
              </div>
            )}
            {['draft', 'process'].some((i) => i === auditData.state) && (
              <Form.Item wrapperCol={{ offset: 0, span: 24 }} style={{ margin: 0, paddingTop: 15 }}>
                <Button
                  type="primary"
                  htmlType="submit"
                  size="large"
                  loading={isUpdating}
                  style={{
                    background: myColor.buttonColor,
                    width: '100%',
                    marginTop: 10,
                    fontSize: 14,
                    fontWeight: 600,
                  }}
                >
                  {isUpdating ? 'Đang xử lý' : 'Hoàn tất'}
                </Button>
              </Form.Item>
            )}
          </div>
        </Form>
      </div>
    </div>
  );
};

export default InventoryLineDetail;
