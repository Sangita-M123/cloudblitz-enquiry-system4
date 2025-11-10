const mongoose = require("mongoose");
const { Schema } = mongoose;

const enquirySchema = new Schema(
  {
    customerName: { type: String, required: true },
    email: { type: String, match: /^\S+@\S+\.\S+$/ },
    phone: { type: String },
    message: { type: String },
    status: {
      type: String,
      enum: ["New", "In Progress", "Closed"],
      default: "New",
    },
    assignedTo: { type: Schema.Types.ObjectId, ref: "User", default: null },
    createdBy: { type: Schema.Types.ObjectId, ref: "User", default: null },
    deletedAt: { type: Date, default: null },
  },
  { timestamps: true }
);

const Enquiry = mongoose.model("Enquiry", enquirySchema);

module.exports = { Enquiry };
