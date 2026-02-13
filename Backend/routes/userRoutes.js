const express = require("express");
const router = express.Router();
const upload = require("../middlewares/upload");
const { updateProfilePicture } = require("../Controllers/userController");
const authMiddleware = require("../middlewares/authMiddlewares");

router.put(
  "/profile-picture",
  authMiddleware,
  upload.single("profilePicture"),
  updateProfilePicture,
);

module.exports = router;
