const express = require("express")
const router = express.Router()
const { signUpUser, signInUser, chnagePassword, getUserListsById } = require("../controllers/user")

router.post("/register", signUpUser)
router.post("/signin", signInUser)
router.post("/forget/password", chnagePassword)
router.get("/todos/:id", getUserListsById)
module.exports = router;