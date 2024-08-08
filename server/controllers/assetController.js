import {getAssetWithSearch,getAssetTransferLines} from "../utils/getOdooUserData.js"

export const assetCtrl = {
    searchAsset: async (req,res) => {
        try {
            const {text,isCodeAndName,id} = req.body;
            const data = await getAssetWithSearch(req.odoo, req.user,text,isCodeAndName,id);
            res.status(200).json({data})
        } catch (error) {
            console.log(error);
            res.status(500).json({ msg: error.message });
        }
    },

    getAssetTransferLines: async (req,res) => {
        try {
            const {id} = req.body;
            const data = await getAssetTransferLines(req.odoo,id);
            res.status(200).json({data})
        } catch (error) {
            console.log(error);
            res.status(500).json({ msg: error.message });
        }
    },
}