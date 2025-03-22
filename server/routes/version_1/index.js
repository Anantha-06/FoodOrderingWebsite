import express from 'express'
import { authRouter } from './authRouter.js'
import { adminRouter } from './adminRouter.js'
import { addressRouter } from './addressRouter.js'
import { cartRouter } from './cartRouter.js'
import { couponRouter } from './couponRouter.js'
import { menuItemsRouter } from './menuItemsRouter.js'
import { orderRouter } from './orderRouter.js'
import { paymentRouter } from './paymentRouter.js'
import { restaurantRouter } from './restaurantRouter.js'


const router = express.Router()

router.use("/user",authRouter)
router.use("/admin",adminRouter)
router.use("/address",addressRouter)
router.use("/cart",cartRouter)
router.use("/coupon",couponRouter)
router.use("/menu",menuItemsRouter)
router.use("/order",orderRouter)
router.use("/payment",paymentRouter)
router.use("/restaurant",restaurantRouter)


export const apiRouter = router