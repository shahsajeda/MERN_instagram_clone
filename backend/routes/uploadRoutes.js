const express = require('express');
const multer = require('multer');
const router = express.Router();
const upload = multer({ dest: 'uploads/' }); // or configure storage
const auth = require("../middleware/auth");
const User = require('../models/User'); // adjust path to your User model


router.put('/update-profile-pic', auth, upload.single('profilePic'), async (req, res) => {
  try {
    const userId = req.user.id;
    if (!userId) return res.status(401).json({ message: 'Unauthorized: No user ID' });

    const file = req.file;
    if (!file) return res.status(400).json({ message: 'No file uploaded' });

    const updatedUser = await User.findByIdAndUpdate(
  userId,
  { profilePic: `http://localhost:5000/uploads/${file.filename}` },
  { new: true }
);


    res.json(updatedUser);
  } catch (err) {
    console.error('Upload error:', err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

module.exports = router;
