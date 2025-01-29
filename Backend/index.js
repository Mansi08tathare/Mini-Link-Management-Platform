const express = require("express");
const app = express();
const path = require("path");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const userRoute = require("./routes/user");
const linkRoute = require("./routes/links");
const analyticsRoute = require("./routes/analytics");
const dashboardRoute = require("./routes/dashboard");
const bodyParser = require("body-parser");
const links = require("./schema/link.schema");
dotenv.config();
const device = require('express-device'); 
const cors = require('cors')
app.use(device.capture());


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
app.use('/link',linkRoute);
app.use("/analytics",analyticsRoute);
app.use("/dashboard",dashboardRoute);

app.get('/:shortUrl', async (req, res) => {
    const { shortUrl } = req.params;

    try {
        // Find the link based on the shortUrl hash
        const link = await links.findOne({ shortUrl });

        // If the link is not found, return a 404 error
        if (!link) {
            return res.status(404).send('Short URL not found');
        }

        // Check if the link has an expiration date and if it has expired
        if (link.expirationDate && new Date(link.expirationDate) < new Date()) {
            return res.status(410).send('Link expired');
        }

        // Capture click data (IP address and device info)
        const clickData = {
            ip: req.ip, // User IP address
            device: req.device?.type || 'unknown', // Device type (mobile, tablet, etc.)
        };

        // Push the click data to the `clicks` array
        link.clicks.push(clickData);
        link.clickCount += 1; // Increment the click count

        // Save the updated link object to the database
        await link.save();

        // Redirect to the original URL
        res.redirect(link.originalUrl);
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal server error');
    }
});




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
