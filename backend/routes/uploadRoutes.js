// const express = require('express');
// const router = express.Router();
// const multer = require('multer');
// const { uploadFile } = require('../controllers/uploadController');


// const storage = multer.diskStorage({
//     destination: './uploads/',
//     filename: (req, file, cb) => cb(null, Date.now() + '-' + file.originalname),
// });
// const upload = multer({ 
//   storage,
//   limits: { fileSize: 100 * 1024 * 1024 } // ✅ Allow up to 100MB
// });


// router.post('/', upload.single('file'), uploadFile);

// // PUT /api/users/update-profile-pic
// // router.put(
// //   "/update-profile-pic",
// //   auth,
// //   upload.single("profilePic"),
// //   async (req, res) => {
// //     try {
// //       const profilePicUrl = `http://localhost:5000/uploads/${req.file.filename}`;
// //       const updatedUser = await User.findByIdAndUpdate(
// //         req.user.id,
// //         { profilePic: profilePicUrl },
// //         { new: true }
// //       );
// //       res.json(updatedUser);
// //     } catch (err) {
// //       res.status(500).json({ error: "Failed to update profile picture" });
// //     }
// //   }
// // );

// module.exports = router;
const express = require('express');
const multer = require('multer');
const router = express.Router();
const upload = multer({ dest: 'uploads/' }); // or configure storage
const auth = require("../middleware/auth");
const User = require('../models/User'); // adjust path to your User model


// router.put('/update-profile-pic', upload.single('profilePic'), async (req, res) => {
//   try {
//     const userId = req.user.id; // from auth middleware
//     const file = req.file;
//     if (!file) return res.status(400).json({ message: 'No file uploaded' });

//     // TODO: move file to permanent location, update user profilePic path in DB

//     const updatedUser = await User.findByIdAndUpdate(
//       userId,
//       { profilePic: file.path }, // or URL if uploaded to cloud
//       { new: true }
//     );

//     res.json(updatedUser);
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ message: 'Server error' });
//   }
// });
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
