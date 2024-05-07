const List = require("../models/listSchema")
const userSchema = require("../models/signUpAndInSchema")

// Create
async function createUserList(req, res) {
    try {
        const { title, body, id } = req.body
        if (!title || !body) {
            return res.status(400).json({ succcess: false, message: "Missing Required Params" })
        }
        const existingUser = await userSchema.findById(id)
        if (existingUser) {
            const list = new List({ title, body, userId: existingUser.id })
            return await list.save().then(() => {
                existingUser.list.push(list)
                existingUser.save()
                return res.status(200).json({ list })
            })
                .catch(err => {
                    return res.status(400).json(err.message)
                })
        }
        else {
            return res.status(404).json({ succcess: false, message: "User Not Found" })
        }
    } catch (error) {
        return res.status(400).json(error.message)
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
        return res.status(500).json(error)
    }
}

// Delete 

async function deleteUserList(req, res) {
    try {
        const { id } = req.body
        console.log(id);
        const existingUser = await userSchema.findByIdAndUpdate(id, { $pull: { list: req.params.id } })
        if (existingUser) {
            await List.findByIdAndDelete(req.params.id)
                .then(() => {
                    return res.status(200).json({ message: "Delete Successfully",id: req.params.id})
                })
        }
        return res.status(404).json({ message: "User Not Found" })
    } catch (error) {
        return res.status(500).json({ error: error.message })
    }
}

async function getUserListById(req, res) {
    try {
        const todo = await List.find({ userId: req.params.id });
        if (todo) {
            return res.status(200).json({ todo: todo });
        }
        return res.status(404).json({ message: "No Data" });

    } catch (error) {
        return res.status(500).json({ message: "Add Correct Id" });
    }
}

module.exports = {
    createUserList,
    updateUserList,
    deleteUserList,
    getUserListById
}