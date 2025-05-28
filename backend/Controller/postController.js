// controllers/postsController.js
const Post = require("../models/Post");

exports.likeUnlikePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.postId);
    const userId = req.user.id;

    if (!post) return res.status(404).json({ msg: "Post not found" });

    const alreadyLiked = post.likes.includes(userId);

    if (alreadyLiked) {
      post.likes = post.likes.filter((id) => id.toString() !== userId);
    } else {
      post.likes.push(userId);
    }

    await post.save();

    res.json({
      message: alreadyLiked ? "Post unliked" : "Post liked",
      likes: post.likes, // send updated likes list
    });
  } catch (err) {
    console.error("Toggle like error:", err);
    res.status(500).json({ msg: "Server error" });
  }
};

