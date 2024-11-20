export interface ICompany {
    id:number,
    name:string,
    short_name:string,
}

export interface IAuditItemInList {
    id:number,
    name:string,
    state:string,
    start_time:string,
    end_time:string,
    create_uid:any[],
    create_date:string,
    note:string,
    sea_office_id:any[],
}

export interface IAudit extends IAuditItemInList {
    asset_inventory_lines: any[],
    draft_state: boolean,
    inventoried_department: any[],
    liquidation_state: boolean,
    member_of_inventory: any[],
    pending_state:boolean,
    process_state:any[]
    sea_office_id:any[],
    company_id:any[],
    department: number[]
}

export interface ICommitee {
    id:number,
    employee_id_temp:boolean | [],
    position:boolean | [],
    asset_inventory_id:number,
}

export interface IAssetInventoriedDept {
    id:number,
    employee_id_temp:boolean | [],
    department:boolean | []
}

export interface IAssetInventory {
    id:number,
    asset_id:boolean | any[],
    quantity_so_sach: number,
    quantity_thuc_te: number,
    status: string,
    is_done:boolean
}