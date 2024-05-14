const express = require("express")
const router = express.Router()
const { signUpUser, signInUser, chnagePassword, sendEmail, getUserListsById } = require("../controllers/user")

router.post("/register", signUpUser)
router.post("/signin", signInUser)
router.post("/forget/password", chnagePassword)
router.post("/send/email", sendEmail)
router.get("/todos/:id", getUserListsById)
module.exports = router;