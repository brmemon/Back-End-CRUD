const express = require("express")
const router = express.Router()
const { createUserList, updateUserList, deleteUserList, getUserListsById, getUserListById } = require("../controllers/list")

router.post("/add", createUserList)
router.put("/update/:id", updateUserList)
router.delete("/delete/:id", deleteUserList)
router.get("/:id", getUserListById)

module.exports = router;