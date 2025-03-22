import express from "express";
import { createAddress, deleteAddress, getAddress, updateAddress } from "../../controllers/addressController.js";
import {
    authMiddleware,
    roleMiddleware,
  } from "../../middileware/authmiddileware.js";


const router = express.Router();

router.post("/create",authMiddleware,createAddress)
router.delete("/delete/:addressId",authMiddleware,deleteAddress)
router.get("/get",authMiddleware,getAddress)
router.put("/update/new",authMiddleware,updateAddress)

export const addressRouter = router;
