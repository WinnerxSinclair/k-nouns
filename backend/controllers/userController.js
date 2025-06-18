import User from '../models/user.js'

const addTag = async (req, res) => {
  const { tagName } = req.body;
  try{
    await User.findByIdAndUpdate(req.profile._id, { $addToSet: { tags: tagName } });
  
    res.status(200).json({ message: 'tag created' });
  }catch(err){
    console.error(err);
    res.status(500).json({ message: 'failed to add tag' });
  }
}

const getTags = async (req, res) => {
  try{
    const user = await User.findById(req.profile._id).select('tags').lean();
    const sortedTags = user.tags.sort((a,b) => a.localeCompare(b));
    res.json(sortedTags);
  }catch(err){
    console.log(err);
    res.status(500).json({ message: 'failed to get tags' });
  }
}

export default { addTag, getTags }