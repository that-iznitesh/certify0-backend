import mongoose from 'mongoose';

const bookSchema = new mongoose.Schema({
  title: { type: String, required: true },
  author: { type: String, required: true },
  description: { type: String },
  genre: { type: String },
  year: { type: Number },
  addedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }
});
export default  mongoose.model('Book', bookSchema);
