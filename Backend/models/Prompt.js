import mongoose from "mongoose";

export const promptSchema=new mongoose.Schema({
    title:{type:String,required:true},
    createdBy:{type:mongoose.Schema.Types.ObjectId,ref:("User")},
    upvote:{type:Number,min:0},
    versions: [
      {
        version: Number,
        body: String,
        editedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
        timestamp: Date,
      },
    ],
},{timestamps:true})

const Prompt=mongoose.model("Prompt",promptSchema);

export default Prompt;