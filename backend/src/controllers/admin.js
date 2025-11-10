const { User } = require("../models/User");
const { Enquiry } = require("../models/Enquiry");

/**
 * Get all users (Admin only)
 * Returns all users except password hash.
 */
const getAllUsers = async (_req, res) => {
  try {
    const users = await User.find().select("-passwordHash");
    res.json({ ok: true, users });
  } catch (err) {
    res.status(500).json({ ok: false, msg: err.message });
  }
};

/**
 * Assign enquiry to staff (Admin only)
 * Sets assignedTo and marks enquiry as In Progress.
 */
const assignEnquiry = async (req, res) => {
  try {
    const { enquiryId, staffId } = req.body;

    if (!enquiryId || !staffId) {
      res.status(400).json({ ok: false, msg: "Missing enquiryId or staffId" });
      return;
    }

    const enquiry = await Enquiry.findByIdAndUpdate(
      enquiryId,
      { assignedTo: staffId, status: "In Progress" },
      { new: true }
    );

    if (!enquiry) {
      res.status(404).json({ ok: false, msg: "Enquiry not found" });
      return;
    }

    res.json({ ok: true, msg: "Enquiry assigned successfully", enquiry });
  } catch (err) {
    res.status(500).json({ ok: false, msg: err.message });
  }
};

/**
 * Permanently delete enquiry (Admin only)
 * Removes enquiry completely from the database.
 */
const deleteEnquiryPermanently = async (req, res) => {
  try {
    const { id } = req.params;

    const enquiry = await Enquiry.findByIdAndDelete(id);
    if (!enquiry) {
      res.status(404).json({ ok: false, msg: "Enquiry not found" });
      return;
    }

    res.json({ ok: true, msg: "Enquiry permanently deleted" });
  } catch (err) {
    res.status(500).json({ ok: false, msg: err.message });
  }
};

module.exports = { getAllUsers, assignEnquiry, deleteEnquiryPermanently };
