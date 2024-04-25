const mongoose = require("mongoose")

///   schema 
const listSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    body: {
        type: String,
        required: true,
    },
    user: [{
        type: mongoose.Types.ObjectId,
        ref: "authSchema"
    }],
}, { timestamps: true })

const todoListSchema = mongoose.model("todoListSchema", listSchema)

module.exports = todoListSchema