import mongoose from "mongoose";

export const userSchema=new mongoose.Schema({
    name:{type:String,required:true},
    emailId:{type:String,required:true},
    password:{type:String,required:true}
})

const User=mongoose.model("User",userSchema);

export default User;