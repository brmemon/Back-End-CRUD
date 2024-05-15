const userSchema = require("../models/signUpAndInSchema")
const List = require("../models/listSchema")
const bcrypt = require("bcrypt")
const nodemailer = require("nodemailer")
const Otp = require("../models/otp")

// Sign Up
async function signUpUser(req, res) {
    try {
        const { email, username, password } = req.body
        const hashpassword = bcrypt.hashSync(password, 10)
        const user = new userSchema({ email, username, password: hashpassword })
        await user.save()
        return res.status(200).json({ message: "Sign Up Successfull", user })
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
async function chnagePassword(req, res) {
    try {
        const { email, oldPassword, newPassword } = req.body;
        const user = await userSchema.findOne({ email: email });
        if (email === "" || oldPassword === "" || newPassword === "") {
            return res.status(200).json({ message: "All Fields Are Required" })
        }
        if (user) {
            const isPasswordCorrect = await bcrypt.compare(oldPassword, user.password);
            if (isPasswordCorrect) {
                const hashedNewPassword = await bcrypt.hash(newPassword, 10);
                await userSchema.findByIdAndUpdate(user._id, { password: hashedNewPassword });
                return res.status(200).json({ message: "Password Changed Successfully" });
            } else {
                return res.status(400).json({ message: "Incorrect Old Password" });
            }
        } else {
            return res.status(400).json({ message: "User Not Found" });
        }
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
}

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

// send email
async function sendEmail(req, res) {
    try {
        let data = await userSchema.findOne({ email: req.body.email })
        if (data) {
            let otpCode = Math.floor((Math.random() * 10000) + 1);
            let otpData = new Otp({
                email: req.body.email,
                code: otpCode,
                expireIn: new Date().getTime() + 300 * 1000
            })
            await otpData.save()
            return res.status(200).json({ message: 'Success Please Check Your Email' })
        } else {
            return res.status(200).json({ message: 'Email Not Exist' })
        }
        // return res.status(404).json({ message: message })
    } catch (error) {
        return res.status(500).json({ message: error.message })
    }
}

// forgot password
async function forgotPassword(req, res) {
    try {
        let data = await Otp.find({ email: req.body.email, code: req.body.otpCode })
        if (data) {
            let currentTime = new Date().getTime()
            let difference = data.expireIn - currentTime
            if (difference < 0) {
                return res.status(200).json({ message: "Token Expire" })
            } else {
                let user = await userSchema.findOne({ email: req.body.email })
                console.log("hellow world user: ", user);
                if(!!user){
                user.password = req.body.password
                await user.save()
                return res.status(200).json({ message: "Password Changed successfully" })
            }
            else return res.status(400).json({message: "User Not found"})
        }
        } else {
            return res.status(400).json({ message: "Invalid Otp" })
        }
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}


const mailer = (email, otp) => {
    const transporter = nodemailer.createTransport({
        service: "gmail",
        port: "587",
        secure: "false",
        auth: {
            user: "OTP@gmail.com",
            pass: "otp"
        }
    })
    const mailOptions = {
        from: 'OTP@gmail.com',
        to: 'bmemon124@gmail.com',
        subject: 'Send Email Using Node.js ',
        text: "Thank You Sir !"
    };

    transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
            console.log(error);
        } else {
            console.log('Email Sent: ', info.response);
        }
    })
}

module.exports = {
    signUpUser,
    signInUser,
    chnagePassword,
    getUserListsById,
    sendEmail,
    forgotPassword
}