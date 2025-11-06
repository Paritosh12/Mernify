import Doctor from "../models/Doctor.js";
import User from "../models/User.js"
import express from "express";

const router=express.Router();

router.get("/", async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch Users" });
  }
});

router.post("/", async (req, res) => {
  try {
    const newUser = new User(req.body);
    await newUser.save();
    res.json(newUser);
  } catch (err) {
    res.status(500).json({ error: "Failed to add User" });
  }
});


router.put("/",async (req,res)=>{
  
})
export default router;