import Prompt from '../models/Prompt.js'; // Assuming the path is correct
import Workspace from '../models/Workspace.js'; //

export const getGlobalStats = async (req, res) => {
  try {
    // Note: The countDocuments call here should be fast as it is a metadata query
    const totalPrompts = await Prompt.countDocuments({});
    const totalWorkspaces = await Workspace.countDocuments({}); //

    res.json({
      totalPrompts,
      totalWorkspaces,
    });
  } catch (error) {
    console.error("Error fetching global stats:", error);
    res.status(500).json({ message: "Failed to fetch global statistics" });
  }
};