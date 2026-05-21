import express from "express"
import registerUser from "../Controller/register_controller.js"

const router = express.Router()

router.post("/register", registerUser)

export default router
