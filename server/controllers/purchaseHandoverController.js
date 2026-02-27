import { getEmployeeMultiCompany, getHrEmployeeTemporary, getUserIdsOfHrEmployee } from "../utils/getOdooUserData.js";
import { getPHById, getPHLineList, getPHList } from "../utils/getPurchaseHandoverData.js";
import { purchaseHandoverConfirmRelatedFunction, updatePurchaseHandoverLineById, updatePurchaseHandoverById } from "../utils/updateOdooUserData.js";

export const purchaseHandoverCtrl = {
  getPHList: async (req, res) => {
    try {
      const data = await getPHList(req.odoo);
      res.status(200).json({ data });
    } catch (error) {
      console.log(error);
      res.status(500).json({ msg: error.message });
    }
  },
  getPHById: async (req, res) => {
    try {
      const { id } = req.params;
      const data = await getPHById(req.odoo, parseInt(id));
      res.status(200).json({ data });
    } catch (error) {
      console.log(error);
      res.status(500).json({ msg: error.message });
    }
  },
  getPHLineList: async (req, res) => {
    try {
      const { id } = req.params;
      const data = await getPHLineList(req.odoo, parseInt(id));
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

  updatePurchaseHandoverLineById: async (req, res) => {
    try {
      const { id } = req.params;
      const updateData = req.body;
      const data = await updatePurchaseHandoverLineById(req.odoo, parseInt(id), updateData);
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
        await updatePurchaseHandoverById(req.odoo, parseInt(uid), { shipper_confirm_latitude: lat, shipper_confirm_longitude: lng });
      }

      if (functionName === "action_receiver_confirm") {
        await updatePurchaseHandoverById(req.odoo, parseInt(uid), { receiver_confirm_latitude: lat, receiver_confirm_longitude: lng });
      }

      if (functionName === "action_shipper_unconfirm") {
        await updatePurchaseHandoverById(req.odoo, parseInt(uid), { handover_confirm_latitude: null, handover_confirm_longitude: null });
      }
      if (functionName === "action_receiver_unconfirm") {
        await updatePurchaseHandoverById(req.odoo, parseInt(uid), { receiver_confirm_latitude: null, receiver_confirm_longitude: null });
      }
      const data = await purchaseHandoverConfirmRelatedFunction(req.odoo, parseInt(uid), functionName);
      res.status(200).json({ data });
    } catch (error) {
      console.log(error);
      res.status(500).json({ msg: error.message });
    }
  },
};
