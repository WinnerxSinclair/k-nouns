import User from '../models/user.js'
import { asyncHandler } from '../utils/asyncHandler.js';

const addTag = asyncHandler(async (req, res) => {
  const { tagName } = req.body;
  
  await User.findByIdAndUpdate(req.profile._id, { $addToSet: { tags: tagName } });
  
  res.status(200).json({ message: 'tag created' });

});

const getTags = asyncHandler(async (req, res) => {
  
  const user = await User.findById(req.profile._id).select('tags').lean();
  const sortedTags = user.tags.sort((a,b) => a.localeCompare(b));
  res.json(sortedTags);

});

const checkTokens = asyncHandler(async (req, res) => {
  const uid = req.profile._id;
  const { tokensUsed } = await User.findById(uid).select('tokensUsed -_id');
  return res.json({ tokensUsed });
})

export default { addTag, getTags, checkTokens }