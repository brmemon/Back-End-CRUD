const express = require("express")
const router = express.Router()
const { createUserList, updateUserList, deleteUserList,getUserListById } = require("../controllers/list")

router.post("/addTask", createUserList)
router.put("/updateTask/:id", updateUserList)
router.delete("/deleteTask/:id", deleteUserList)
router.get("/getUser/:id", getUserListById)

module.exports = router;