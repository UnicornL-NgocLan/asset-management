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