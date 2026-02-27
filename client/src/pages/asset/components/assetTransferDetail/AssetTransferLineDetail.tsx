import { Button, Form, InputNumber, Radio, Select } from 'antd';
import { myColor } from 'color';
import { getErrorMessage } from 'helpers/getErrorMessage';
import { IAssetTransferLine } from 'interface';
import React, { useEffect, useState } from 'react';
import { Modal } from 'antd';
import app from 'axiosConfig';

const AssetTransferLineDetail = ({
  isModalTransferLineOpen,
  setIsModalTransferLineOpen,
  handleGetAssetTransferLines,
  canEdit,
}: {
  isModalTransferLineOpen: IAssetTransferLine | null;
  setIsModalTransferLineOpen: (i: null) => void;
  handleGetAssetTransferLines: () => void;
  canEdit: boolean;
}) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState(isModalTransferLineOpen?.asset_status_transfer || 'good');
  const [isReadyForUse, setIsReadyForUse] = useState(
    isModalTransferLineOpen?.ready_for_use || false
  );
  const [qty_done, setQtyDone] = useState<any>(isModalTransferLineOpen?.quantity_done || 0);
  const onFinish = async () => {
    try {
      if (qty_done < 0) {
        alert('Số lượng thực tế không được nhỏ hơn 0');
        return;
      }
      if (!Number.isInteger(qty_done)) {
        alert('Số lượng thực tế phải là số nguyên');
        return;
      }
      if (loading) return;
      setLoading(true);
      await app.patch(`/api/update-transfer-line/${isModalTransferLineOpen?.id}`, {
        asset_status_transfer: status,
        ready_for_use: isReadyForUse,
        quantity_done: qty_done,
      });
      setIsModalTransferLineOpen(null);
      handleGetAssetTransferLines();
    } catch (error: any) {
      const message = getErrorMessage(error);
      alert(message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    form.setFieldValue('quantity_done', isModalTransferLineOpen?.quantity_done || 0);
    setStatus(isModalTransferLineOpen?.asset_status_transfer || 'good');
    setIsReadyForUse(isModalTransferLineOpen?.ready_for_use || false);
    setQtyDone(isModalTransferLineOpen?.quantity_done || 0);
  }, [isModalTransferLineOpen]);
  return (
    <Modal
      title="Cập nhật thông tin dòng chuyển giao"
      closable={{ 'aria-label': 'Custom Close Button' }}
      open={!!isModalTransferLineOpen}
      onOk={() => setIsModalTransferLineOpen(null)}
      maskClosable={false}
      onCancel={() => setIsModalTransferLineOpen(null)}
      footer={null}
    >
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
          }}
        >
          <div style={{ paddingBottom: 10 }}>
            <p style={{ margin: 0, fontSize: 13, fontWeight: 600 }}>Tên tài sản</p>
            <p style={{ margin: 0, fontSize: 13 }}>{isModalTransferLineOpen?.asset_id[1]}</p>
          </div>
          <div style={{ paddingBottom: 10 }}>
            <p style={{ margin: 0, fontSize: 13, fontWeight: 600 }}>Phòng ban nhận</p>
            <p style={{ margin: 0, fontSize: 13 }}>
              {isModalTransferLineOpen?.dest_department_temporary
                ? isModalTransferLineOpen.dest_department_temporary[1]
                : ''}
            </p>
          </div>
          <div style={{ paddingBottom: 10 }}>
            <p style={{ margin: 0, fontSize: 13, fontWeight: 600 }}>Người sử dụng tiếp theo</p>
            <p style={{ margin: 0, fontSize: 13 }}>
              {isModalTransferLineOpen?.dest_asset_user_temporary
                ? isModalTransferLineOpen.dest_asset_user_temporary[1]
                : ''}
            </p>
          </div>
          <div style={{ paddingBottom: 10 }}>
            <p style={{ margin: 0, fontSize: 13, fontWeight: 600 }}>
              Số lượng lý thuyết:{' '}
              <span style={{ margin: 0, fontSize: 13, fontWeight: 400 }}>
                {isModalTransferLineOpen?.quantity_demanding}
              </span>
            </p>
          </div>
          <div style={{ paddingBottom: 10 }}>
            <p style={{ margin: 0, fontSize: 13, fontWeight: 600, marginBottom: 8 }}>
              Số lượng thực tế <span style={{ color: 'crimson' }}>*</span>
            </p>
            <Form.Item name="quantity_done" className="m-0" style={{ margin: 0 }}>
              <InputNumber
                min={0}
                placeholder="Số lượng thực tế"
                onChange={(value) => setQtyDone(value)}
                size="middle"
                style={{ fontSize: 13, background: myColor.backgroundColor, width: '100%' }}
              />
            </Form.Item>
          </div>
          <div style={{ paddingBottom: 10 }}>
            <p style={{ margin: 0, fontSize: 13, fontWeight: 600, marginBottom: 8 }}>Thực trạng</p>
            <Select
              style={{ width: '100%' }}
              value={status}
              onChange={(value) => setStatus(value)}
              options={[
                { label: 'Tốt', value: 'good' },
                { label: 'Hư hỏng chờ sửa chữa', value: 'damaged_waiting_for_repair' },
                { label: 'Hư hỏng chờ thanh lý', value: 'damaged_waiting_for_liquidation' },
              ]}
            />
          </div>
          <div style={{ paddingBottom: 10 }}>
            <p style={{ margin: 0, fontSize: 13, fontWeight: 600, marginBottom: 8 }}>
              Sẵn sàng sử dụng ?
            </p>
            <Radio.Group
              onChange={(e) => setIsReadyForUse(e.target.value)}
              value={isReadyForUse}
              style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-around' }}
            >
              <Radio value={true} style={{ fontSize: 13 }}>
                Có
              </Radio>
              <Radio value={false} style={{ fontSize: 13 }}>
                Không
              </Radio>
            </Radio.Group>
          </div>

          {canEdit && (
            <Form.Item wrapperCol={{ offset: 0, span: 24 }} style={{ margin: 0, paddingTop: 15 }}>
              <Button
                type="primary"
                htmlType="submit"
                size="large"
                loading={loading}
                style={{
                  background: myColor.buttonColor,
                  width: '100%',
                  marginTop: 10,
                  fontSize: 14,
                  fontWeight: 600,
                }}
              >
                {loading ? 'Đang xử lý' : 'Cập nhật'}
              </Button>
            </Form.Item>
          )}
        </div>
      </Form>
    </Modal>
  );
};

export default AssetTransferLineDetail;
