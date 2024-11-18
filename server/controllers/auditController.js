import {
    getAuditList,
    getAudit,
    getOffices,
    getDepartments,
    getAssetInventoryCommitee,
    getAssetInventoriedDept,
    getAssetInventory,
    getAssetInventoryLine
} from "../utils/getOdooUserData.js"


export const auditCtrl = {
    getAuditList: async (req,res) => {
        try {
            const data = await getAuditList(req.odoo, req.user);
            res.status(200).json({data})
        } catch (error) {
            res.status(500).json({msg:error.message})
        }
    },

    getAudit: async (req,res) => {
        try {
            const {id} = req.params;
            const data = await getAudit(req.odoo, req.user,id);
            res.status(200).json({data})
        } catch (error) {
            res.status(500).json({msg:error.message})
        }
    },

    getOffices: async (req,res) => {
        try {
            const data = await getOffices(req.odoo);
            res.status(200).json({data})
        } catch (error) {
            res.status(500).json({msg:error.message})
        }
    },

    getDepartments: async (req,res) => {
        try {
            const data = await getDepartments(req.odoo, req.user);
            res.status(200).json({data})
        } catch (error) {
            res.status(500).json({msg:error.message})
        }
    },

    getAssetInventoryCommitee: async (req,res) => {
        try {
            const {id} = req.params;
            const data = await getAssetInventoryCommitee(req.odoo,id);
            res.status(200).json({data})
        } catch (error) {
            res.status(500).json({msg:error.message})
        }
    },

    getAssetInventoriedDept: async (req,res) => {
        try {
            const {id} = req.params;
            const data = await getAssetInventoriedDept(req.odoo,id);
            res.status(200).json({data})
        } catch (error) {
            res.status(500).json({msg:error.message})
        }
    },

    getAssetInventory: async (req,res) => {
        try {
            const {id} = req.params;
            const data = await getAssetInventory(req.odoo,id);
            res.status(200).json({data})
        } catch (error) {
            res.status(500).json({msg:error.message})
        }
    },

    getAssetInventoryLine: async (req,res) => {
        try {
            const {id} = req.params;
            const data = await getAssetInventoryLine(req.odoo,id);
            res.status(200).json({data})
        } catch (error) {
            res.status(500).json({msg:error.message})
        }
    }
}