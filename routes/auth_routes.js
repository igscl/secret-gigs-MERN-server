const express = require("express")
const router = express.Router()
const { register, loginUser, logout, userSession} = require("../controllers/auth_controller")

router.post("/register", register)

router.post("/login", loginUser)

router.get("/logout", logout)

router.get("/user", userSession)

module.exports = router