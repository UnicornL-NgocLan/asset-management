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