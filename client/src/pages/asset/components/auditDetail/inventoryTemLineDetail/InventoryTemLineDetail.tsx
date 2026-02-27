import { Button, Form, Input, Modal, Radio, Select, Upload } from 'antd';
import TextArea from 'antd/es/input/TextArea';
import app from 'axiosConfig';
import { myColor } from 'color';
import { getErrorMessage } from 'helpers/getErrorMessage';
import { IAudit } from 'interface';
import { useEffect, useState } from 'react';
import { IoArrowBackSharp } from 'react-icons/io5';
import PageLoading from 'widgets/PageLoading';
import { InputNumber } from 'antd';
import { FaUpload } from 'react-icons/fa';
import _ from 'lodash';

const InventoryTemLineDetail = ({
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
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState('');
  const [state, setState] = useState('');
  const [hasStamp, setHasStamp] = useState(true);
  const [employee, setEmployee] = useState<{ id: number; name: string }[]>([]);
  const [uoms, setUoms] = useState<{ id: number; name: string }[]>([]);
  const [companies, setCompanies] = useState<{ id: number; name: string }[]>([]);
  const [fileList, setFileList] = useState<any>([]);
  const [assetUser, setAssetUser] = useState('');
  const [canEdit, setCanEdit] = useState(true);
  const [isUpdating, setIsUpdating] = useState(false);
  const [previewImage, setPreviewImage] = useState('');
  const [previewOpen, setPreviewOpen] = useState(false);

  const handleGetInventoryLine = async () => {
    try {
      if (openEdit?.id) {
        setLoading(true);
        const {
          data: { data, images },
        } = await app.get(`/api/get-asset-inventory-asset-temporary-line/${openEdit.id}`);
        if (data.length > 0) {
          setInventoryLine({ ...data[0], opennedByQR: openEdit.opennedByQR, images });
        }
      }
    } catch (error) {
      const message = getErrorMessage(error);
      alert(message);
    } finally {
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
    }
  };

  const handleGetUoms = async () => {
    try {
      setLoading(true);
      const {
        data: { data },
      } = await app.get(`/api/get-uoms`);
      if (data.length > 0) {
        setUoms(data);
      }
    } catch (error) {
      const message = getErrorMessage(error);
      alert(message);
    } finally {
    }
  };

  const handleGetCompanies = async () => {
    try {
      setLoading(true);
      const {
        data: { data },
      } = await app.get(`/api/get-companies`);
      if (data.length > 0) {
        setCompanies(data);
      }
    } catch (error) {
      const message = getErrorMessage(error);
      alert(message);
    } finally {
    }
  };

  const handleGetData = async () => {
    try {
      setLoading(true);
      await Promise.all([
        handleGetEmployeeTemporary(),
        handleGetInventoryLine(),
        handleGetUoms(),
        handleGetCompanies(),
      ]);
    } catch (error) {
      const message = getErrorMessage(error);
      alert(message);
    } finally {
      setLoading(false);
    }
  };

  const onFinish = async () => {
    try {
      setIsUpdating(true);
      const {
        name,
        code,
        description,
        uom_id,
        company_using,
        company_owner,
        tt,
        note,
        de_xuat_xu_ly,
        giai_trinh,
      } = form.getFieldsValue([
        'tt',
        'note',
        'de_xuat_xu_ly',
        'giai_trinh',
        'name',
        'code',
        'description',
        'uom_id',
        'company_using',
        'company_owner',
      ]);
      if (!tt && tt !== 0) return alert('Vui lòng nhập só lượng thực tế');
      if (!_.isNumber(tt)) return alert('Trường số thực tế phải là kiểu số');
      if (tt < 0) return alert('Số thực tế phải lớn hơn 0');

      const updateData = {
        name,
        code,
        description,
        asset_uom_uom: uom_id,
        quantity_thuc_te: tt,
        asset_using_company_id: company_using,
        asset_company_id: company_owner,
        note,
        de_xuat_xu_ly: de_xuat_xu_ly,
        giai_trinh: giai_trinh,
        status: state,
        latest_inventory_status: status,
        asset_user_temporary: assetUser ? assetUser : null,
        da_dan_tem: hasStamp,
        is_done: true,
        asset_inventory_id: auditData?.id,
      };
      if (openEdit?.id) {
        await app.patch(`/api/update-asset-temporary-inventory-line/${openEdit.id}`, updateData);
      } else {
        await app.post(`/api/create-asset-temporary-list`, updateData);
      }
      handleRefetchInventoryList();
    } catch (error) {
      const message = getErrorMessage(error);
      alert(message);
    } finally {
      setIsUpdating(false);
    }
  };

  useEffect(() => {
    if (!inventoryLine) return;
    const {
      name,
      code,
      description,
      quantity_thuc_te,
      note,
      asset_uom_uom,
      de_xuat_xu_ly,
      giai_trinh,
      latest_inventory_status,
      status: thuc_trang,
      da_dan_tem,
      asset_user_temporary,
      opennedByQR,
      asset_using_company_id,
      asset_company_id,
      images,
    } = inventoryLine;
    console.log(inventoryLine);
    form.setFieldValue('name', name);
    form.setFieldValue('code', code || '');
    form.setFieldValue('description', description || '');
    form.setFieldValue('tt', quantity_thuc_te);
    form.setFieldValue('note', note ? note : '');
    form.setFieldValue('uom_id', asset_uom_uom ? asset_uom_uom[0] : null);
    form.setFieldValue('giai_trinh', giai_trinh ? giai_trinh : '');
    form.setFieldValue('de_xuat_xu_ly', de_xuat_xu_ly ? de_xuat_xu_ly : '');
    form.setFieldValue('company_using', asset_using_company_id ? asset_using_company_id[0] : null);
    form.setFieldValue('company_owner', asset_company_id ? asset_company_id[0] : null);
    setState(thuc_trang);
    setStatus(latest_inventory_status);
    setHasStamp(opennedByQR || da_dan_tem);
    setAssetUser(asset_user_temporary ? asset_user_temporary[0] : '');

    let imageList = images.map((i: any) => {
      return {
        uid: i.id,
        name: i.asset_filename,
        status: 'done',
        url: `data:image/png;base64,${i.asset_image}`,
        thumbUrl: `data:image/png;base64,${i.asset_image}`,
      };
    });
    setFileList(imageList);
  }, [inventoryLine]);

  const beforeUpload = (file: any) => {
    return false; // Prevent upload
  };

  const handleDeleteAssetTemporary = async () => {
    try {
      if (window.confirm('Bạn có chắc muốn xóa phát sinh này?')) {
        setIsUpdating(true);
        await app.delete(`/api/delete-asset-temporary-line/${openEdit.id}`);
        handleRefetchInventoryList();
      }
    } catch (error) {
      const message = getErrorMessage(error);
      alert(message);
    } finally {
      setIsUpdating(false);
    }
  };

  const handlePreview = async (file: any) => {
    if (!file.url && !file.preview) {
      file.preview = await new Promise((resolve) => {
        const reader = new FileReader();
        reader.readAsDataURL(file.originFileObj);
        reader.onload = () => resolve(reader.result as string);
      });
    }
    setPreviewImage(file.url || file.preview);
    setPreviewOpen(true);
  };

  useEffect(() => {
    if (!['draft', 'process'].some((i) => i === auditData.state)) {
      setCanEdit(false);
    }
  }, []);

  useEffect(() => {
    handleGetData();
  }, []);

  if (loading) return <PageLoading />;

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
          {openEdit?.id ? 'Thông tin chi tiết' : 'Tạo mới phát sinh'}
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
              <p style={{ margin: 0, fontSize: 13, fontWeight: 600, marginBottom: 8 }}>
                Tên <span style={{ color: 'crimson' }}>*</span>
              </p>
              <Form.Item name="name" required className="m-0" style={{ margin: 0 }}>
                <Input
                  placeholder="Ghế xoay..."
                  size="middle"
                  style={{ fontSize: 13, background: myColor.backgroundColor }}
                />
              </Form.Item>
            </div>
            <div style={{ paddingBottom: 10 }}>
              <p style={{ margin: 0, fontSize: 13, fontWeight: 600, marginBottom: 8 }}>Mã</p>
              <Form.Item name="code" className="m-0" style={{ margin: 0 }}>
                <Input
                  size="middle"
                  style={{ fontSize: 13, background: myColor.backgroundColor }}
                />
              </Form.Item>
            </div>
            <div style={{ paddingBottom: 10 }}>
              <p style={{ margin: 0, fontSize: 13, fontWeight: 600, marginBottom: 8 }}>Mô tả</p>
              <Form.Item name="description" className="m-0" style={{ margin: 0 }}>
                <TextArea
                  autoSize={{ minRows: 2, maxRows: 5 }}
                  size="middle"
                  style={{ fontSize: 13, background: myColor.backgroundColor }}
                />
              </Form.Item>
            </div>
            <div style={{ paddingBottom: 10 }}>
              <p style={{ margin: 0, fontSize: 13, fontWeight: 600, marginBottom: 8 }}>
                Đơn vị tính <span style={{ color: 'crimson' }}>*</span>
              </p>
              <Form.Item name="uom_id" className="m-0" required style={{ margin: 0 }}>
                <Select
                  showSearch
                  allowClear
                  style={{ width: '100%' }}
                  filterOption={(input, option) => {
                    const label = String(option?.label ?? '');
                    return label.toLowerCase().includes(input.toLowerCase());
                  }}
                  options={[...uoms].map((item) => {
                    return { label: item.name, value: item.id };
                  })}
                />
              </Form.Item>
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
                Công ty sở hữu: <span style={{ color: 'crimson' }}>*</span>
              </p>
              <Form.Item name="company_owner" className="m-0" style={{ margin: 0 }}>
                <Select
                  showSearch
                  allowClear
                  style={{ width: '100%' }}
                  filterOption={(input, option) =>
                    (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
                  }
                  options={[...companies].map((item) => {
                    return { label: item.name, value: item.id };
                  })}
                />
              </Form.Item>
            </div>
            <div style={{ paddingBottom: 10 }}>
              <p style={{ margin: 0, fontSize: 13, fontWeight: 600, marginBottom: 8 }}>
                Công ty sử dụng: <span style={{ color: 'crimson' }}>*</span>
              </p>
              <Form.Item name="company_using" className="m-0" style={{ margin: 0 }}>
                <Select
                  showSearch
                  allowClear
                  style={{ width: '100%' }}
                  filterOption={(input, option) =>
                    (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
                  }
                  options={[...companies].map((item) => {
                    return { label: item.name, value: item.id };
                  })}
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
                  size="middle"
                  style={{ fontSize: 13, background: myColor.backgroundColor }}
                />
              </Form.Item>
            </div>
            <div style={{ paddingBottom: 10 }}>
              <p style={{ margin: 0, fontSize: 13, fontWeight: 600, marginBottom: 8 }}>
                Đề xuất xử lý
              </p>
              <Form.Item name="de_xuat_xu_ly" className="m-0" style={{ margin: 0 }}>
                <TextArea
                  autoSize={{ minRows: 2, maxRows: 5 }}
                  size="middle"
                  style={{ fontSize: 13, background: myColor.backgroundColor }}
                />
              </Form.Item>
            </div>
            <div style={{ paddingBottom: 10 }}>
              <p style={{ margin: 0, fontSize: 13, fontWeight: 600, marginBottom: 8 }}>
                Giải trình của đơn vị
              </p>
              <Form.Item name="giai_trinh" className="m-0" style={{ margin: 0 }}>
                <TextArea
                  autoSize={{ minRows: 2, maxRows: 5 }}
                  size="middle"
                  style={{ fontSize: 13, background: myColor.backgroundColor }}
                />
              </Form.Item>
            </div>
            {/* <div style={{ paddingBottom: 10 }}>
              <p style={{ margin: 0, fontSize: 13, fontWeight: 600, marginBottom: 8 }}>Hình ảnh</p>
              <Upload
                beforeUpload={beforeUpload}
                fileList={fileList}
                multiple={false}
                listType="picture"
                accept="image/*"
                onPreview={handlePreview}
                onChange={({ fileList }) => {
                  console.log(fileList)
                  setFileList(fileList)}} // use provided fileList
              >
                <Button icon={<FaUpload />}>Upload</Button>
              </Upload>
              <Modal
                open={previewOpen}
                footer={null}
                styles={{
                  content: { padding: 0 }, // <- targets .ant-modal-content
                  header: { display: "none", padding: 0, margin: 0 }, // hides header (no extra gap)
                  body: { padding: 0 }, // <- targets .ant-modal-body
                  footer: { display: "none" },
                }}
                closeIcon={null}
                centered
                onCancel={() => setPreviewOpen(false)}
              >
                <img alt="preview" style={{ width: "100%", display: "block" }} src={previewImage} />
              </Modal>
            </div> */}
          </div>
          {['draft', 'process'].some((i) => i === auditData.state) && (
            <Form.Item wrapperCol={{ offset: 0, span: 24 }} style={{ margin: 0, paddingTop: 15 }}>
              <Button
                type="primary"
                htmlType="submit"
                size="large"
                loading={isUpdating}
                disabled={isUpdating}
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
          {['draft', 'process'].some((i) => i === auditData.state) && openEdit?.id && (
            <Button
              danger
              type="primary"
              onClick={handleDeleteAssetTemporary}
              size="large"
              disabled={isUpdating}
              loading={isUpdating}
              style={{ width: '100%', marginTop: 10, fontSize: 14, fontWeight: 600 }}
            >
              {isUpdating ? 'Đang xử lý' : 'Xóa'}
            </Button>
          )}
        </Form>
      </div>
    </div>
  );
};

export default InventoryTemLineDetail;
