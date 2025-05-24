// // const mongoose = require("mongoose");

// // const postSchema = new mongoose.Schema({
// //   username: { type: String, required: true },
// //   profilePic: { type: String },
// //   postImage: { type: String, required: true }, // base64 or URL
// //   caption: { type: String },
// //   createdAt: { type: Date, default: Date.now },
// // });

// // module.exports = mongoose.model("Post", postSchema);
// const mongoose = require("mongoose");

// const postSchema = new mongoose.Schema(
//   {
//     username: { type: String, required: true },
//     profilePic: { type: String },
//     postFile: { type: String, required: true }, // base64 or URL of image/video
//     fileType: { type: String, enum: ["image", "video"], required: true }, // tells if it's image or video
//     caption: { type: String },
//   },
//   { timestamps: true } // adds createdAt and updatedAt fields automatically
// );

// module.exports = mongoose.model("Post", postSchema);
// Post.js
const mongoose = require("mongoose");

const postSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "User",
  },
  username: String,
  profilePic: String,
  postFile: String,
  fileType: String,
  caption: String,
}, { timestamps: true });

module.exports = mongoose.model("Post", postSchema);
