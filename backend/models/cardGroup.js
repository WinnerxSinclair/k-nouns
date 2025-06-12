import mongoose from "mongoose";

const ObjectId = mongoose.Schema.Types.ObjectId;
const cardGroupSchema = new mongoose.Schema({
  uid:  { type: ObjectId, required: true, index: true },
  name: { type: String, required: true },
  tags: { type: [String], default: [] },
}, { timestamps: true });

export default mongoose.model('Card_group', cardGroupSchema);