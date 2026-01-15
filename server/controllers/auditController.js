import {
  getAuditList,
  getAudit,
  getOffices,
  getDepartments,
  getAssetInventoryCommitee,
  getAssetInventoriedDept,
  getAssetInventory,
  getAssetInventoryLine,
  getEmployeeTemporary,
  getAssetTypes,
  getHrEmployeeTemporary,
  getEmployeeMultiCompany,
  getUserIdsOfHrEmployee,
  setUserConfirmAssetInventory,
  setUserUnConfirmAssetInventory,
  changeAssetInventoryFromProcessToVerifyState,
  changeAssetInventoryFromVerifyingToProcessState,
  getAssetInventoryAssetTemporartLines,
  getDetailAssetInventoryAssetTemporartLine,
  getUoms,
  getCompanies,
  createAssetTemporaryLine,
  updateAssetTemporaryLine,
  deleteAssetTemporaryLine,
  getAccountAssetImages,
} from "../utils/getOdooUserData.js";

import { updateInventoryLine } from "../utils/updateOdooUserData.js";

export const auditCtrl = {
  getAuditList: async (req, res) => {
    try {
      const data = await getAuditList(req.odoo, req.user);
      res.status(200).json({ data });
    } catch (error) {
      res.status(500).json({ msg: error.message });
    }
  },

  getAudit: async (req, res) => {
    try {
      const { id } = req.params;
      const data = await getAudit(req.odoo, req.user, id);
      res.status(200).json({ data });
    } catch (error) {
      res.status(500).json({ msg: error.message });
    }
  },

  getAssetTypes: async (req, res) => {
    try {
      const data = await getAssetTypes(req.odoo);
      res.status(200).json({ data });
    } catch (error) {
      res.status(500).json({ msg: error.message });
    }
  },

  getOffices: async (req, res) => {
    try {
      const data = await getOffices(req.odoo);
      res.status(200).json({ data });
    } catch (error) {
      res.status(500).json({ msg: error.message });
    }
  },

  getDepartments: async (req, res) => {
    try {
      const data = await getDepartments(req.odoo, req.user);
      res.status(200).json({ data });
    } catch (error) {
      res.status(500).json({ msg: error.message });
    }
  },

  getAssetInventoryCommitee: async (req, res) => {
    try {
      const { id } = req.params;
      const data = await getAssetInventoryCommitee(req.odoo, id);
      res.status(200).json({ data });
    } catch (error) {
      res.status(500).json({ msg: error.message });
    }
  },

  getAssetInventoriedDept: async (req, res) => {
    try {
      const { id } = req.params;
      const data = await getAssetInventoriedDept(req.odoo, id);
      res.status(200).json({ data });
    } catch (error) {
      res.status(500).json({ msg: error.message });
    }
  },

  getAssetInventory: async (req, res) => {
    try {
      const { id } = req.params;
      const data = await getAssetInventory(req.odoo, id);
      res.status(200).json({ data });
    } catch (error) {
      res.status(500).json({ msg: error.message });
    }
  },

  getAssetInventoryLine: async (req, res) => {
    try {
      const { id } = req.params;
      const data = await getAssetInventoryLine(req.odoo, id);
      res.status(200).json({ data });
    } catch (error) {
      res.status(500).json({ msg: error.message });
    }
  },

  getEmployeeTemporary: async (req, res) => {
    try {
      const data = await getEmployeeTemporary(req.odoo);
      res.status(200).json({ data });
    } catch (error) {
      res.status(500).json({ msg: error.message });
    }
  },

  updateInventoryLine: async (req, res) => {
    try {
      const { id } = req.params;
      const change = req.body;
      await updateInventoryLine(req.odoo, change, id);
      res.status(200).json({ msg: "Đã hoàn tất" });
    } catch (error) {
      res.status(500).json({ msg: error.message });
    }
  },

  checkIfCurrentUserIsAssignedToConfirm: async (req, res) => {
    try {
      const { asset_inventory_id } = req.query;
      const commitee = await getAssetInventoryCommitee(req.odoo, asset_inventory_id);
      const inventoriedDept = await getAssetInventoriedDept(req.odoo, asset_inventory_id);

      const listOfAssignedUsers = [...commitee, ...inventoriedDept].map((item) => item.employee_id_temp[0]);
      const listOfHrTemporary = await getHrEmployeeTemporary(req.odoo, listOfAssignedUsers);
      const listOfHrEmployeeMultiCompanyIds = listOfHrTemporary.map((item) => item.employee_id?.[0]);
      const listOfHrEmployee = await getEmployeeMultiCompany(req.odooSeaGroup, listOfHrEmployeeMultiCompanyIds);
      const listOfHrEmployeeIds = listOfHrEmployee.map((item) => item.name[0]);
      const hrEmployeeContainingUserIdList = await getUserIdsOfHrEmployee(req.odooSeaGroup, listOfHrEmployeeIds);
      const listOfAsssigedUserIds = hrEmployeeContainingUserIdList.map((item) => item.user_id?.[0]);
      const isCurrentUserAssigned = listOfAsssigedUserIds.includes(req.user[0].id);

      let assignedLineId = null;
      let currentTemporaryId = null;
      if (isCurrentUserAssigned) {
        const myHrEmployeeId = hrEmployeeContainingUserIdList.find((item) => item.user_id?.[0] === req.user[0].id);
        const myHrEmployeeMultiCompanyId = listOfHrEmployee.find((item) => item.name?.[0] === myHrEmployeeId?.id);
        const myHrEmployeeTemporary = listOfHrTemporary.find((item) => item.employee_id?.[0] === myHrEmployeeMultiCompanyId?.id);
        if (myHrEmployeeTemporary) {
          const myTemporaryId = myHrEmployeeTemporary.id;
          currentTemporaryId = myTemporaryId;
          assignedLineId =
            commitee.find((item) => item.employee_id_temp?.[0] === myTemporaryId)?.id ||
            inventoriedDept.find((item) => item.employee_id_temp?.[0] === myTemporaryId)?.id ||
            null;
        }
      }
      res.status(200).json({ isAssigned: isCurrentUserAssigned, assignedLineId, myTemporaryId: currentTemporaryId });
    } catch (error) {
      res.status(500).json({ msg: error.message });
    }
  },

  userConfirmInventory: async (req, res) => {
    try {
      const { id } = req.params;
      await setUserConfirmAssetInventory(req.odoo, id);
      res.status(200).json({ msg: "Đã hoàn tất" });
    } catch (error) {
      res.status(500).json({ msg: error.message });
    }
  },

  userUnConfirmInventory: async (req, res) => {
    try {
      const { id } = req.params;
      await setUserUnConfirmAssetInventory(req.odoo, id);
      res.status(200).json({ msg: "Đã hoàn tất" });
    } catch (error) {
      res.status(500).json({ msg: error.message });
    }
  },

  userSetToVerifyingState: async (req, res) => {
    try {
      const { id } = req.params;
      await changeAssetInventoryFromProcessToVerifyState(req.odoo, id);
      res.status(200).json({ msg: "Đã hoàn tất" });
    } catch (error) {
      res.status(500).json({ msg: error.message });
    }
  },

  userBackToProcessState: async (req, res) => {
    try {
      const { id } = req.params;
      await changeAssetInventoryFromVerifyingToProcessState(req.odoo, id);
      res.status(200).json({ msg: "Đã hoàn tất" });
    } catch (error) {
      res.status(500).json({ msg: error.message });
    }
  },

  getAssetInventoryAssetTemporaryLines: async (req, res) => {
    try {
      const { audit_id } = req.params;
      const data = await getAssetInventoryAssetTemporartLines(req.odoo, audit_id);
      res.status(200).json({ data });
    } catch (error) {
      res.status(500).json({ msg: error.message });
    }
  },

  getAssetInventoryAssetTemporaryLine: async (req, res) => {
    try {
      const { id } = req.params;
      const data = await getDetailAssetInventoryAssetTemporartLine(req.odoo, id);
      const images = await getAccountAssetImages(req.odoo, id);
      res.status(200).json({ data, images });
    } catch (error) {
      res.status(500).json({ msg: error.message });
    }
  },

  getUoms: async (req, res) => {
    try {
      const data = await getUoms(req.odoo);
      res.status(200).json({ data });
    } catch (error) {
      res.status(500).json({ msg: error.message });
    }
  },

  getCompanies: async (req, res) => {
    try {
      const data = await getCompanies(req.odoo);
      res.status(200).json({ data });
    } catch (error) {
      res.status(500).json({ msg: error.message });
    }
  },
  createAssetTemporaryLine: async (req, res) => {
    try {
      const data = await createAssetTemporaryLine(req.odoo, req.body);
      res.status(200).json({ data });
    } catch (error) {
      res.status(500).json({ msg: error.message });
    }
  },

  updateAssetTemporaryLine: async (req, res) => {
    try {
      const data = await updateAssetTemporaryLine(req.odoo, req.body, req.params.id);
      res.status(200).json({ data });
    } catch (error) {
      res.status(500).json({ msg: error.message });
    }
  },

  deleteAssetTemporaryLine: async (req, res) => {
    try {
      const data = await deleteAssetTemporaryLine(req.odoo, req.params.id);
      res.status(200).json({ data });
    } catch (error) {
      res.status(500).json({ msg: error.message });
    }
  },
};
