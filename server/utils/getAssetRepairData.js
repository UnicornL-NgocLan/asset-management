export async function getAssetRepairList(odoo) {
  return new Promise((resolve, reject) => {
    const inParams = [];
    inParams.push([]);
    inParams.push(["id", "handover_party_id", "receive_party_id", "state", "name"]);
    inParams.push(0);
    const params = [];
    params.push(inParams);
    odoo.execute_kw("asset.repair", "search_read", params, (err, audits) => {
      if (err) {
        reject(err);
      } else {
        resolve(audits);
      }
    });
  });
}

export async function getAssetRepairById(odoo, id) {
  return new Promise((resolve, reject) => {
    const inParams = [];
    inParams.push([["id", "=", id]]);
    inParams.push([
      "id",
      "handover_party_id",
      "receive_party_id",
      "asset_management_party_id",
      "related_party_id",
      "state",
      "name",
      "company_id",
      "reason",
      "note",
      "assset_request_assessment_id",
      "proposal_id",
      "shipper_already_confirm",
      "receiver_already_confirm",
      "asset_management_already_confirm",
      "related_party_already_confirm",
      "shipper_confirm_latitude",
      "shipper_confirm_longitude",
      "receiver_confirm_latitude",
      "receiver_confirm_longitude",
    ]);
    inParams.push(0);
    const params = [];
    params.push(inParams);
    odoo.execute_kw("asset.repair", "search_read", params, (err, audits) => {
      if (err) {
        reject(err);
      } else {
        resolve(audits);
      }
    });
  });
}

export async function getAssetRepairLineList(odoo, id) {
  return new Promise((resolve, reject) => {
    const inParams = [];
    inParams.push([["asset_repair_id", "=", id]]);
    inParams.push([
      "id",
      "asset_repair_id",
      "asset_id",
      "repair_date_start",
      "repair_date_end",
      "repair_party",
      "accident_place",
      "incident_report_id",
      "demanding_quantity",
      "quantity",
      "consequence",
      "asset_status_after_repair",
      "reason_of_incident",
      "ready_to_use",
      "solution_proposal",
    ]);
    inParams.push(0);
    const params = [];
    params.push(inParams);
    odoo.execute_kw("asset.repair.lines", "search_read", params, (err, audits) => {
      if (err) {
        reject(err);
      } else {
        resolve(audits);
      }
    });
  });
}
