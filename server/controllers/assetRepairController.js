import { getEmployeeMultiCompany, getHrEmployeeTemporary, getUserIdsOfHrEmployee } from "../utils/getOdooUserData.js";
import { getAssetRepairList, getAssetRepairById, getAssetRepairLineList } from "../utils/getAssetRepairData.js";
import {
  assetRepairConfirmRelatedFunction,
  updatePurchaseHandoverById,
  updateAssetRepairLineById,
  updateAssetRepairById,
} from "../utils/updateOdooUserData.js";

export const assetRepairCtrl = {
  getAssetRepairList: async (req, res) => {
    try {
      const data = await getAssetRepairList(req.odoo);
      res.status(200).json({ data });
    } catch (error) {
      console.log(error);
      res.status(500).json({ msg: error.message });
    }
  },
  getAssetRepairById: async (req, res) => {
    try {
      const { id } = req.params;
      const data = await getAssetRepairById(req.odoo, parseInt(id));
      res.status(200).json({ data });
    } catch (error) {
      console.log(error);
      res.status(500).json({ msg: error.message });
    }
  },
  getAssetRepairLineList: async (req, res) => {
    try {
      const { id } = req.params;
      const data = await getAssetRepairLineList(req.odoo, parseInt(id));
      res.status(200).json({ data });
    } catch (error) {
      console.log(error);
      res.status(500).json({ msg: error.message });
    }
  },

  checkUserIdByHrTempId: async (req, res) => {
    try {
      const { hr_temp_id } = req.query;
      const myHrTemporary = await getHrEmployeeTemporary(req.odoo, [hr_temp_id]);
      const hrEmployeeMultiCompanyId = myHrTemporary.map((item) => item.employee_id?.[0]);
      const hrEmployeeMultiCompany = await getEmployeeMultiCompany(req.odooSeaGroup, hrEmployeeMultiCompanyId);
      const hrEmployeeId = hrEmployeeMultiCompany.map((item) => item.name[0]);
      const hrEmployeeContainingUserIdList = await getUserIdsOfHrEmployee(req.odooSeaGroup, hrEmployeeId);
      const asssigedUserId = hrEmployeeContainingUserIdList.map((item) => item.user_id?.[0]);
      const isCurrentUerAssignedUserId = asssigedUserId.includes(req.user[0].id);
      res.status(200).json({ asssigedUserId, isCurrentUerAssignedUserId });
    } catch (error) {
      res.status(500).json({ msg: error.message });
    }
  },

  updateAssetRepairtLineById: async (req, res) => {
    try {
      const { id } = req.params;
      const updateData = req.body;
      const data = await updateAssetRepairLineById(req.odoo, parseInt(id), updateData);
      res.status(200).json({ data });
    } catch (error) {
      console.log(error);
      res.status(500).json({ msg: error.message });
    }
  },

  callConfirmRelatedFunction: async (req, res) => {
    try {
      const { uid, functionName, lat, lng } = req.body;
      if (!functionName) {
        return res.status(400).json({ msg: "Không xác định kiểu hàm được gọi" });
      }
      if (functionName === "action_shipper_confirm") {
        await updateAssetRepairById(req.odoo, parseInt(uid), { shipper_confirm_latitude: lat, shipper_confirm_longitude: lng });
      }

      if (functionName === "action_receiver_confirm") {
        await updateAssetRepairById(req.odoo, parseInt(uid), { receiver_confirm_latitude: lat, receiver_confirm_longitude: lng });
      }

      if (functionName === "action_shipper_unconfirm") {
        await updateAssetRepairById(req.odoo, parseInt(uid), { handover_confirm_latitude: null, handover_confirm_longitude: null });
      }
      if (functionName === "action_receiver_unconfirm") {
        await updateAssetRepairById(req.odoo, parseInt(uid), { receiver_confirm_latitude: null, receiver_confirm_longitude: null });
      }
      const data = await assetRepairConfirmRelatedFunction(req.odoo, parseInt(uid), functionName);
      res.status(200).json({ data });
    } catch (error) {
      console.log(error);
      res.status(500).json({ msg: error.message });
    }
  },
};
