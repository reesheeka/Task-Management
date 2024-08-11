const express = require("express");
const router = express.Router();
const {
  uploadfile,
  getAllTasks,
  createTask,
  updateTask,
  deleteTask,
} = require("../controllers/taskController.js");

router.post("/upload", uploadfile);
router.get("/get", getAllTasks);
router.post("/add", createTask);
router.put("/update/:taskId", updateTask);
router.delete("/delete/:taskId", deleteTask);

module.exports = router;
