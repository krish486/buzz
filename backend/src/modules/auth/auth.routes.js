
const { Router } = require("express")
const { authController } = require("./auth.controller")
const authRoute = Router()

authRoute.post("/login", authController)

module.exports = authRoute