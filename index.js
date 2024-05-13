require('dotenv').config()
const express = require("express")
const { connectMongoDb } = require("./connection")
const auth = require("./routes/auth")
const list = require("./routes/todoRoutes")
const cors = require("cors")

const PORT = process.env.BACKEND_PORT;
const app = express();
app.use(express.json())

// // //   Connection   // // //
connectMongoDb("mongodb+srv://bmemon124:mongoDB@cluster0.rsbce1g.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0")
    .then(() => console.log("MongoDB Connected!"))

app.use(cors());
app.use("/api/user", auth)
app.use("/api/todo", list)

app.listen(PORT, () => console.log(`Server Start At Post ${PORT} `))