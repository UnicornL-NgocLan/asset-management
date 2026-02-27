export interface ICompany {
  id: number;
  name: string;
  short_name: string;
}

export interface IAuditItemInList {
  id: number;
  name: string;
  state: string;
  start_time: string;
  end_time: string;
  create_uid: any[];
  create_date: string;
  note: string;
  sea_office_id: any[];
  company_id: any[];
}

export interface IAssetTypeInterface {
  id: number;
  name: String;
}

export interface IAudit extends IAuditItemInList {
  asset_inventory_lines: any[];
  draft_state: boolean;
  inventoried_department: any[];
  liquidation_state: boolean;
  member_of_inventory: any[];
  pending_state: boolean;
  process_state: any[];
  sea_office_id: any[];
  company_id: any[];
  department: number[];
  asset_type_ids: number[];
}

export interface ICommitee {
  id: number;
  employee_id_temp: boolean | [];
  position: boolean | [];
  asset_inventory_id: number;
  confirm_completed: boolean;
  assigned_verify: boolean;
}

export interface IAssetInventoriedDept {
  id: number;
  employee_id_temp: any;
  department: boolean | [];
  confirm_completed: boolean;
  assigned_verify: boolean;
}

export interface IAssetInventory {
  id: number;
  asset_id: boolean | any[];
  quantity_so_sach: number;
  quantity_thuc_te: number;
  status: string;
  is_done: boolean;
  asset_using_company_id: any[];
  asset_company_id: any[];
}

export interface IAssetInventoryAssetTemporary {
  id: number;
  code: string;
  name: string;
  description: string;
  quantity_thuc_te: number;
  is_done: boolean;
}

export interface IAssetTransfer {
  id: number;
  name: string;
  receiver_employee_id: any[];
  handover_employee_id: any[];
  receiver_employee: string;
  handover_employee: string;
  state: string;
}

export interface IAssetTransferDetail {
  id: number;
  handover_employee_id: any[];
  receiver_employee_id: any[];
  asset_management_party_id: any[] | null;
  related_party_id: any[] | null;
  state: string;
  name: string;
  owner_company_id: any[];
  transfer_reason: string;
  sign_document_id: any[] | null;
  source_location_id: any[];
  source_department_temporary_id: any[] | null;
  source_company_id: any[];
  dest_location_id: any[];
  dest_department_temporary: any[] | null;
  dest_company_id: any[];
  handover_already_confirm: boolean;
  receiver_already_confirm: boolean;
  asset_management_already_confirm: boolean;
  related_party_already_confirm: boolean;
  handover_confirm_latitude: number;
  handover_confirm_longitude: number;
  receiver_confirm_latitude: number;
  receiver_confirm_longitude: number;
  asset_request_assessment_id: any[] | null;
}

export interface IAssetTransferLine {
  id: number;
  asset_transfer_id: number;
  asset_id: any[];
  quantity_demanding: number;
  quantity_done: number;
  asset_status_transfer: string;
  source_asset_user_temporary: any[] | null;
  dest_department_temporary: any[] | null;
  dest_asset_user_temporary: any[] | null;
  ready_for_use: boolean;
}

export interface IPurchaseHandover {
  id: number;
  handover_party_id: any[];
  receive_party_id: any[];
  state: string;
  name: string;
  handover_employee: string;
  receiver_employee: string;
}

export interface IPurchaseHandoverDetail {
  id: number;
  handover_party_id: any[];
  receive_party_id: any[];
  asset_management_party_id: any[] | null;
  related_party_id: any[] | null;
  state: string;
  name: string;
  company_id: any[];
  handover_reason: string;
  assset_request_assessment_id: any[] | null;
  sign_document_id: any[] | null;
  shipper_already_confirm: boolean;
  receiver_already_confirm: boolean;
  asset_management_already_confirm: boolean;
  related_party_already_confirm: boolean;
  shipper_confirm_latitude: number;
  shipper_confirm_longitude: number;
  receiver_confirm_latitude: number;
  receiver_confirm_longitude: number;
}

export interface IPurchaseHandoverLine {
  id: number;
  handover_id: number;
  name: string;
  demanding_quantity: number;
  quantity: number;
  uom_invoice_id: any[];
  status: string;
  supplier_name: string;
  ready_for_use: boolean;
  value: number;
}

export interface IAssetRepair {
  id: number;
  handover_party_id: any[];
  receive_party_id: any[];
  state: string;
  name: string;
  handover_employee: string;
  receiver_employee: string;
}

export interface IAssetRepairDetail {
  id: number;
  handover_party_id: any[];
  receive_party_id: any[];
  asset_management_party_id: any[] | null;
  related_party_id: any[] | null;
  state: string;
  name: string;
  company_id: any[];
  reason: string;
  note: string;
  assset_request_assessment_id: any[] | null;
  proposal_id: any[] | null;
  shipper_already_confirm: boolean;
  receiver_already_confirm: boolean;
  asset_management_already_confirm: boolean;
  related_party_already_confirm: boolean;
  shipper_confirm_latitude: number;
  shipper_confirm_longitude: number;
  receiver_confirm_latitude: number;
  receiver_confirm_longitude: number;
}

export interface IAssetRepairLine {
  id: number;
  asset_repair_id: number;
  asset_id: any[];
  repair_date_start: string;
  repair_date_end: string;
  repair_party: string;
  accident_place: string;
  incident_report_id: any[] | null;
  demanding_quantity: number;
  quantity: number;
  consequence: string;
  asset_status_after_repair: string;
  reason_of_incident: string;
  ready_to_use: boolean;
  solution_proposal: string;
}
