const express = require("express")
const router = express.Router()
const { signUpUser, signInUser } = require("../controllers/user")

router.post("/register", signUpUser)
router.post("/signin", signInUser)
module.exports = router;