const express = require("express");
const router = express.Router();
const upload = require("../middlewares/upload");
const {
  updateProfile,
  updateProfilePicture,
  getProfile,
  changePassword,
} = require("../Controllers/userController");
const authMiddleware = require("../middlewares/authMiddleware");

router.get("/profile", authMiddleware, getProfile);

router.put("/update-profile", authMiddleware, updateProfile); 
router.put("/change-password", authMiddleware, changePassword);
router.put(
  "/profile-picture",
  authMiddleware,
  upload.single("profilePicture"),
  updateProfilePicture,
);

module.exports = router;
