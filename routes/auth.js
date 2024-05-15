const express = require("express")
const router = express.Router()
const { signUpUser, signInUser, chnagePassword, sendEmail, forgotPassword, getUserListsById } = require("../controllers/user")

router.post("/register", signUpUser)
router.post("/signin", signInUser)
router.post("/change/password", chnagePassword)
router.post("/send/email", sendEmail)
router.post("/forgot/password", forgotPassword)
router.get("/todos/:id", getUserListsById)
module.exports = router;