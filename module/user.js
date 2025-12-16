const { nanoid } = require("nanoid");
const mongoose = require("mongoose");
const userSchema = mongoose.Schema({
  username: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  userType: {
    type: String,
    enum: ["guest", "host", "supervisor"],
    default: "guest",
  },
  userProfile: { type: String },
  workAssigned: [
    {
      projectId: { type: String, unique: true, default: () => nanoid(10) },
      title: { type: String, required: true },
      domain: { type: String },
      skills: [String],
      level: { type: String },
      description: { type: String },
      deliverables: [String],
      duration: { type: String },
      budget: { type: String },
    },
  ],
  approved: { type: Boolean, default: false },
  reels: [String],
  yourWork: [{}],
  hostWorkDone: [{}],
});

module.exports = mongoose.model("User", userSchema);
