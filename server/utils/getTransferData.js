export async function getTransferList(odoo, user) {
  return new Promise((resolve, reject) => {
    const inParams = [];
    inParams.push([]);
    inParams.push(["id", "handover_employee_id", "receiver_employee_id", "state", "name"]);
    inParams.push(0);
    const params = [];
    params.push(inParams);
    odoo.execute_kw("asset.transfer", "search_read", params, (err, audits) => {
      if (err) {
        reject(err);
      } else {
        resolve(audits);
      }
    });
  });
}

export async function getTransferById(odoo, id) {
  return new Promise((resolve, reject) => {
    const inParams = [];
    inParams.push([["id", "=", id]]);
    inParams.push([
      "id",
      "handover_employee_id",
      "receiver_employee_id",
      "state",
      "name",
      "owner_company_id",
      "transfer_reason",
      "assset_request_assessment_id",
      "sign_document_id",
      "source_location_id",
      "source_department_temporary_id",
      "source_company_id",
      "dest_location_id",
      "dest_department_temporary",
      "dest_company_id",
      "handover_already_confirm",
      "receiver_already_confirm",
      "asset_management_already_confirm",
      "related_party_already_confirm",
      "handover_confirm_latitude",
      "handover_confirm_longitude",
      "receiver_confirm_latitude",
      "receiver_confirm_longitude",
      "sign_document_id",
      "asset_request_assessment_id",
      "related_party_id",
      "asset_management_party_id",
    ]);
    inParams.push(0);
    const params = [];
    params.push(inParams);
    odoo.execute_kw("asset.transfer", "search_read", params, (err, audits) => {
      if (err) {
        reject(err);
      } else {
        resolve(audits);
      }
    });
  });
}

export async function getTransferLineList(odoo, id) {
  return new Promise((resolve, reject) => {
    const inParams = [];
    inParams.push([["asset_transfer_id", "=", id]]);
    inParams.push([
      "id",
      "asset_transfer_id",
      "asset_id",
      "quantity_demanding",
      "quantity_done",
      "asset_status_transfer",
      "source_asset_user_temporary",
      "dest_department_temporary",
      "dest_asset_user_temporary",
      "dest_company",
      "ready_for_use",
    ]);
    inParams.push(0);
    const params = [];
    params.push(inParams);
    odoo.execute_kw("asset.transfer.line", "search_read", params, (err, audits) => {
      if (err) {
        reject(err);
      } else {
        resolve(audits);
      }
    });
  });
}
