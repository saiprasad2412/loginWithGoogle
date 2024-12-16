import mongoose from 'mongoose';

const postSchema = new mongoose.Schema(
  {
    content: {
      type: String,
      required: true,
    },
    files: [
      {
        fileName: { type: String, required: true },
        filePath: { type: String, required: true },
        fileType: { type: String, required: true },
      },
    ],
    likes: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User', 
      },
    ],
    creator: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User', 
      required: true,
    },
  },
  { timestamps: true } 
);

const Post = mongoose.model('Post', postSchema);

export default Post;