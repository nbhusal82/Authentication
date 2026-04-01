import express from "express"
import { login, signout } from "../Controller/login_controller.js"

const router = express.Router()

router.post("/login", login)
router.post("/signout", signout)

export default router
