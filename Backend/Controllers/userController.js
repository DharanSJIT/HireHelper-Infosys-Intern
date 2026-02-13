const User = require("../Models/User");

exports.updateProfilePicture = async (req, res) => {
  try {
    const userId = req.user.id; // from JWT middleware

    if (!req.file)
      return res.status(400).json({ message: "No image uploaded" });

    const user = await User.findById(userId);

    user.profilePicture = req.file.path; // Cloudinary URL
    await user.save();

    res.json({
      success: true,
      message: "Profile picture updated",
      profilePicture: user.profilePicture
    });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
