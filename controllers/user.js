const userSchema = require("../models/signUpAndInSchema")
const bcrypt = require("bcrypt")

// Sign Up
async function signUpUser(req, res) {
    try {
        const { email, username, password } = req.body
        const hashpassword = bcrypt.hashSync(password, 10)
        const user = new userSchema({ email, username, password: hashpassword })
        await user.save()
        return res.status(200).json({ message: "Sign Up Successfull"})
    } catch (error) {
        return res.status(200).json({message: "User Already Exists" })
    }
}

// Sign In
async function signInUser(req, res) {
    try {
        const user = await userSchema.findOne({ email: req.body.email })
        if (!user) {
            return res.status(400).json({ message: "Please Sign Up First" })
        }
        const isPasswordCorrect = bcrypt.compareSync(req.body.password, user.password)
        if (!isPasswordCorrect) {
            return res.status(400).json({ message: "Password Is Not Correct" })
        }
        const { password, ...others } = user._doc
        return res.status(200).json({ others })
    } catch (error) {
        return res.status(500).json({ message: error?.message })
    }
}

module.exports = {
    signUpUser,
    signInUser
}