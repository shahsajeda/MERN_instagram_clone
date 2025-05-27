// const express = require("express");
// const router = express.Router();
// const Post = require("../models/Post");
// const auth = require("../middleware/auth");

// // POST /api/posts
// router.post("/", auth, async (req, res) => {
//   try {
//     const { username, profilePic, postImage, caption } = req.body;

//     const newPost = new Post({
//       username,
//       profilePic,
//       postImage,
//       caption,
//     });

//     const savedPost = await newPost.save();
//     res.status(201).json(savedPost);
//   } catch (error) {
//     res.status(500).json({ message: "Failed to upload post" });
//   }
// });

// module.exports = router;
const express = require("express");
const router = express.Router();
const Post = require("../models/Post");
const auth = require("../middleware/auth");

// 🔹 Upload post
router.post("/", auth, async (req, res) => {
  try {
    const { username, profilePic, postFile, fileType, caption } = req.body;
 const userId = req.user.id; 
    const newPost = new Post({
      userId,
      username,
      profilePic,
      postFile,
      fileType, // 'image' or 'video'
      caption,
    });

    const savedPost = await newPost.save();
    res.status(201).json(savedPost);
  } catch (error) {
    console.error("Upload error:", error);
    res.status(500).json({ message: "Failed to upload post" });
  }
});

// ✅ Get all posts for a user
router.get("/user/:username", async (req, res) => {
  try {
    const username = req.params.username;

    const userPosts = await Post.find({ username }).sort({ createdAt: -1 });

    res.json(userPosts);
  } catch (error) {
    console.error("Error fetching user posts:", error);
    res.status(500).json({ message: "Failed to fetch posts" });
  }
});
//delete a post
router.delete("/:postId", auth, async (req, res) => {
  try {
    const postId = req.params.postId;
    const userId = req.user.id;

    const post = await Post.findById(postId);

    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

   const postUserId = post.userId ? post.userId.toString() : null;
if (postUserId !== userId) {
  return res.status(403).json({ message: "Unauthorized: Cannot delete others' posts" });
}


    await post.deleteOne();
    res.json({ message: "Post deleted successfully" });
  } catch (error) {
    console.error("Delete error:", error);
    res.status(500).json({ message: "Failed to delete post" });
  }
});

// ✅ Get all posts (from all users)
// GET /api/posts
router.get('/', async (req, res) => {
  try {
    const posts = await Post.find().sort({ createdAt: -1 });
    res.json(posts);
  } catch (err) {
    res.status(500).json({ error: 'Server error while fetching posts' });
  }
});

module.exports = router;
