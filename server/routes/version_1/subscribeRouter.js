import express from "express";
import { getAllSubscriptions, subscribeNewsletter } from "../../controllers/NewsletterController.js";
import { authMiddleware } from "../../middileware/authmiddileware.js";

const router = express.Router();

router.post("/create",authMiddleware, subscribeNewsletter);
router.get("/all",authMiddleware,getAllSubscriptions)

export const subscribeRouter = router;
