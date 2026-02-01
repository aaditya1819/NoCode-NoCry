import express from "express";
import { createUserProject, getUserCredits, getUserProject, getUserProjects, PurchaseCredits, togglePublish, paymentRazorpay, verifyRazorpay } from "../controllers/userController.js";
import { protect } from "../middlewares/auth.js";


const userRouter = express.Router()

userRouter.get('/credits', protect, getUserCredits)
userRouter.post('/project', protect, createUserProject)
userRouter.get('/project/:projectId', protect, getUserProject)
userRouter.get('/projects', protect, getUserProjects)
userRouter.get('/publish-toggle/:projectId', protect, togglePublish)
userRouter.post('/purchase-credits', protect, PurchaseCredits)
userRouter.post('/razorpay-payment', protect, paymentRazorpay)
userRouter.post('/razorpay-verify', verifyRazorpay)


export default userRouter







