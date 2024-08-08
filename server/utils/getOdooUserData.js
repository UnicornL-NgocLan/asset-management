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
        "description", "quantity","alt_unit", "management_dept","asset_user","handover_party",
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
      inParams.push([["asset_id","=",id]]); 
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
