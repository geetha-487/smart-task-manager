const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const app = express();
app.use(express.json());
app.use(cors());

mongoose.connect(process.env.MONGO_URI)
.then(()=>console.log("DB Connected"))
.catch(err=>console.log(err));

app.use("/auth", require("./routes/auth"));
app.use("/tasks", require("./routes/tasks"));

app.get("/", (req,res)=>{
    res.send("API Running");
});

app.listen(5000, ()=>console.log("Server running"));