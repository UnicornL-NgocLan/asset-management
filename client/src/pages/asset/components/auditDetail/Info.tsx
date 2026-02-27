import { Button, Tag } from 'antd';
import { myColor } from 'color';
import { IAssetInventoriedDept, IAssetTypeInterface, IAudit, ICommitee } from 'interface';
import moment from 'moment';
import { useSelector } from 'react-redux';
import Empty from 'widgets/Empty';
import { Table, QRCode, Modal } from 'antd';
import Check from '../../../../images/check.png';
import Cross from '../../../../images/letter-x.png';
import empty from '../../../../images/empty-box.png';
import { getErrorMessage } from 'helpers/getErrorMessage';
import { useState } from 'react';
import app from 'axiosConfig';

const Info = ({
  isCurrentUserAssigned,
  assignedLineId,
  assetTypes,
  auditData,
  commitee,
  inventoriedDept,
  handleGetData,
  myTemporaryId,
}: {
  isCurrentUserAssigned: Boolean;
  assignedLineId: Number | null;
  myTemporaryId: Number | null;
  assetTypes: IAssetTypeInterface[];
  auditData: IAudit | null;
  commitee: ICommitee[];
  inventoriedDept: IAssetInventoriedDept[];
  handleGetData: () => void;
}) => {
  const offices = useSelector((state: any) => state.offices);
  const auth = useSelector((state: any) => state.auth);
  const departments = useSelector((state: any) => state.departments);
  const [isProcessing, setIsProcessing] = useState(false);
  const [qrCodeContent, setQrCodeContent] = useState<string>('');
  const [openQrCodeModal, setOpenQrCodeModal] = useState(false);

  const handleShowAuditLocation = (idList: number[]) => {
    if (idList.length === 0) return <></>;
    const officeList = [...idList].map((id, index) => {
      const office = offices.find((item: { id: number; name: string }) => item.id === id);
      if (!office) return <span key={index}></span>;
      return (
        <Tag style={{ margin: 0, fontSize: 10 }} key={index}>
          {office?.name}
        </Tag>
      );
    });

    return officeList;
  };

  const handleShowAssetTypeAudited = (idList: number[]) => {
    if (idList.length === 0) return <></>;
    const officeList = [...idList].map((id, index) => {
      const office = assetTypes.find((item) => item.id === id);
      if (!office) return <span key={index}></span>;
      return (
        <Tag style={{ margin: 0, fontSize: 10 }} key={index}>
          {office?.name}
        </Tag>
      );
    });

    return officeList;
  };

  const handleShowAuditDepartments = (idList: number[]) => {
    if (idList.length === 0) return <></>;
    const depLists = [...idList].map((id, index) => {
      const dept = departments.find((item: { id: number; name: string }) => item.id === id);
      if (!dept) return <span key={index}></span>;
      return (
        <Tag style={{ margin: 0, fontSize: 10 }} key={index}>
          {dept?.name}
        </Tag>
      );
    });

    return depLists;
  };

  const handleUserConfirm = async () => {
    try {
      if (window.confirm('Bạn có đồng ý với kết quả kiểm kê?')) {
        if (isProcessing) return;
        setIsProcessing(true);
        await app.post(`/api/confirm-asset-inventory/${auditData?.id}`);
        handleGetData();
      }
    } catch (error) {
      const message = getErrorMessage(error);
      alert(message);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleUserUnConfirm = async () => {
    try {
      if (window.confirm('Bạn có chắc muốn hủy bỏ xác nhận?')) {
        if (isProcessing) return;
        setIsProcessing(true);
        await app.post(`/api/unconfirm-asset-inventory/${auditData?.id}`);
        handleGetData();
      }
    } catch (error) {
      const message = getErrorMessage(error);
      alert(message);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleChangeToVerifyState = async () => {
    try {
      if (
        window.confirm(
          'Bạn có chắc muốn kết thúc giai đoạn kiểm kê và chuyển sang giai đoạn xác nhận?'
        )
      ) {
        if (isProcessing) return;
        setIsProcessing(true);
        await app.post(`/api/change-to-verifying-state/${auditData?.id}`);
        handleGetData();
      }
    } catch (error) {
      const message = getErrorMessage(error);
      alert(message);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleBackToProcessState = async () => {
    try {
      if (window.confirm('Bạn có chắc muốn quay về giai đoạn kiểm kê?')) {
        if (isProcessing) return;
        setIsProcessing(true);
        await app.post(`/api/change-back-to-process-state/${auditData?.id}`);
        handleGetData();
      }
    } catch (error) {
      const message = getErrorMessage(error);
      alert(message);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleGenerateQRCode = () => {
    setQrCodeContent(
      `${process.env.REACT_APP_CLIENT_URL}/asset/audit/${auditData?.id}?inventory-share-qr=true`
    );
    setOpenQrCodeModal(true);
  };

  const stateTranslator: { [key: string]: string } = {
    draft: 'Nháp',
    process: 'Đang thực hiện',
    validated: 'Đã hoàn tất',
    verifying: 'Đang xác nhận',
    cancel: 'Bị hủy',
  };

  const stateColor: { [key: string]: string } = {
    draft: '',
    process: '#FFB534',
    verifying: '#3787c4ff',
    validated: '#0D7C66',
    cancel: '#EE4E4E',
  };

  const columns = [
    {
      title: 'Họ và tên',
      dataIndex: 'employee_id_temp',
      key: 'employee_id_temp',
      render: (text: any) => <span style={{ fontSize: 12 }}>{text ? text[1] : ''}</span>,
    },
    {
      title: 'Vai trò',
      dataIndex: 'position',
      key: 'position',
      render: (text: any) => <span style={{ fontSize: 12 }}>{text ? text[1] : ''}</span>,
    },
    {
      title: 'Đã xác nhận',
      dataIndex: 'confirm_completed',
      key: 'confirm_completed',
      align: 'center' as const,
      render: (text: any) => <img alt="" src={text ? Check : Cross} style={{ height: 14 }} />,
    },
    {
      title: 'Được chỉ định xác nhận',
      dataIndex: 'assigned_verify',
      key: 'assigned_verify',
      align: 'center' as const,
      render: (text: any) => <img alt="" src={text ? Check : Cross} style={{ height: 14 }} />,
    },
  ];

  const columns2 = [
    {
      title: 'Họ và tên',
      dataIndex: 'employee_id_temp',
      key: 'employee_id_temp',
      render: (text: any) => <span style={{ fontSize: 12 }}>{text ? text[1] : ''}</span>,
    },
    {
      title: 'Phòng ban',
      dataIndex: 'department',
      key: 'department',
      render: (text: any) => <span style={{ fontSize: 12 }}>{text ? text[1] : ''}</span>,
    },
    {
      title: 'Đã xác nhận',
      dataIndex: 'confirm_completed',
      key: 'confirm_completed',
      align: 'center' as const,
      render: (text: any) => <img alt="" src={text ? Check : Cross} style={{ height: 14 }} />,
    },
    {
      title: 'Được chỉ định xác nhận',
      dataIndex: 'assigned_verify',
      key: 'assigned_verify',
      align: 'center' as const,
      render: (text: any) => <img alt="" src={text ? Check : Cross} style={{ height: 14 }} />,
    },
  ];

  let locale = {
    emptyText: (
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <img src={empty} style={{ width: '70px', opacity: 0.4 }} alt="" />
        <span style={{ fontSize: 12, marginTop: 10, opacity: 1 }}>Không có dữ liệu</span>
      </div>
    ),
  };

  if (!auditData) return <Empty />;
  return (
    <div style={{ paddingBottom: 20, padding: '0 1rem 1rem' }}>
      <div
        style={{
          background: 'white',
          padding: '0.5rem 1rem',
          borderRadius: 5,
          boxShadow: '2px 2px 2px rgba(0,0,0,0.2)',
        }}
      >
        <h4 style={{ margin: 0, fontWeight: 500, fontSize: 14, color: myColor.buttonColor }}>
          Thông tin chung
        </h4>
        <hr />
        <div>
          <div>
            <p style={{ fontSize: 12, margin: '0.5rem 0' }}>
              <span style={{ fontWeight: 500 }}>Tên:</span> {auditData.name}
            </p>
            <p style={{ fontSize: 12, margin: '0.5rem 0' }}>
              <span style={{ fontWeight: 500 }}>Ngày bắt đầu:</span>{' '}
              {auditData.start_time &&
                moment(auditData.start_time).add(7, 'hours').format('DD-MM-YYYY HH:mm:ss')}
            </p>
            <p style={{ fontSize: 12, margin: '0.5rem 0' }}>
              <span style={{ fontWeight: 500 }}>Ngày kết thúc:</span>{' '}
              {auditData.end_time &&
                moment(auditData.end_time).add(7, 'hours').format('DD-MM-YYYY HH:mm:ss')}
            </p>
            <p
              style={{
                fontSize: 12,
                margin: '0.5rem 0',
                display: 'flex',
                alignItems: 'center',
                gap: 5,
                flexWrap: 'wrap',
              }}
            >
              <span style={{ fontWeight: 500 }}>Địa điểm: </span>{' '}
              {handleShowAuditLocation(auditData.sea_office_id)}
            </p>
            <p
              style={{
                fontSize: 12,
                margin: '0.5rem 0',
                display: 'flex',
                alignItems: 'center',
                gap: 5,
                flexWrap: 'wrap',
              }}
            >
              <span style={{ fontWeight: 500 }}>Phòng ban: </span>{' '}
              {handleShowAuditDepartments(auditData.department)}
            </p>
            <p
              style={{
                fontSize: 12,
                margin: '0.5rem 0',
                display: 'flex',
                alignItems: 'center',
                gap: 5,
                flexWrap: 'wrap',
              }}
            >
              <span style={{ fontWeight: 500 }}>Loại tài sản: </span>{' '}
              {handleShowAssetTypeAudited(auditData.asset_type_ids)}
            </p>
            <p style={{ fontSize: 12, margin: '0.5rem 0' }}>
              <span style={{ fontWeight: 500 }}>Ghi chú: </span> {auditData.note}
            </p>
            <p style={{ fontSize: 12, margin: '0.5rem 0' }}>
              <span style={{ fontWeight: 500 }}>Trạng thái: </span>{' '}
              <Tag color={stateColor[auditData.state]}>{stateTranslator[auditData.state]}</Tag>
            </p>
          </div>
        </div>
      </div>

      <div
        style={{
          background: 'white',
          padding: '0.5rem 1rem',
          marginTop: 16,
          borderRadius: 5,
          boxShadow: '2px 2px 2px rgba(0,0,0,0.2)',
        }}
      >
        <h4 style={{ margin: 0, fontWeight: 500, fontSize: 14, color: myColor.buttonColor }}>
          Kiểm kê tài sản có trạng thái
        </h4>
        <hr />
        <div>
          <div>
            {/* <p style={{fontSize:12,margin:'0.5rem 0', display:'flex',alignItems:'center', gap:4}}><span style={{fontWeight:500}}>Chưa đưa vào sử dụng:</span> <img alt="" src={auditData.draft_state ? Check : Cross} style={{height:14}}/></p> */}
            <p
              style={{
                fontSize: 12,
                margin: '0.5rem 0',
                display: 'flex',
                alignItems: 'center',
                gap: 4,
              }}
            >
              <span style={{ fontWeight: 500 }}>Đang sử dụng:</span>{' '}
              <img alt="" src={auditData.process_state ? Check : Cross} style={{ height: 14 }} />
            </p>
            <p
              style={{
                fontSize: 12,
                margin: '0.5rem 0',
                display: 'flex',
                alignItems: 'center',
                gap: 4,
              }}
            >
              <span style={{ fontWeight: 500 }}>Đang chờ thanh lý:</span>{' '}
              <img alt="" src={auditData.pending_state ? Check : Cross} style={{ height: 14 }} />
            </p>
          </div>
        </div>
      </div>

      <div
        style={{
          background: 'white',
          padding: '0.5rem 1rem 1rem',
          marginTop: 16,
          borderRadius: 5,
          boxShadow: '2px 2px 2px rgba(0,0,0,0.2)',
        }}
      >
        <h4 style={{ margin: 0, fontWeight: 500, fontSize: 14, color: myColor.buttonColor }}>
          Thành viên ban kiểm kê
        </h4>
        <hr />
        <div>
          {commitee.length === 0 ? (
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <img src={empty} style={{ width: '70px', opacity: 0.5 }} alt="" />
              <span style={{ fontSize: 12, marginTop: 10, opacity: 0.5 }}>Không có dữ liệu</span>
            </div>
          ) : (
            <Table
              columns={columns}
              dataSource={commitee}
              size="small"
              locale={locale}
              bordered
              pagination={false}
              rowKey={(record) => record.id}
            />
          )}
        </div>
      </div>

      <div
        style={{
          background: 'white',
          padding: '0.5rem 1rem 1rem',
          marginTop: 16,
          borderRadius: 5,
          boxShadow: '2px 2px 2px rgba(0,0,0,0.2)',
        }}
      >
        <h4 style={{ margin: 0, fontWeight: 500, fontSize: 14, color: myColor.buttonColor }}>
          Đại diện đơn vị được kiểm kê
        </h4>
        <hr />
        <div>
          {inventoriedDept.length === 0 ? (
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <img src={empty} style={{ width: '70px', opacity: 0.5 }} alt="" />
              <span style={{ fontSize: 12, marginTop: 10, opacity: 0.5 }}>Không có dữ liệu</span>
            </div>
          ) : (
            <Table
              columns={columns2}
              dataSource={inventoriedDept}
              size="small"
              locale={locale}
              bordered
              pagination={false}
              rowKey={(record) => record.id}
            />
          )}
        </div>
      </div>

      {auditData?.state === 'verifying' && isCurrentUserAssigned ? (
        [...inventoriedDept, ...commitee].find(
          (i) =>
            i.assigned_verify &&
            !i.confirm_completed &&
            i.id === assignedLineId &&
            i.employee_id_temp[0] === myTemporaryId
        ) ? (
          <Button
            onClick={handleUserConfirm}
            size="large"
            loading={isProcessing}
            disabled={isProcessing}
            style={{
              background: '#0D7C66',
              padding: 16,
              textAlign: 'center',
              fontWeight: 500,
              color: 'white',
              marginTop: 16,
              width: '100%',
              fontSize: 13,
            }}
          >
            Xác nhận kết quả
          </Button>
        ) : [...inventoriedDept, ...commitee].find(
            (i) =>
              i.assigned_verify &&
              i.confirm_completed &&
              i.id === assignedLineId &&
              i.employee_id_temp[0] === myTemporaryId
          ) ? (
          <Button
            onClick={handleUserUnConfirm}
            size="large"
            loading={isProcessing}
            disabled={isProcessing}
            style={{
              background: '#EE4E4E',
              padding: 16,
              textAlign: 'center',
              fontWeight: 500,
              color: 'white',
              marginTop: 16,
              width: '100%',
              fontSize: 13,
            }}
          >
            Hủy bỏ xác nhận
          </Button>
        ) : (
          <></>
        )
      ) : (
        <></>
      )}

      {auditData?.state === 'verifying' && (auth.in_group_132 || auth.in_group_131) && (
        <Button
          size="large"
          onClick={handleGenerateQRCode}
          disabled={isProcessing}
          style={{
            background: myColor.buttonColor,
            padding: 16,
            textAlign: 'center',
            fontWeight: 500,
            color: 'white',
            marginTop: 16,
            width: '100%',
            fontSize: 13,
          }}
        >
          Tạo QR Code xác nhận
        </Button>
      )}

      {auditData?.state === 'process' && (auth.in_group_132 || auth.in_group_131) && (
        <Button
          size="large"
          onClick={handleChangeToVerifyState}
          disabled={isProcessing}
          style={{
            background: myColor.buttonColor,
            padding: 16,
            textAlign: 'center',
            fontWeight: 500,
            color: 'white',
            marginTop: 16,
            width: '100%',
            fontSize: 13,
          }}
        >
          Chuyển sang giai đoạn xác nhận
        </Button>
      )}

      {auditData?.state === 'verifying' && (auth.in_group_132 || auth.in_group_131) && (
        <Button
          size="large"
          onClick={handleBackToProcessState}
          disabled={isProcessing}
          style={{
            background: myColor.buttonColor,
            padding: 16,
            textAlign: 'center',
            fontWeight: 500,
            color: 'white',
            marginTop: 16,
            width: '100%',
            fontSize: 13,
          }}
        >
          Quay về giai đoạn kiểm kê
        </Button>
      )}

      <Modal
        open={openQrCodeModal}
        footer={null}
        width={300}
        closeIcon={false}
        onClose={() => {
          setOpenQrCodeModal(false);
          setQrCodeContent('');
        }}
        onCancel={() => {
          setOpenQrCodeModal(false);
          setQrCodeContent('');
        }}
      >
        <QRCode value={qrCodeContent} style={{ width: '100%', height: '100%' }} />
      </Modal>
    </div>
  );
};

export default Info;
