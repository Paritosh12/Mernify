import express from 'express'

import Prompt from '../models/Prompt.js'

export const addPrompt=async(req,res)=>{
    const {title}=req.body;
    const newPrompt= await Prompt.create({
        title,
        createdBy:req.user_id,
        versions:[{version:1,body,editedBy:req.user_id,timestamp:new Date()}]
    });
    res.status(201).json(newPrompt);
}

export const getPrompts = async (req, res) => {
  const prompts = await Prompt.find().populate("createdBy", "name");
  res.json(prompts);
};

export const updatePrompt=async(req,res)=>{

}

//upvote prompt