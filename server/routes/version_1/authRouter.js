import express from "express";
import {
  getProfile,
  getRole,
  login,
  logout,
  profileUpdate,
  signUp,
} from "../../controllers/authContoller.js";
import {
  authMiddleware,
  roleMiddleware,
} from "../../middileware/authmiddileware.js";

const router = express.Router();

router.post("/login", login);
router.post("/signup", signUp);
router.get("/profile", authMiddleware, getProfile);
router.put("/update", authMiddleware, profileUpdate);
router.get("/profile/role", authMiddleware, getRole);
router.post("/logout",authMiddleware,logout)

export const authRouter = router;
