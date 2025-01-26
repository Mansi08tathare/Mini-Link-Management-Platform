const express = require("express");
const app = express();
const path = require("path");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const userRoute = require("./routes/user")
const bodyParser = require("body-parser")
dotenv.config();
const cors = require('cors')


const PORT = process.env.PORT || 3005
app.use(cors())
app.use(express.static(path.join(__dirname, "public")))
// add route
//why html is store in folder 
app.get("/",(req,res)=>{
    res.sendFile(path.join(__dirname,"public", "try.html")); 
    // res.send("Hello World")
    // res.json({
    //    message:"Hello World"
    // })
    //   res.sendFile("<h1> Hello World </h1>")

})

app.use(express.urlencoded({extended:true}))
app.use(bodyParser.json())
app.use("/user" ,userRoute);


app.listen(PORT,()=>{
    console.log("Server running on 3005")
    mongoose.connect(process.env.MONGODB_URI,{
        useNewUrlParser :true ,
        useUnifiedTopology:true
    }).then(()=>{
        console.log("MongoDB connnected")
    }).catch((err)=>{
        console.log(err)
    })
})
