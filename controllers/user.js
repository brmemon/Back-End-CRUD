const userSchema = require("../models/signUpAndInSchema");
const List = require("../models/listSchema");
const bcrypt = require("bcrypt");
const nodemailer = require("nodemailer");
const Otp = require("../models/otp");

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

// Change Password
async function changePassword(req, res) {
    try {
        const { email, oldPassword, newPassword } = req.body;
        const user = await userSchema.findOne({ email: email });
        if (!email || !oldPassword || !newPassword) {
            return res.status(200).json({ message: "All Fields Are Required" });
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

// Get User Lists by ID
async function getUserListsById(req, res) {
    try {
        const list = await List.find({ user: req.params.id }).sort({ createdAt: -1 });
        if (list.length !== 0) {
            res.status(200).json({ list: list });
        } else {
            res.status(200).json({ message: "Todo not found" });
        }
    } catch (error) {
        res.status(500).json({ message: "No Data" });
    }
}

// Send Email with OTP
async function sendEmail(req, res) {
    try {
        const data = await userSchema.findOne({ email: req.body.email });
        // console.log(data);
        if (data) {
            const otpCode = Math.floor((Math.random() * 10000) + 1);
            const otpData = new Otp({
                email: req.body.email,
                code: otpCode,
                expireIn: new Date().getTime() + 300 * 1000
            });
            await otpData.save();

            const transporter = nodemailer.createTransport({
                service: "gmail",
                host: 'smtp.gmail.com',
                port: 465,
                secure: true,
                auth: {
                    user: process.env.MONGODB_EMAIL,
                    pass: process.env.MONGODB_APP_PASSWORD
                }
            });

            const mailOptions = {
                from: process.env.REACT_APP_MONGODB_EMAIL,
                to: data?.email,
                subject: "Password Reset OTP",
                html: `<p>Your OTP for password reset is: <strong>${otpCode}</strong></p>`
            };

            await transporter.sendMail(mailOptions);
            return res.status(200).json({ success: true, message: "Success! Please check your email" });
        } else {
            return res.status(400).json({ success: false, message: "Email does not exist" });
        }
    } catch (error) {
        console.error("Error sending email: ", error);
        return res.status(500).json({ success: false, message: "Failed to send email" });
    }
}

// Forgot Password
async function forgotPassword(req, res) {
    try {
        const { email, otp, password } = req.body;
        const otpData = await Otp.findOne({ email: email, code: otp });
        console.log({ email: email, code: otp });
        console.log(otpData, "otp data backend");
        if (!otpData) {
            return res.status(400).json({ message: "Invalid OTP" });
        }

        const currentTime = new Date().getTime();
        if (otpData.expireIn < currentTime) {
            return res.status(400).json({ message: "OTP Expired" });
        }

        const user = await userSchema.findOne({ email: email });
        if (!user) {
            return res.status(400).json({ message: "User Not Found" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        user.password = hashedPassword;
        await user.save();
        return res.status(200).json({ message: "Password changed successfully" });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
}

module.exports = {
    signUpUser,
    signInUser,
    changePassword,
    getUserListsById,
    sendEmail,
    forgotPassword
};
