const List = require("../models/listSchema")
const userSchema = require("../models/signUpAndInSchema")

// Create
async function createUserList(req, res) {
    try {
        const { title, body, email } = req.body
        const existingUser = await userSchema.findOne({ email })
        if (existingUser) {
            const list = new List({ title, body, user: existingUser })
            await list.save().then(() => {
                existingUser.list.push(list)
                existingUser.save()
                return res.status(200).json({ list })
            })
        }
    } catch (error) {
        console.log(error);
    }
}

// Update

async function updateUserList(req, res) {
    try {
        const { title, body, email } = req.body
        const existingUser = await userSchema.findOne({ email })
        if (existingUser) {
            const list = await List.findByIdAndUpdate(req.params.id, { title, body })
            list.save().then(() => {
                return res.status(200).json({ message: "Task Update" })
            })
        }
    } catch (error) {
        res.status(500).json(error)
    }
}

// Delete 

async function deleteUserList(req, res) {
    try {
        const { email } = req.body
        const existingUser = await userSchema.findOneAndUpdate({ email }, { $pull: { list: req.params.id } })
        if (existingUser) {
            await List.findByIdAndDelete(req.params.id)
                .then(() => {
                    return res.status(200).json({ message: "Delete Successfully" })
                })
        }
    } catch (error) {
        res.status(500).json(error)
    }
}

// get 

async function getUserListById(req, res) {
    try {
        const list = await List.find({ user: req.params.id }).sort({ createdAt: -1 })
        if (list.length !== 0) {
            res.status(200).json({ list: list })
        }else {
            req.status(200).json({mesage: "No Tasks"})
        }

    } catch (error) {
        res.status(500).json(error)
    }
}

module.exports = {
    createUserList,
    updateUserList,
    deleteUserList,
    getUserListById
}