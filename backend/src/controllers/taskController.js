const taskModel = require("../models/taskModel.js");
const xlsx = require("xlsx");

//upload excel file
exports.uploadfile = async (req, res) => {
  try {
    const file = req.file;

    const workbook = xlsx.readFile(file.path);
    const sheetNames = workbook.SheetNames;
    const data = xlsx.utils.sheet_to_json(workbook.Sheets[sheetNames[0]]);

    const tasksToSave = data.map((row) => ({
      Title: row.Title,
      Description: row.Description,
      Status: row.Status,
    }));

    await taskModel.insertMany(tasksToSave);

    res.send({
      success: true,
      message: "File uploaded and data saved to MongoDB successfully!",
    });
  } catch (err) {
    res.status(500).send({ success: false, error: err.message });
  }
};

//get task list
exports.getAllTasks = async (req, res) => {
  try {
    const tasksList = await taskModel.find({ Status: "Completed" });
    if (!tasksList)
      res
        .status(404)
        .send({ success: false, message: "No any task is completed" });

    res.json(tasksList);
  } catch (err) {
    res.status(500).send({ success: false, error: err.message });
  }
};

//add task
exports.createTask = async (req, res) => {
  try {
    const { Title, Description, Status, Pdf } = req.body;

    const newTask = await taskModel.create({ Title, Description, Status, Pdf });

    res.status(201).send({ success: true, data: newTask });
  } catch (err) {
    res.status(500).send({ success: false, error: err.message });
  }
};

//update task
exports.updateTask = async (req, res) => {
  try {
    const { taskId } = req.params;

    const task = await taskModel.findById(taskId);
    if (!task) {
      return res.status(404).send("Task not found");
    }
    const { Title, Description, Status } = req.body;
    const updatedTask = await taskModel.findByIdAndUpdate(
      { _id: taskId },
      { Title, Description, Status },
      { new: true }
    );

    res.status(200).send({ success: true, data: updatedTask });
  } catch (err) {
    res.status(500).send({ success: false, error: err.message });
  }
};

//delete task
exports.deleteTask = async (req, res) => {
  try {
    const { taskId } = req.params;
    const task = await taskModel.deleteOne({ _id: taskId });
    if (!task) {
      return res.status(404).send("Task not found");
    }
    res.status(200).send({ success: true, message: "Task deleted" });
  } catch (err) {
    res.status(500).send({ success: false, error: err.message });
  }
};
