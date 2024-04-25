const List = require("../models/listSchema")
const userSchema = require("../models/signUpAndInSchema")

async function userList(req, res) {
    try {
        const { title, body, email } = req.body
        const existingUser = await userSchema.findOne({ email })
        if (existingUser) {
            const list = new List({ title, body, user: existingUser })
            await list.save().then(() => res.status(200).json({ list }))
            existingUser.UserSchema.push(list)
            existingUser.save()
        }
    } catch (error) {
        console.log(error);
    }
}

module.exports = {
    userList
}