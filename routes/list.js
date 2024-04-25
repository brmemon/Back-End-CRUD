const express = require("express")
const router = express.Router()
const { userList } = require("../controllers/list")

router.post("/addTask", userList)

module.exports = router;