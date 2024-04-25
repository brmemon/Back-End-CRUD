const express = require("express")
const { connectMongoDb } = require("./connection")
const auth = require("./routes/auth")
const list = require("./routes/list")


const app = express();
const PORT = 5000;
app.use(express.json())

// // //   Connection   // // //
connectMongoDb("mongodb+srv://bmemon124:mongoDB@cluster0.rsbce1g.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0")
    .then(() => console.log("MongoDB Connected!"))

app.use("/api/v1", auth)
app.use("/api/v2", list)

app.listen(PORT, () => console.log(`Server Start At Post ${PORT}`))