const express = require("express");
const router = express.Router();
const authMiddleware = require("../middlewares/authMiddlewares");
const { requestTask,getRequestsForMyTasks,acceptRequest,rejectRequest } = require("../Controllers/requestController");

router.post("/:taskId",authMiddleware,requestTask);

router.get("/my-tasks",authMiddleware,getRequestsForMyTasks);


router.patch("/:requestId/accept",authMiddleware,acceptRequest);


router.patch("/:requestId/reject",authMiddleware,rejectRequest);

module.exports = router;
