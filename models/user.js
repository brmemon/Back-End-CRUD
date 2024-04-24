const mongoose = require("mongoose")

///   schema 
const userSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    body: {
        type: String,
        required: true,
    },
}, { timestamps: true })

const User = mongoose.model("user", userSchema)

module.exports = User