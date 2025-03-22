import express from "express";
import { addMenuItem, deleteMenuItem, getAllMenu, getMenuByName, getMenuItemById, updateMenu } from "../../controllers/menuController.js";
import { upload } from "../../middileware/multermiddileware.js";
import { restaurantMiddleware } from "../../middileware/authmiddileware.js";
const router = express.Router();

router.post("/create/:restaurantId",restaurantMiddleware,upload.single("image"),addMenuItem)
router.put("/update/:restaurantId/menu/:menuItemId",restaurantMiddleware,upload.single("image"),updateMenu)
router.get("/by/:name",getMenuByName)
router.get("/all",getAllMenu)
router.get("/:restaurantId/item/:menuItemId",getMenuItemById)
router.delete("/:restaurantId/delete/:menuItemId",restaurantMiddleware,deleteMenuItem)


export const menuItemsRouter = router;
