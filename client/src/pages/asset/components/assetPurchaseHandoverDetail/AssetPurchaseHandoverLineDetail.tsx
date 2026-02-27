import { Button, Form, Input, InputNumber, Radio, Select } from 'antd';
import { myColor } from 'color';
import { getErrorMessage } from 'helpers/getErrorMessage';
import { IPurchaseHandoverLine } from 'interface';
import React, { useEffect, useState } from 'react';
import { Modal } from 'antd';
import app from 'axiosConfig';

const AssetPurchaseHandoverLineDetail = ({
  isModalPurchaseHandoverLineOpen,
  setIsModalPurchaseHandoverLineOpen,
  handleGetAssetPurchaseHandoverLines,
  canEdit,
}: {
  isModalPurchaseHandoverLineOpen: IPurchaseHandoverLine | null;
  setIsModalPurchaseHandoverLineOpen: (i: null) => void;
  handleGetAssetPurchaseHandoverLines: () => void;
  canEdit: boolean;
}) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState(isModalPurchaseHandoverLineOpen?.status);
  const [isReadyForUse, setIsReadyForUse] = useState(
    isModalPurchaseHandoverLineOpen?.ready_for_use || false
  );
  const [qty_done, setQtyDone] = useState<any>(isModalPurchaseHandoverLineOpen?.quantity || 0);
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
      await app.patch(`/api/update-purchase-handover-line/${isModalPurchaseHandoverLineOpen?.id}`, {
        status: status,
        ready_for_use: isReadyForUse,
        quantity: qty_done,
      });
      setIsModalPurchaseHandoverLineOpen(null);
      handleGetAssetPurchaseHandoverLines();
    } catch (error: any) {
      const message = getErrorMessage(error);
      alert(message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    form.setFieldValue('quantity_done', isModalPurchaseHandoverLineOpen?.quantity || 0);
    form.setFieldValue('status', isModalPurchaseHandoverLineOpen?.status || '');
    setStatus(isModalPurchaseHandoverLineOpen?.status);
    setIsReadyForUse(isModalPurchaseHandoverLineOpen?.ready_for_use || false);
    setQtyDone(isModalPurchaseHandoverLineOpen?.quantity || 0);
  }, [isModalPurchaseHandoverLineOpen]);
  return (
    <Modal
      title="Cập nhật thông tin dòng chuyển giao"
      closable={{ 'aria-label': 'Custom Close Button' }}
      open={!!isModalPurchaseHandoverLineOpen}
      onOk={() => setIsModalPurchaseHandoverLineOpen(null)}
      onCancel={() => setIsModalPurchaseHandoverLineOpen(null)}
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
            <p style={{ margin: 0, fontSize: 13 }}>{isModalPurchaseHandoverLineOpen?.name}</p>
          </div>
          <div style={{ paddingBottom: 10 }}>
            <p style={{ margin: 0, fontSize: 13, fontWeight: 600 }}>Đơn vị tính</p>
            <p style={{ margin: 0, fontSize: 13 }}>
              {isModalPurchaseHandoverLineOpen?.uom_invoice_id?.[1] || ''}
            </p>
          </div>
          <div style={{ paddingBottom: 10 }}>
            <p style={{ margin: 0, fontSize: 13, fontWeight: 600 }}>
              Số lượng lý thuyết:{' '}
              <span style={{ margin: 0, fontSize: 13, fontWeight: 400 }}>
                {isModalPurchaseHandoverLineOpen?.demanding_quantity}
              </span>
            </p>
          </div>
          <div style={{ paddingBottom: 10 }}>
            <p style={{ margin: 0, fontSize: 13, fontWeight: 600, marginBottom: 8 }}>
              Số lượng thực tế <span style={{ color: 'crimson' }}>*</span>
            </p>
            <Form.Item name="quantity_done" className="m-0" style={{ margin: 0, width: '100%' }}>
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
            <p style={{ margin: 0, fontSize: 13, fontWeight: 600, marginBottom: 8 }}>
              Trạng thái <span style={{ color: 'crimson' }}>*</span>
            </p>
            <Form.Item name="status" className="m-0" style={{ margin: 0, width: '100%' }}>
              <Input
                style={{ width: '100%' }}
                value={status}
                onChange={(e) => setStatus(e.target.value)}
              />
            </Form.Item>
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

export default AssetPurchaseHandoverLineDetail;
