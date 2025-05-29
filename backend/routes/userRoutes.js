const express = require("express");
const router = express.Router();
const User = require("../models/User");

const auth = require("../middleware/auth");
// adjust the path


// router.put("/update", auth, async (req, res) => {
//   const { bio, gender, profilePic } = req.body;

//   // Build update object with only provided fields
//   const updateData = {};
//   if (bio !== undefined) updateData.bio = bio;
//   if (gender !== undefined) updateData.gender = gender;
//   if (profilePic !== undefined) updateData.profilePic = profilePic;

//   try {
//     const updatedUser = await User.findByIdAndUpdate(req.user.id, updateData, { new: true });
//     res.status(200).json({
//       message: "Profile updated successfully",
//       user: updatedUser,
//     });
//   } catch (err) {
//     res.status(500).json({ message: "Error updating profile" });
//   }
// });

router.put("/update-bio", auth, async (req, res) => {
  const { bio, gender } = req.body;

  try {
    const updatedUser = await User.findByIdAndUpdate(
      req.user.id,
      { bio, gender },
      { new: true }
    );
    res.status(200).json(updatedUser);
  } catch (err) {
    res.status(500).json({ error: "Failed to update user" });
  }
});

router.get('/search', auth, async (req, res) => {
  try {
    const query = req.query.query;
    if (!query) return res.status(400).json({ message: 'Query is required' });

    // Find users matching the query (excluding current user)
    const users = await User.find({
      $and: [
        {
          $or: [
            { name: { $regex: query, $options: 'i' } }, // case-insensitive
            { username: { $regex: query, $options: 'i' } }
          ]
        },
        { _id: { $ne: req.user.id } } // exclude current user from search results
      ]
    }).select('-password -email'); // exclude sensitive info

    // Get current user to access their following list
    const currentUser = await User.findById(req.user.id).select('following');

    // Map over users to add 'followed' field
    const resultsWithFollowed = users.map(user => {
      // check if current user is following this user
      const isFollowed = currentUser.following.some(followedId => followedId.equals(user._id));
      return {
        ...user.toObject(),
        followed: isFollowed
      };
    });

    res.json(resultsWithFollowed);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server Error' });
  }
});


// POST or PUT? Usually PUT is fine for this kind of update
router.put('/follow/:id', auth, async (req, res) => {
  try {
    const userToFollow = await User.findById(req.params.id);
    const currentUser = await User.findById(req.user.id);

    if (!userToFollow) return res.status(404).json({ message: "User to follow not found" });

    // Check if already following
    if (userToFollow.followers.includes(req.user.id)) {
      return res.status(400).json({ message: "Already following this user" });
    }

    // Prevent self-follow
    if (userToFollow._id.equals(currentUser._id)) {
      return res.status(400).json({ message: "You can't follow yourself" });
    }

    // Add follower and following references
    userToFollow.followers.push(req.user.id);
    currentUser.following.push(req.params.id);

    await userToFollow.save();
    await currentUser.save();

    res.status(200).json({ message: "User followed successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});
// GET /api/users/profile/:id
router.get('/profile/:id', auth, async (req, res) => {
  try {
    const user = await User.findById(req.params.id)
      .select('-password')
      .populate('followers', '_id name username')  // optional: populate follower user info
      .populate('following', '_id name username'); // optional: populate following user info

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json(user);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});
// UNFOLLOW USER
router.put('/unfollow/:id', auth, async (req, res) => {
  try {
    const targetUserId = req.params.id;
    const currentUserId = req.user.id;

    if (targetUserId === currentUserId) {
      return res.status(400).json({ message: "You can't unfollow yourself" });
    }

    const targetUser = await User.findById(targetUserId);
    const currentUser = await User.findById(currentUserId);

    if (!targetUser || !currentUser) {
      return res.status(404).json({ message: "User not found" });
    }

    if (!currentUser.following.includes(targetUserId)) {
      return res.status(400).json({ message: "You're not following this user" });
    }

    currentUser.following.pull(targetUserId);
    targetUser.followers.pull(currentUserId);

    await currentUser.save();
    await targetUser.save();

    res.status(200).json({ message: "Unfollowed user successfully" });
  } catch (error) {
    res.status(500).json({ message: "Unfollow failed", error });
  }
});

router.get("/all-users", auth, async (req, res) => {
  try {
    const users = await User.find().select('-password -email'); // exclude sensitive info
    res.status(200).json({users});
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error fetching users" });
  }
});



module.exports = router;

