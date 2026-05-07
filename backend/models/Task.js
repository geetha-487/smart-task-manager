const mongoose = require("mongoose");

const taskSchema = new mongoose.Schema(
  {
    userId: String,
    title: String,

    priority: {
      type: String,
      default: "Medium"
    },

    status: {
      type: String,
      default: "To Do"
    },

    dueDate: Date
  },
  { timestamps: true }
);

module.exports = mongoose.model("Task", taskSchema);