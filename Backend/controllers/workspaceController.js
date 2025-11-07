import Workspace from "../models/Workspace.js";
import Prompt from "../models/Prompt.js";
import User from "../models/User.js"

// POST /api/workspaces
export const createWorkspace = async (req, res) => {
  try {
    const { title } = req.body;
    if (!title?.trim()) return res.status(400).json({ message: "Title is required" });
    const workspace = await Workspace.create({
      title,
      createdBy: req.user._id,
      prompts: [],
    });

    const user=await User.findById(req.user._id);
    user.workspaces.push(workspace._id);
    await user.save();
    res.status(201).json(workspace);
  } catch (error) {
    res.status(500).json({ message: "Error creating workspace", error: error.message });
  }
};

// GET /api/workspaces
export const getUserWorkspaces = async (req, res) => {
  try {
    const workspaces = await Workspace.find({ createdBy: req.user._id })
      .populate("prompts", "title upvotes createdAt");

    res.json(workspaces);
  } catch (error) {
    res.status(500).json({ message: "Error fetching workspaces" });
  }
};

// POST /api/workspaces/:workspaceId/prompts
export const addPromptToWorkspace = async (req, res) => {
  try {
    const { workspaceId } = req.params;
    const { title, body, tags } = req.body;

    const workspace = await Workspace.findById(workspaceId);
    if (!workspace) return res.status(404).json({ message: "Workspace not found" });

    // Create prompt inside this workspace
    const prompt = await Prompt.create({
      title,
      body,
      tags,
      createdBy: req.user._id,
      workspaceId,
      versions: [
        {
          version: 1,
          body,
          editedBy: req.user._id,
          timestamp: new Date(),
        },
      ],
    });

    workspace.prompts.push(prompt._id);
    await workspace.save();

    res.status(201).json({ message: "Prompt added to workspace", prompt });
  } catch (error) {
    res.status(500).json({ message: "Error adding prompt", error: error.message });
  }
};


export const getAllWorkspacesWithPromptCount = async (req, res) => {
  try {
    const workspaces = await Workspace.aggregate([
      {
        $lookup: {
          from: "prompts", // The MongoDB collection name (usually plural lowercase)
          localField: "_id",
          foreignField: "workspaceId",
          as: "promptsData",
        },
      },
      {
        $project: {
          _id: 1,
          title: 1,
          createdBy: 1,
          promptCount: { $size: "$promptsData" }, 
        },
      },
      {
          $sort: { promptCount: -1 }
      }
    ]);

    res.json(workspaces);
  } catch (error) {
    console.error("Error fetching all workspaces with prompt count:", error);
    res.status(500).json({ message: "Error fetching collaboration data", error: error.message });
  }
};