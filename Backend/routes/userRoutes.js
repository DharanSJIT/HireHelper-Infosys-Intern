const express = require("express");
const router = express.Router();
const upload = require("../middlewares/upload");
const { updateProfile,updateProfilePicture,getProfile } = require("../controllers/userController");
const authMiddleware = require("../middlewares/authMiddleware");

router.get("/profile", authMiddleware, getProfile);

router.put("/update-profile", authMiddleware, updateProfile); 
router.put(
  "/profile-picture",
  authMiddleware,
  upload.single("profilePicture"),
  updateProfilePicture,
);

module.exports = router;
