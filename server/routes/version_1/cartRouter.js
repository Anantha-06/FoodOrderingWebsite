import express from "express";
import { addQuantity, addToCart, deleteCart, deleteCartItem, getCart } from "../../controllers/cartController.js";
import { authMiddleware } from "../../middileware/authmiddileware.js";
const router = express.Router();

router.post("/item",authMiddleware,addToCart)
router.delete("/remove/:foodId",authMiddleware,deleteCartItem)
router.put("/itemupdate",authMiddleware,addQuantity)
router.get("/all",authMiddleware,getCart)
router.delete("/delete_cart/:cartId",authMiddleware,deleteCart)
export const cartRouter = router;
