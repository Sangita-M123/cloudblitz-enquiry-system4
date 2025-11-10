const mongoose = require("mongoose");
const { Schema } = mongoose;

const userSchema = new Schema(
  {
    name: { type: String },
    email: { 
      type: String, 
      required: true, 
      unique: true, 
      match: /^\S+@\S+\.\S+$/ 
    },
    passwordHash: { type: String, required: true },
    role: {
      type: String,
      enum: ["admin", "staff", "user"],
      default: "user",
    },
    deletedAt: { type: Date, default: null },
  },
  { timestamps: true }
);

const User = mongoose.model("User", userSchema);

module.exports = { User };
