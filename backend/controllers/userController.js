import User from '../models/user.js'
import { asyncHandler } from '../utils/asyncHandler.js';
import { MAX_TAGS } from '../../shared/constants/zod/validation.js';
const addTag = asyncHandler(async (req, res) => {
  const uid = req.profile._id;
  const { tagName } = req.body;
  const { tags } = await User.findById(uid).select('tags').lean();
  if(tags.length >= MAX_TAGS) return res.status(403).json({ message: 'Breached tag cap' });
  console.log(tags);
  await User.findByIdAndUpdate(uid, { $addToSet: { tags: tagName } });
  
  res.sendStatus(204);

});

const getTags = asyncHandler(async (req, res) => {
  const uid = req.profile._id;
  const user = await User.findById(uid).select('tags').lean();
  const sortedTags = user.tags.sort((a,b) => a.localeCompare(b));
  res.json(sortedTags);

});

const checkTokens = asyncHandler(async (req, res) => {
  const uid = req.profile._id;
  const { tokensUsed } = await User.findById(uid).select('tokensUsed -_id');
  return res.json({ tokensUsed });
})

export default { addTag, getTags, checkTokens }