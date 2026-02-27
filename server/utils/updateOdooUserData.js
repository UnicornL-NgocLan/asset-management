export async function hangeChangeUserCompany(odoo, companyId, uid) {
  return new Promise((resolve, reject) => {
    const inParams = [];
    inParams.push([uid]);
    inParams.push({ company_id: parseInt(companyId) });
    const params = [];
    params.push(inParams);
    odoo.execute_kw("res.users", "write", params, function (err, user) {
      if (err) {
        reject(err);
      } else {
        resolve(user);
      }
    });
  });
}

export async function updateInventoryLine(odoo, data, uid) {
  return new Promise((resolve, reject) => {
    const inParams = [];
    inParams.push([parseInt(uid)]);
    inParams.push(data);
    const params = [];
    params.push(inParams);
    odoo.execute_kw("asset.inventory.line", "write", params, function (err, user) {
      if (err) {
        reject(err);
      } else {
        resolve(user);
      }
    });
  });
}

export async function transferConfirmRelatedFunction(odoo, uid, functionName) {
  return new Promise((resolve, reject) => {
    let params = [];
    params.push([parseInt(uid)]);
    odoo.execute_kw("asset.transfer", functionName, params, function (err, user) {
      if (err) {
        reject(err);
      } else {
        resolve(user);
      }
    });
  });
}

export async function updateTransferById(odoo, id, data) {
  return new Promise((resolve, reject) => {
    const inParams = [];
    inParams.push([parseInt(id)]);
    inParams.push(data);
    const params = [];
    params.push(inParams);
    odoo.execute_kw("asset.transfer", "write", params, (err, audits) => {
      if (err) {
        reject(err);
      } else {
        resolve(audits);
      }
    });
  });
}

export async function updateTransferLineById(odoo, id, data) {
  return new Promise((resolve, reject) => {
    const inParams = [];
    inParams.push([parseInt(id)]);
    inParams.push(data);
    const params = [];
    params.push(inParams);
    odoo.execute_kw("asset.transfer.line", "write", params, (err, audits) => {
      if (err) {
        reject(err);
      } else {
        resolve(audits);
      }
    });
  });
}

export async function purchaseHandoverConfirmRelatedFunction(odoo, uid, functionName) {
  return new Promise((resolve, reject) => {
    let params = [];
    params.push([parseInt(uid)]);
    odoo.execute_kw("asset.purchase.handover", functionName, params, function (err, user) {
      if (err) {
        reject(err);
      } else {
        resolve(user);
      }
    });
  });
}

export async function updatePurchaseHandoverLineById(odoo, id, data) {
  return new Promise((resolve, reject) => {
    const inParams = [];
    inParams.push([parseInt(id)]);
    inParams.push(data);
    const params = [];
    params.push(inParams);
    odoo.execute_kw("asset.purchase.handover.line", "write", params, (err, audits) => {
      if (err) {
        reject(err);
      } else {
        resolve(audits);
      }
    });
  });
}

export async function updatePurchaseHandoverById(odoo, id, data) {
  return new Promise((resolve, reject) => {
    const inParams = [];
    inParams.push([parseInt(id)]);
    inParams.push(data);
    const params = [];
    params.push(inParams);
    odoo.execute_kw("asset.purchase.handover", "write", params, (err, audits) => {
      if (err) {
        reject(err);
      } else {
        resolve(audits);
      }
    });
  });
}

export async function assetRepairConfirmRelatedFunction(odoo, uid, functionName) {
  return new Promise((resolve, reject) => {
    let params = [];
    params.push([parseInt(uid)]);
    odoo.execute_kw("asset.repair", functionName, params, function (err, user) {
      if (err) {
        reject(err);
      } else {
        resolve(user);
      }
    });
  });
}

export async function updateAssetRepairLineById(odoo, id, data) {
  return new Promise((resolve, reject) => {
    const inParams = [];
    inParams.push([parseInt(id)]);
    inParams.push(data);
    const params = [];
    params.push(inParams);
    odoo.execute_kw("asset.repair.lines", "write", params, (err, audits) => {
      if (err) {
        reject(err);
      } else {
        resolve(audits);
      }
    });
  });
}

export async function updateAssetRepairById(odoo, id, data) {
  return new Promise((resolve, reject) => {
    const inParams = [];
    inParams.push([parseInt(id)]);
    inParams.push(data);
    const params = [];
    params.push(inParams);
    odoo.execute_kw("asset.repair", "write", params, (err, audits) => {
      if (err) {
        reject(err);
      } else {
        resolve(audits);
      }
    });
  });
}
