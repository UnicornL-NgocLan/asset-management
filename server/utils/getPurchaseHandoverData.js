export async function getPHList(odoo) {
  return new Promise((resolve, reject) => {
    const inParams = [];
    inParams.push([]);
    inParams.push(["id", "handover_party_id", "receive_party_id", "state", "name"]);
    inParams.push(0);
    const params = [];
    params.push(inParams);
    odoo.execute_kw("asset.purchase.handover", "search_read", params, (err, audits) => {
      if (err) {
        reject(err);
      } else {
        resolve(audits);
      }
    });
  });
}

export async function getPHById(odoo, id) {
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
      "handover_reason",
      "assset_request_assessment_id",
      "sign_document_id",
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
    odoo.execute_kw("asset.purchase.handover", "search_read", params, (err, audits) => {
      if (err) {
        reject(err);
      } else {
        resolve(audits);
      }
    });
  });
}

export async function getPHLineList(odoo, id) {
  return new Promise((resolve, reject) => {
    const inParams = [];
    inParams.push([["handover_id", "=", id]]);
    inParams.push([
      "id",
      "handover_id",
      "name",
      "demanding_quantity",
      "quantity",
      "uom_invoice_id",
      "status",
      "supplier_name",
      "ready_for_use",
      "value",
    ]);
    inParams.push(0);
    const params = [];
    params.push(inParams);
    odoo.execute_kw("asset.purchase.handover.line", "search_read", params, (err, audits) => {
      if (err) {
        reject(err);
      } else {
        resolve(audits);
      }
    });
  });
}
