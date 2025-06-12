// controllers/tokenUsageController.js
import User from "../models/user.js";

const updateTokenUsage = async (req, res) => {
  try {
    const { id, tokensConsumed } = req.body;
    const updatedTokenUsage = await User.findOneAndUpdate(
      { _id: id },
      { $inc: { tokensUsed: tokensConsumed } },
    );
    res.status(200).json(updatedTokenUsage);
  } catch (err) {
    res.status(500).json({ message: 'Something went wrong' });
  }
};

const getTokenUsage = async (req, res) => {
  try {
    const user = await User.findOne({ _id: req.params.userId });
    res.status(200).json(user.tokensUsed);
  } catch (err) {
    res.status(500).json({ message: 'Something went wrong' });
  }
};

export default { updateTokenUsage, getTokenUsage }
