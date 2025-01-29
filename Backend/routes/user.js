const express= require("express");
const router = express.Router();
const User = require("../schema/user.schema")
const jwt = require("jsonwebtoken")
const bcrypt = require("bcrypt")
const dotenv = require("dotenv")
const authMiddleware = require("../middleware/auth")  
dotenv.config()


router.post("/register",async (req,res)=>{
    const {name,email,password,mobile} = req.body;
    const isUserExist = await User.findOne({email});
    if(isUserExist){
        return res.status(400).json({message:"User already exist"})
    }
   const salt = await bcrypt.genSalt(10);
   const hashedPassword = await bcrypt.hash(password,salt);
   try{
    const user = await User.create({
        name,
        email,
        password:hashedPassword,
        mobile,
    });
    res.status(200).json({message:"User created"})
   }catch(err){
    res.status(500).json({message:'Error in creating user'})
   }
})

router.post("/login",async(req,res)=>{
  try{
    const{email,password} = req.body;
    const user = await User.findOne({email});
    // console.log("user",user)
    if(!user){
        return  res.status(400).json({message:"Wrong credentials"})
    }
    const isPasswordCorrect =await bcrypt.compare(password,user.password);
    if(!isPasswordCorrect){
        return res.status(400).json({message:"Wrong crendential"})
    }
    const payload = {
        id:user._id,
    }
    // const token = jwt.sign(payload,process.env.JWT_SECRET,{
    //     expireIn:"1h"
    // });
    const token = jwt.sign(payload,process.env.JWT_SECRET)
    res.status(200).json({token,user:user.name,userId:user._id})
  }catch(err){
    console.log(err)
  }
})

router.put('/:userId',authMiddleware, async (req, res) => {
    const { userId } = req.params;
    const { name, email, mobile } = req.body;
  
    try {
      // Build the update object dynamically
      const updateData = {};
      if (name) updateData.name = name;
      if (email) updateData.email = email;
      if (mobile) updateData.mobile = mobile;
  
      if (Object.keys(updateData).length === 0) {
        return res.status(400).json({ message: 'No fields provided for update' });
      }
  
      // Update the user in the database
      const updatedUser = await User.findByIdAndUpdate(
        userId,
        { $set: updateData },
        { new: true, runValidators: true }
      );
  
      if (!updatedUser) {
        return res.status(404).json({ message: 'User not found' });
      }
  
      res.status(200).json({ message: 'User updated successfully', user: updatedUser });
    } catch (error) {
      console.error('Error updating user:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  });
  

router.delete('/:userId',authMiddleware, async (req, res) => {
    const { userId } = req.params;
  
    try {
      const linkDeletionResult = await Link.deleteMany({ userId });
      console.log(`${linkDeletionResult.deletedCount} links deleted.`);
  
      const userDeletionResult = await User.findByIdAndDelete(userId);
      if (!userDeletionResult) {
        return res.status(404).json({ message: 'User not found' });
      }
  
      res.status(200).json({ message: 'User and associated links deleted successfully' });
    } catch (error) {
      console.error('Error deleting user and links:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  });
  
module.exports = router