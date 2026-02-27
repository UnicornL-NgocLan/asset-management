import { useEffect, useState } from 'react';
import { myColor } from 'color';
import { IoArrowBackSharp } from 'react-icons/io5';
import { useNavigate, useParams } from 'react-router-dom';
import { getErrorMessage } from 'helpers/getErrorMessage.tsx';
import app from 'axiosConfig.tsx';
import { IAssetRepairDetail, IAssetRepairLine, IAssetTransferLine } from 'interface/index.tsx';
import Skeleton from 'react-loading-skeleton';
import { Button, List, Modal, Table, Tag } from 'antd';
import Check from '../../../../images/check.png';
import Cross from '../../../../images/letter-x.png';
import { MapContainer, Marker, TileLayer } from 'react-leaflet';
import { Icon } from 'leaflet';
import AssetRepairLineDetail from './AssetRepairLineDetail';

const AssetRepairtDetail = () => {
  const [loading, setLoading] = useState(true);
  const [assetRepairData, setAssetRepairData] = useState<IAssetRepairDetail | null>(null);
  const [assetRepairLines, setAssetRepairLines] = useState<IAssetRepairLine[]>([]);
  const [isModalAssetRepairLineOpen, setIsModalAssetRepairLineOpen] =
    useState<IAssetRepairLine | null>(null);
  const [isHandover, setisHandover] = useState(false);
  const [isReceiver, setisReceiver] = useState(false);
  const [isAssetManagement, setisAssetManagement] = useState(false);
  const [isRelatedParty, setisRelatedParty] = useState(false);
  const [isProcessing, setProcess] = useState(false);
  const [roles, setRoles] = useState<any[]>([]);
  const [isModalLocationOpen, setIsModalLocationOpen] = useState(false);
  const navigate = useNavigate();
  const { id } = useParams();

  // Define a custom icon for the map markers
  const customIcon = new Icon({
    iconUrl:
      'https://res.cloudinary.com/dhrpdnd8m/image/upload/v1770952209/jkkiry22nnwvayq0yvpb.png',
    iconSize: [30, 41],
    iconAnchor: [14, 41],
    popupAnchor: [1, -34],
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
    shadowSize: [41, 41],
  });

  const customIcon2 = new Icon({
    iconUrl:
      'https://res.cloudinary.com/dhrpdnd8m/image/upload/v1770952771/r005a3u2daradwhyoywj.png',
    iconSize: [30, 41],
    iconAnchor: [14, 41],
    popupAnchor: [1, -34],
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
    shadowSize: [41, 41],
  });

  const handleGetAssetRepairDetail = async () => {
    try {
      setLoading(true);
      const {
        data: { data },
      } = await app.get('/api/get-asset-repair-by-id/' + id);
      if (data.length > 0) {
        console.log(data);
        setAssetRepairData(data[0]);
        let roleInvovled = [
          {
            id: 1,
            role: 'Người bàn giao',
            employee_id_temp: data[0]?.handover_party_id ? data[0].handover_party_id[1] : null,
            confirm_completed: data[0]?.shipper_already_confirm,
          },
          {
            id: 2,
            role: 'Người nhận bàn giao',
            employee_id_temp: data[0]?.receive_party_id ? data[0].receive_party_id[1] : null,
            confirm_completed: data[0]?.receiver_already_confirm,
          },
          {
            id: 3,
            role: 'Bộ phận QLTS',
            employee_id_temp: data[0]?.asset_management_party_id
              ? data[0].asset_management_party_id[1]
              : null,
            confirm_completed: data[0]?.asset_management_already_confirm,
          },
          {
            id: 4,
            role: 'Bên liên quan',
            employee_id_temp: data[0]?.related_party_id ? data[0].related_party_id[1] : null,
            confirm_completed: data[0]?.related_party_already_confirm,
          },
        ];

        if (!data[0]?.asset_management_party_id) {
          roleInvovled = roleInvovled.filter((item) => item.id !== 3);
        }
        if (!data[0]?.related_party_id) {
          roleInvovled = roleInvovled.filter((item) => item.id !== 4);
        }
        setRoles(roleInvovled);

        // Build array of API calls to execute in parallel
        const apiCalls = [
          app.get(`/api/check-userid-by-hr-temp-id?hr_temp_id=${data[0]?.handover_party_id[0]}`),
          app.get(`/api/check-userid-by-hr-temp-id?hr_temp_id=${data[0]?.receive_party_id[0]}`),
        ];

        // Add conditional API calls
        if (data[0]?.asset_management_party_id) {
          apiCalls.push(
            app.get(
              `/api/check-userid-by-hr-temp-id?hr_temp_id=${data[0]?.asset_management_party_id[0]}`
            )
          );
        }

        if (data[0]?.related_party_id) {
          apiCalls.push(
            app.get(`/api/check-userid-by-hr-temp-id?hr_temp_id=${data[0]?.related_party_id[0]}`)
          );
        }

        // Execute all API calls in parallel
        const responses = await Promise.all(apiCalls);

        // Set state based on responses
        setisHandover(responses[0].data.isCurrentUerAssignedUserId);
        setisReceiver(responses[1].data.isCurrentUerAssignedUserId);

        let responseIndex = 2;
        if (data[0]?.asset_management_party_id) {
          setisAssetManagement(responses[responseIndex].data.isCurrentUerAssignedUserId);
          responseIndex++;
        }

        if (data[0]?.related_party_id) {
          setisRelatedParty(responses[responseIndex].data.isCurrentUerAssignedUserId);
        }
      }
    } catch (error) {
      const message = getErrorMessage(error);
      alert(message);
    } finally {
      setLoading(false);
    }
  };

  const handleGetAssetRepairLines = async () => {
    try {
      setLoading(true);
      const {
        data: { data },
      } = await app.get('/api/get-asset-repair-line/' + id);
      setAssetRepairLines(data);
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
          () => resolve(''), // If user denies or error occurs
          {
            enableHighAccuracy: true, // yêu cầu vị trí chính xác nhất có thể
            timeout: 10000, // timeout 10 giây
            maximumAge: 0,
          }
        );
      }
    });
  };

  const handleConfirm = async (functionName: string) => {
    try {
      setProcess(true);
      let lat;
      let lng;
      // Attempt to get geolocation
      console.log(functionName);
      if (
        functionName.includes('action_receiver_confirm') ||
        functionName.includes('action_shipper_confirm')
      ) {
        const position: any = await getCurrentPosition();
        lat = position?.coords?.latitude ?? null;
        lng = position?.coords?.longitude ?? null;
        if (position?.coords?.accuracy > 100) {
          lat = null;
          lng = null;
          alert(
            `Vị trí có thể không chính xác! Tọa độ hệ thống ghi nhận lệch ${Math.round(position?.coords?.accuracy)}m. Nếu như bạn đang cập nhật kiểm kê bằng trình duyệt thì vui lòng thử lại`
          );
        }
      }
      await app.post('/api/asset-repair-confirm', {
        uid: id,
        functionName: functionName,
        lat,
        lng,
      });
      await handleGetAssetRepairDetail();
    } catch (error) {
      const message = getErrorMessage(error);
      alert(message);
    } finally {
      setProcess(false);
    }
  };

  const column = [
    {
      title: 'Vai trò',
      dataIndex: 'role',
      key: 'role',
      render: (text: any) => <span style={{ fontSize: 12 }}>{text}</span>,
    },
    {
      title: 'Họ tên',
      dataIndex: 'employee_id_temp',
      key: 'employee_id_temp',
      render: (text: any) => <span style={{ fontSize: 12 }}>{text}</span>,
    },
    {
      title: 'Đã xác nhận',
      dataIndex: 'confirm_completed',
      key: 'confirm_completed',
      width: 70,
      align: 'center' as const,
      render: (text: any) => <img alt="" src={text ? Check : Cross} style={{ height: 14 }} />,
    },
  ];

  const vietNamTranslateState = (state: string) => {
    switch (state) {
      case 'good':
        return 'Tốt';
      case 'damaged_waiting_for_repair':
        return 'Hỏng - Chờ sửa chữa';
      case 'damaged_waiting_for_liquidation':
        return 'Hỏng - Chờ thanh lý';
      case 'self_destruct':
        return 'Tự hư hỏng';
      default:
        return 'Không xác định';
    }
  };

  useEffect(() => {
    handleGetAssetRepairDetail();
    handleGetAssetRepairLines();
  }, []);

  return (
    <div
      style={{
        backgroundColor: myColor.backgroundColor,
        height: '100vh',
        overflow: 'auto',
        width: '100vw',
      }}
    >
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
            onClick={() => navigate('/asset/repair', { replace: true })}
          />
        </div>
        <h5 style={{ margin: 0, fontSize: 14, color: 'white', fontWeight: 500 }}>
          {assetRepairData ? assetRepairData.name : 'Chi tiết phiếu sửa chữa tài sản'}
        </h5>
        <div></div>
      </header>
      <div style={{ padding: '1rem' }}>
        {loading ? (
          <>
            <Skeleton count={1} height={200} borderRadius={10} style={{ marginBottom: 6 }} />
            <Skeleton count={2} height={100} borderRadius={10} style={{ marginBottom: 6 }} />
          </>
        ) : (
          <>
            <div
              style={{
                background: 'white',
                padding: '0.5rem 1rem',
                borderRadius: 5,
                marginBottom: '1rem',
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
                    <span style={{ fontWeight: 500 }}>Mã phiếu:</span> {assetRepairData?.name}
                  </p>
                  <p style={{ fontSize: 12, margin: '0.5rem 0' }}>
                    <span style={{ fontWeight: 500 }}>Lý do:</span>{' '}
                    {assetRepairData?.reason ? assetRepairData.reason : ''}
                  </p>
                  <p style={{ fontSize: 12, margin: '0.5rem 0' }}>
                    <span style={{ fontWeight: 500 }}>Phiếu tổng hợp:</span>{' '}
                    {assetRepairData?.assset_request_assessment_id
                      ? assetRepairData.assset_request_assessment_id[1]
                      : ''}
                  </p>
                  <p style={{ fontSize: 12, margin: '0.5rem 0' }}>
                    <span style={{ fontWeight: 500 }}>Văn bản trình ký:</span>{' '}
                    {assetRepairData?.proposal_id ? assetRepairData.proposal_id[1] : ''}
                  </p>
                  <p style={{ fontSize: 12, margin: '0.5rem 0' }}>
                    <span style={{ fontWeight: 500 }}>Ghi chú:</span>{' '}
                    {assetRepairData?.note ? assetRepairData.note : ''}
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
              <div
                style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
              >
                <h4
                  style={{ margin: 0, fontWeight: 500, fontSize: 14, color: myColor.buttonColor }}
                >
                  Các bên tham gia
                </h4>
                {[
                  assetRepairData?.shipper_confirm_latitude,
                  assetRepairData?.receiver_confirm_latitude,
                  assetRepairData?.shipper_confirm_longitude,
                  assetRepairData?.receiver_confirm_longitude,
                ].some((value) => value !== null && value !== 0) && (
                  <Button
                    size="small"
                    type="primary"
                    style={{ background: myColor.buttonColor }}
                    onClick={() => setIsModalLocationOpen(true)}
                  >
                    📍 Xem tọa độ
                  </Button>
                )}
              </div>
              <hr />
              <div>
                <Table
                  columns={column}
                  dataSource={roles}
                  size="small"
                  bordered
                  pagination={false}
                  rowKey={(record) => record.id}
                />
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
                Danh sách tài sản
              </h4>
              <hr />
              <div>
                <List
                  itemLayout="horizontal"
                  dataSource={assetRepairLines}
                  renderItem={(item: IAssetRepairLine, index) => (
                    <List.Item
                      onClick={() => setIsModalAssetRepairLineOpen(item)}
                      key={item.id}
                      style={{
                        display: 'block',
                        background: 'white',
                        marginBottom: 10,
                        borderRadius: 5,
                        boxShadow: '2px 2px 1px rgba(0,0,0,0.2)',
                        padding: 8,
                      }}
                    >
                      <List.Item.Meta
                        title={
                          <span style={{ margin: 0, fontSize: 14, fontWeight: 500 }}>
                            {item.asset_id[1]}
                          </span>
                        }
                      />
                      <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
                        <span
                          style={{
                            margin: 0,
                            fontSize: 12,
                          }}
                        >
                          <span style={{ fontWeight: 500 }}>Số lượng bàn giao: </span>
                          <span style={{ margin: 0, fontSize: 12 }}>{item.quantity}</span>
                        </span>
                      </div>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
                        <span
                          style={{
                            margin: 0,
                            fontSize: 12,
                          }}
                        >
                          <span style={{ fontWeight: 500 }}>Báo cáo sự cố: </span>
                          <span style={{ margin: 0, fontSize: 12 }}>
                            {item.incident_report_id ? item.incident_report_id[1] : ''}
                          </span>
                        </span>
                      </div>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
                        <span
                          style={{
                            margin: 0,
                            fontSize: 12,
                          }}
                        >
                          <span style={{ fontWeight: 500 }}>Đơn vị sửa chữa: </span>
                          <span style={{ margin: 0, fontSize: 12 }}>
                            {item.repair_party ? item.repair_party : ''}
                          </span>
                        </span>
                      </div>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
                        <span
                          style={{
                            margin: 0,
                            fontSize: 12,
                          }}
                        >
                          <span style={{ fontWeight: 500 }}>Nơi xảy ra sự cố: </span>
                          <span style={{ margin: 0, fontSize: 12 }}>
                            {item.accident_place ? item.accident_place : ''}
                          </span>
                        </span>
                      </div>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
                        <span
                          style={{
                            margin: 0,
                            fontSize: 12,
                          }}
                        >
                          <span style={{ fontWeight: 500 }}>Nguyên nhân xảy ra sự cố: </span>
                          <span style={{ margin: 0, fontSize: 12 }}>
                            {item.reason_of_incident ? item.reason_of_incident : ''}
                          </span>
                        </span>
                      </div>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
                        <span
                          style={{
                            margin: 0,
                            fontSize: 12,
                          }}
                        >
                          <span style={{ fontWeight: 500 }}>Hậu quả: </span>
                          <span style={{ margin: 0, fontSize: 12 }}>
                            {item.consequence ? item.consequence : ''}
                          </span>
                        </span>
                      </div>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
                        <span
                          style={{
                            margin: 0,
                            fontSize: 12,
                          }}
                        >
                          <span style={{ fontWeight: 500 }}>Tình trạng sau sửa chữa: </span>
                          <span style={{ margin: 0, fontSize: 12 }}>
                            {vietNamTranslateState(item.asset_status_after_repair)}
                          </span>
                        </span>
                      </div>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
                        <span
                          style={{
                            margin: 0,
                            fontSize: 12,
                          }}
                        >
                          <span style={{ fontWeight: 500 }}>Sẵn sàng sử dụng: </span>
                          <span style={{ margin: 0, fontSize: 12 }}>
                            <img
                              alt=""
                              style={{ height: 14 }}
                              src={item.ready_to_use ? Check : Cross}
                            />
                          </span>
                        </span>
                      </div>
                    </List.Item>
                  )}
                />
              </div>
            </div>
            <div>
              {assetRepairData?.state === 'process' && isHandover && (
                <Button
                  onClick={() => handleConfirm('set_to_done')}
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
                  Đánh dấu hoàn thành
                </Button>
              )}
            </div>
            <div>
              {assetRepairData?.state === 'process' && isHandover ? (
                !assetRepairData.shipper_already_confirm ? (
                  <Button
                    onClick={() => handleConfirm('action_shipper_confirm')}
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
                    Bên giao xác nhận
                  </Button>
                ) : assetRepairData.shipper_already_confirm ? (
                  <Button
                    onClick={() => handleConfirm('action_shipper_unconfirm')}
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
                    Bên giao hủy bỏ xác nhận
                  </Button>
                ) : (
                  <></>
                )
              ) : (
                <></>
              )}
              {assetRepairData?.state === 'process' && isReceiver ? (
                !assetRepairData.receiver_already_confirm ? (
                  <Button
                    onClick={() => handleConfirm('action_receiver_confirm')}
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
                    Bên nhận xác nhận
                  </Button>
                ) : assetRepairData.receiver_already_confirm ? (
                  <Button
                    onClick={() => handleConfirm('action_receiver_unconfirm')}
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
                    Bên nhận hủy bỏ xác nhận
                  </Button>
                ) : (
                  <></>
                )
              ) : (
                <></>
              )}
              {assetRepairData?.state === 'process' && isAssetManagement ? (
                !assetRepairData.asset_management_already_confirm ? (
                  <Button
                    onClick={() => handleConfirm('action_asset_management_confirm')}
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
                    Bên QLTS xác nhận
                  </Button>
                ) : assetRepairData.asset_management_already_confirm ? (
                  <Button
                    onClick={() => handleConfirm('action_asset_management_unconfirm')}
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
                    Bên QLTS hủy bỏ xác nhận
                  </Button>
                ) : (
                  <></>
                )
              ) : (
                <></>
              )}
              {assetRepairData?.state === 'process' && isRelatedParty ? (
                !assetRepairData.related_party_already_confirm ? (
                  <Button
                    onClick={() => handleConfirm('action_related_party_confirm')}
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
                    Bên liên quan xác nhận
                  </Button>
                ) : assetRepairData.related_party_already_confirm ? (
                  <Button
                    onClick={() => handleConfirm('action_related_party_unconfirm')}
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
                    Bên liên quan hủy bỏ xác nhận
                  </Button>
                ) : (
                  <></>
                )
              ) : (
                <></>
              )}
            </div>
          </>
        )}
      </div>
      {isModalLocationOpen && (
        <Modal
          title="Tọa độ xác nhận bàn giao"
          closable={{ 'aria-label': 'Custom Close Button' }}
          open={isModalLocationOpen}
          onOk={() => setIsModalLocationOpen(false)}
          onCancel={() => setIsModalLocationOpen(false)}
          footer={null}
        >
          {[
            assetRepairData?.shipper_confirm_latitude,
            assetRepairData?.receiver_confirm_latitude,
            assetRepairData?.shipper_confirm_longitude,
            assetRepairData?.receiver_confirm_longitude,
          ].some((value) => value !== null && value !== 0) && (
            <div style={{ paddingTop: 10 }}>
              <MapContainer
                center={[
                  assetRepairData?.shipper_confirm_latitude ||
                    assetRepairData?.receiver_confirm_latitude ||
                    0,
                  assetRepairData?.shipper_confirm_longitude ||
                    assetRepairData?.receiver_confirm_longitude ||
                    0,
                ]}
                zoom={17}
              >
                <TileLayer
                  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                {[
                  assetRepairData?.receiver_confirm_latitude,
                  assetRepairData?.receiver_confirm_longitude,
                ].some((value) => value !== null && value !== 0) && (
                  <Marker
                    position={
                      [
                        assetRepairData?.receiver_confirm_latitude,
                        assetRepairData?.receiver_confirm_longitude,
                      ] as [number, number]
                    }
                    icon={customIcon2}
                  ></Marker>
                )}
                {[
                  assetRepairData?.shipper_confirm_latitude,
                  assetRepairData?.shipper_confirm_longitude,
                ].some((value) => value !== null && value !== 0) && (
                  <Marker
                    position={
                      [
                        assetRepairData?.shipper_confirm_latitude,
                        assetRepairData?.shipper_confirm_longitude,
                      ] as [number, number]
                    }
                    icon={customIcon}
                  ></Marker>
                )}
              </MapContainer>
              {[
                assetRepairData?.shipper_confirm_latitude,
                assetRepairData?.shipper_confirm_longitude,
              ].some((value) => value !== null && value !== 0) && (
                <div style={{ marginTop: 10 }}>
                  <img
                    src="https://res.cloudinary.com/dhrpdnd8m/image/upload/v1770952209/jkkiry22nnwvayq0yvpb.png"
                    height={12}
                    style={{ marginRight: 5 }}
                  />{' '}
                  Vị trí bên giao ({assetRepairData?.shipper_confirm_latitude},{' '}
                  {assetRepairData?.shipper_confirm_longitude})
                </div>
              )}
              {[
                assetRepairData?.receiver_confirm_latitude,
                assetRepairData?.receiver_confirm_longitude,
              ].some((value) => value !== null && value !== 0) && (
                <div style={{ marginTop: 10 }}>
                  <img
                    src="https://res.cloudinary.com/dhrpdnd8m/image/upload/v1770952771/r005a3u2daradwhyoywj.png"
                    height={12}
                    style={{ marginRight: 5 }}
                  />{' '}
                  Vị trí bên nhận ({assetRepairData?.receiver_confirm_latitude},{' '}
                  {assetRepairData?.receiver_confirm_longitude})
                </div>
              )}
            </div>
          )}
        </Modal>
      )}
      {isModalAssetRepairLineOpen && (
        <AssetRepairLineDetail
          isModalAssetRepairLineOpen={isModalAssetRepairLineOpen}
          setIsModalAssetRepairLineOpen={setIsModalAssetRepairLineOpen}
          handleGetAssetRepairLines={handleGetAssetRepairLines}
          canEdit={
            assetRepairData?.state === 'process' &&
            isReceiver &&
            !assetRepairData.receiver_already_confirm
          }
        />
      )}
    </div>
  );
};

export default AssetRepairtDetail;
