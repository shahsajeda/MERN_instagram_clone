const express = require("express");
const router = express.Router();
const User = require("../models/User");

const auth = require("../middleware/auth");


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

module.exports = router;
