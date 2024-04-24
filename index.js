const express = require("express")
const { connectMongoDb } = require("./connection")

const app = express();
const PORT = 5000;

// // //   Connection   // // //
connectMongoDb("mongodb+srv://bmemon124:mongoDB@cluster0.rsbce1g.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0")
    .then(() => console.log("MongoDB Connected!"))

app.listen(PORT, () => console.log(`Server Start At Post ${PORT}`))