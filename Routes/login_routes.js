import express from "express"
import loginUser from "../Controller/login_controller.js"

const router = express.Router()

router.post("/login", loginUser)

export default router
