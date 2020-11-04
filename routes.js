const express = require("express")
const router = express.Router()

const controllers = require("./controllers/all")

router.post("/login", controllers.users.login)

module.exports = router