const mongoose = require("mongoose")

///   schema 
const signUpAndInSchema = new mongoose.Schema({
    email: {
        type: String,
        unique: true,
        required: true
    },
    username: {
        type: String,
        unique: true,
    },
    password: {
        type: String,
        required: true
    },
    list: [{
        type: mongoose.Types.ObjectId,
        ref: "todoListSchema"
    }],
}, { timestamps: true })

const authSchema = mongoose.model("authSchema", signUpAndInSchema)

module.exports = authSchema