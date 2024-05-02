const userSchema = require("../models/signUpAndInSchema")
const List = require("../models/listSchema")
const bcrypt = require("bcrypt")
const nodemailer = require("nodemailer")
const authSchema = require("../models/signUpAndInSchema")

// Sign Up
async function signUpUser(req, res) {
    try {
        const { email, username, password } = req.body
        const hashpassword = bcrypt.hashSync(password, 10)
        const user = new userSchema({ email, username, password: hashpassword })
        await user.save()
        return res.status(200).json({ message: "Sign Up Successfull" })
    } catch (error) {
        return res.status(200).json({ message: "User Already Exists" })
    }
}

// Sign In
async function signInUser(req, res) {
    try {
        const user = await userSchema.findOne({ email: req.body.email })
        if (!user) {
            return res.status(200).json({ message: "Please Sign Up First" })
        }
        const isPasswordCorrect = bcrypt.compareSync(req.body.password, user.password)
        if (!isPasswordCorrect) {
            return res.status(200).json({ message: "Password Is Not Correct" })
        }
        const { password, ...others } = user._doc
        return res.status(200).json({ message: "Sign In Successfull", others })
    } catch (error) {
        return res.status(404).json({ message: "Eamil And Password Are Required" })
    }
}

// Forget
async function forgetPassword(req, res) {
    try {
        const { email, oldPassword, newPassword } = req.body;
        const user = await userSchema.findOne({ email: email });
        if (user) {
            const isPasswordCorrect = await bcrypt.compare(oldPassword, user.password);
            if (isPasswordCorrect) {
                const hashedNewPassword = await bcrypt.hash(newPassword, 10);
                await userSchema.findByIdAndUpdate(user._id, { password: hashedNewPassword });
                console.log(user._id, "user._id");
                return res.status(200).json({ message: "Password Changed Successfully" });
            } else {
                return res.status(400).json({ message: "Incorrect Old Password" });
            }
        } else {
            return res.status(400).json({ message: "User Not Found" });
        }
    } catch (error) {
        return res.status(400).json({ success: false, message: error.message });
    }
}

module.exports = {
    forgetPassword
};


// get 
async function getUserListsById(req, res) {
    try {
        const list = await List.find({ user: req.params.id }).sort({ createdAt: -1 })
        if (list.length !== 0) {
            res.status(200).json({ list: list })
        } else {
            req.status(200).json({ message: "Todo not found" })
        }

    } catch (error) {
        res.status(500).json({ message: "No Data" })
    }
}


module.exports = {
    signUpUser,
    signInUser,
    forgetPassword,
    getUserListsById
}