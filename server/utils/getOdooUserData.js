export async function getUserData(odoo, uid) {
    return new Promise((resolve, reject) => {
      const params = [[['id', '=', uid]], ['id', 'name', 'company_ids', 'company_id', 'email']];
      odoo.execute_kw('res.users', 'search_read', [params], (err, user) => {
        if (err) {
          reject(err);
        } else {
          resolve(user);
        }
      });
    });
  }
  
export async function getUserCompanies(odoo, user) {
    return new Promise((resolve, reject) => {
        const inParams = [];
        inParams.push([["id", "in", user[0].company_ids]]); 
        inParams.push(["id", "name", "short_name"]); 
        inParams.push(0); 
        const params = [];
        params.push(inParams);
        odoo.execute_kw("res.company", 'search_read', params, (err, companies) => {
            if (err) {
            reject(err);
            } else {
            resolve(companies);
            }
        });
    });
}

export async function getAssetWithSearch(odoo, user,text,includeNameAndCode,id) {
  return new Promise((resolve, reject) => {
      const inParams = [];
      if(!id && includeNameAndCode){
        inParams.push([["company_id", "=", user[0].company_id[0]],'|',["code","like",`${text}%`],["name","like",`${text}%`]]); 
      }else if(id) {
        inParams.push([["id", "=", id]]); 
      } else {
        inParams.push([["company_id", "=", user[0].company_id[0]],["code","=",text]]); 
      }
      inParams.push([
        "id", "name", "code","asset_type","category_id","value",
        "company_id","state","acceptance_date","acceptance_number",
        "description", "quantity","alt_unit", "management_dept","asset_user","handover_party", "asset_user_temporary","related_handover_party",
        "receiver_handover_party", "asset_management_dept_staff", "asset_status_start", 
        "latest_inventory_status", "dept_owner", "sea_office_id", "vendor_name", "company_using","repair_date",
        "related_handover_party","note","procurement_staff","latest_asset_transfer_date","asset_receive_date","liquidation_date"
      ]); 
      inParams.push(0); 
      const params = [];
      params.push(inParams);
      odoo.execute_kw("account.asset.asset", 'search_read', params, (err, assets) => {
          if (err) {
          reject(err);
          } else {
          resolve(assets);
          }
      });
  });
}

export async function getAssetTransferLines(odoo,id) {
  return new Promise((resolve, reject) => {
      const inParams = [];
      inParams.push([["asset_id","=",parseInt(id)]]); 
      inParams.push([
        "id","quantity_demanding","quantity_done","asset_status_transfer","state", "dest_department","asset_management_dept_staff",
        "note","source_location_id","dest_company","dest_department_temporary","dest_location_id","validate_date"
      ]); 
      inParams.push(0); 
      const params = [];
      params.push(inParams);
      odoo.execute_kw("asset.transfer.line", 'search_read', params, (err, assets) => {
          if (err) {
          reject(err);
          } else {
          resolve(assets);
          }
      });
  });
}

export async function getAssetInventoryLines(odoo,id) {
  return new Promise((resolve, reject) => {
      const inParams = [];
      inParams.push([["asset_id","=",parseInt(id)]]); 
      inParams.push([
        "id","quantity_so_sach","quantity_thuc_te","asset_inventory_id","status","da_dan_tem","asset_user_temporary","validated_date","note","de_xuat_xu_ly","giai_trinh","latest_inventory_status"
      ]); 
      inParams.push(0); 
      const params = [];
      params.push(inParams);
      odoo.execute_kw("asset.inventory.line", 'search_read', params, (err, assets) => {
          if (err) {
          reject(err);
          } else {
          resolve(assets);
          }
      });
  });
}

export async function getAssetAdjustmentLines(odoo,id) {
  return new Promise((resolve, reject) => {
      const inParams = [];
      inParams.push([["asset_id","=",parseInt(id)]]); 
      inParams.push([
        "id","adjustment_code","increase_quantity","date_adjustment","description","document_ref","vendor_name"
      ]); 
      inParams.push(0); 
      const params = [];
      params.push(inParams);
      odoo.execute_kw("account.asset.adjustment", 'search_read', params, (err, assets) => {
          if (err) {
          reject(err);
          } else {
          resolve(assets);
          }
      });
  });
}

export async function getAssetRepair(odoo,id) {
  return new Promise((resolve, reject) => {
      const inParams = [];
      inParams.push([["asset_id","=",parseInt(id)]]); 
      inParams.push([
        "id","repair_date_start","repair_date_end","repair_party","accident_place","description","quantity"
      ]); 
      inParams.push(0); 
      const params = [];
      params.push(inParams);
      odoo.execute_kw("asset.repair.lines", 'search_read', params, (err, assets) => {
          if (err) {
          reject(err);
          } else {
          resolve(assets);
          }
      });
  });
}

export async function getAuditList (odoo, user) {
  return new Promise((resolve, reject) => {
    const inParams = [];
    inParams.push([["company_id", "=", user[0].company_id[0]]]); 
    inParams.push(["id", "name", "state","start_time","end_time","create_uid","create_date","note","sea_office_id"]); 
    inParams.push(0);
    const params = [];
    params.push(inParams);
    odoo.execute_kw("asset.inventory", 'search_read', params, (err, audits) => {
        if (err) {
        reject(err);
        } else {
        resolve(audits);
        }
    });
  });
}

export async function getAudit (odoo, user,id) {
  return new Promise((resolve, reject) => {
    const inParams = [];
    inParams.push([["company_id", "=", user[0].company_id[0]],["id","=",id]]); 
    inParams.push([
      "id", "name", "state","start_time","end_time","create_uid","create_date","department",
      "inventoried_department","sea_office_id",
      "liquidation_state","pending_state","process_state","draft_state", "company_id", "note"
    ]); 
    inParams.push(0);
    const params = [];
    params.push(inParams);
    odoo.execute_kw("asset.inventory", 'search_read', params, (err, audit) => {
        if (err) {
        reject(err);
        } else {
        resolve(audit);
        }
    });
  });
}

export async function getOffices (odoo) {
  return new Promise((resolve, reject) => {
    const inParams = [];
    inParams.push([]); 
    inParams.push([
      "id", "name"
    ]); 
    inParams.push(0);
    const params = [];
    params.push(inParams);
    odoo.execute_kw("sea.office", 'search_read', params, (err, offices) => {
        if (err) {
        reject(err);
        } else {
        resolve(offices);
        }
    });
  });
}

export async function getDepartments (odoo, user) {
  return new Promise((resolve, reject) => {
    const inParams = [];
    inParams.push([["company_id", "=", user[0].company_id[0]]]); 
    inParams.push(["id", "name"]); 
    inParams.push(0);
    const params = [];
    params.push(inParams);
    odoo.execute_kw("hr.department", 'search_read', params, (err, data) => {
        if (err) {
        reject(err);
        } else {
        resolve(data);
        }
    });
  });
}

export async function getAssetInventoryCommitee (odoo, auditId) {
  return new Promise((resolve, reject) => {
    const inParams = [];
    inParams.push([["asset_inventory_id","=",parseInt(auditId)]]); 
    inParams.push(["id", "employee_id_temp","position"]); 
    inParams.push(0);
    const params = [];
    params.push(inParams);
    odoo.execute_kw("asset.inventory.committee", 'search_read', params, (err, data) => {
        if (err) {
        reject(err);
        } else {
        resolve(data);
        }
    });
  });
}

export async function getAssetInventoriedDept (odoo, auditId) {
  return new Promise((resolve, reject) => {
    const inParams = [];
    inParams.push([["asset_inventory_id","=",parseInt(auditId)]]); 
    inParams.push(["id", "employee_id_temp","department"]); 
    inParams.push(0);
    const params = [];
    params.push(inParams);
    odoo.execute_kw("asset.inventoried.department", 'search_read', params, (err, data) => {
        if (err) {
        reject(err);
        } else {
        resolve(data);
        }
    });
  });
}

export async function getAssetInventory (odoo, auditId) {
  return new Promise((resolve, reject) => {
    const inParams = [];
    inParams.push([["asset_inventory_id","=",parseInt(auditId)]]); 
    inParams.push(["id","asset_id","quantity_so_sach","quantity_thuc_te","status","is_done"]); 
    inParams.push(0);
    const params = [];
    params.push(inParams);
    odoo.execute_kw("asset.inventory.line", 'search_read', params, (err, data) => {
        if (err) {
        reject(err);
        } else {
        resolve(data);
        }
    });
  });
}


export async function getAssetInventoryLine(odoo,id) {
  return new Promise((resolve, reject) => {
      const inParams = [];
      inParams.push([["id","=",id]]); 
      inParams.push([
        "id","asset_id","quantity_so_sach","quantity_thuc_te","asset_inventory_id","status","da_dan_tem","asset_user_temporary","validated_date","note","de_xuat_xu_ly","giai_trinh","latest_inventory_status","is_done"
      ]); 
      inParams.push(0); 
      const params = [];
      params.push(inParams);
      odoo.execute_kw("asset.inventory.line", 'search_read', params, (err, assets) => {
          if (err) {
          reject(err);
          } else {
          resolve(assets);
          }
      });
  });
}

export async function getEmployeeTemporary(odoo) {
  return new Promise((resolve, reject) => {
      const inParams = [];
      inParams.push([]); 
      inParams.push([
        "id","name"
      ]); 
      inParams.push(0); 
      const params = [];
      params.push(inParams);
      odoo.execute_kw("hr.employee.temporary", 'search_read', params, (err, assets) => {
          if (err) {
          reject(err);
          } else {
          resolve(assets);
          }
      });
  });
}
