import { getEmployeeMultiCompany, getHrEmployeeTemporary, getUserIdsOfHrEmployee } from "../utils/getOdooUserData.js";
import { getTransferById, getTransferLineList, getTransferList } from "../utils/getTransferData.js";
import { transferConfirmRelatedFunction, updateTransferLineById, updateTransferById } from "../utils/updateOdooUserData.js";

export const transferCtrl = {
  getAssetTransfers: async (req, res) => {
    try {
      const data = await getTransferList(req.odoo);
      res.status(200).json({ data });
    } catch (error) {
      console.log(error);
      res.status(500).json({ msg: error.message });
    }
  },
  getTransferById: async (req, res) => {
    try {
      const { id } = req.params;
      const data = await getTransferById(req.odoo, parseInt(id));
      res.status(200).json({ data });
    } catch (error) {
      console.log(error);
      res.status(500).json({ msg: error.message });
    }
  },
  getTransferLine: async (req, res) => {
    try {
      const { id } = req.params;
      const data = await getTransferLineList(req.odoo, parseInt(id));
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

  updateTransferLineById: async (req, res) => {
    try {
      const { id } = req.params;
      const updateData = req.body;
      const data = await updateTransferLineById(req.odoo, parseInt(id), updateData);
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

      if (functionName === "action_handover_confirm") {
        await updateTransferById(req.odoo, parseInt(uid), { handover_confirm_latitude: lat, handover_confirm_longitude: lng });
      }

      if (functionName === "action_receiver_confirm") {
        await updateTransferById(req.odoo, parseInt(uid), { receiver_confirm_latitude: lat, receiver_confirm_longitude: lng });
      }

      if (functionName === "action_handover_unconfirm") {
        await updateTransferById(req.odoo, parseInt(uid), { handover_confirm_latitude: null, handover_confirm_longitude: null });
      }
      if (functionName === "action_receiver_unconfirm") {
        await updateTransferById(req.odoo, parseInt(uid), { receiver_confirm_latitude: null, receiver_confirm_longitude: null });
      }
      const data = await transferConfirmRelatedFunction(req.odoo, parseInt(uid), functionName);
      res.status(200).json({ data });
    } catch (error) {
      console.log(error);
      res.status(500).json({ msg: error.message });
    }
  },
};
