const { Enquiry } = require("../models/Enquiry");

const createEnquiry = async (req, res) => {
  try {
    const { customerName, email, phone, message } = req.body;

    const newEnquiry = await Enquiry.create({ 
      customerName, 
      email: email || undefined, 
      phone: phone || undefined, 
      message, 
      createdBy: req.user?._id 
    });
    
    res.status(201).json({ 
      ok: true, 
      msg: "Enquiry created successfully", 
      enquiry: newEnquiry 
    });
  } catch (err) {
    res.status(500).json({ ok: false, msg: err.message });
  }
};

const getAllEnquiries = async (req, res) => {
  try {
    const filter = { deletedAt: null };
    // Admin and Staff can see all enquiries, normal users see only their own
    if (req.user?.role !== "admin" && req.user?.role !== "staff") {
      filter.createdBy = req.user?._id;
    }
    const enquiries = await Enquiry.find(filter)
      .populate("createdBy", "name email")
      .populate("assignedTo", "name email")
      .sort({ createdAt: -1 }); // Sort by newest first
    res.json({ ok: true, enquiries });
  } catch (err) {
    res.status(500).json({ ok: false, msg: err.message });
  }
};

const getEnquiryById = async (req, res) => {
  try {
    const enquiry = await Enquiry.findById(req.params.id)
      .populate("createdBy", "name email")
      .populate("assignedTo", "name email");
    
    if (!enquiry) {
      res.status(404).json({ ok: false, msg: "Enquiry not found" });
      return;
    }

    // Admin and Staff can view all enquiries, normal users can only view their own
    if (req.user?.role !== "admin" && req.user?.role !== "staff" && 
        enquiry.createdBy?._id.toString() !== req.user._id.toString()) {
      res.status(403).json({ ok: false, msg: "Access denied" });
      return;
    }

    res.json({ ok: true, enquiry });
  } catch (err) {
    res.status(500).json({ ok: false, msg: err.message });
  }
};

const updateEnquiry = async (req, res) => {
  try {
    const { status, assignedTo, customerName, message } = req.body;
    const enquiry = await Enquiry.findById(req.params.id);
    
    if (!enquiry) {
      res.status(404).json({ ok: false, msg: "Enquiry not found" });
      return;
    }

    // Check if enquiry is soft deleted
    if (enquiry.deletedAt) {
      res.status(404).json({ ok: false, msg: "Enquiry not found" });
      return;
    }

    // Admin and Staff can update any enquiry including status and assignedTo
    if (req.user?.role === "admin" || req.user?.role === "staff") {
      if (status) enquiry.status = status;
      if (assignedTo !== undefined) enquiry.assignedTo = assignedTo;
      if (customerName) enquiry.customerName = customerName;
      if (message) enquiry.message = message;
    } else {
      // Normal users can only update their own enquiries
      if (enquiry.createdBy?.toString() !== req.user._id.toString()) {
        res.status(403).json({ ok: false, msg: "You can only update your own enquiries" });
        return;
      }
      
      // Normal users CANNOT update email, phone, status, or assignedTo
      // They can only update customerName and message
      if (customerName) enquiry.customerName = customerName;
      if (message) enquiry.message = message;
      
      // Reject if user tries to update restricted fields
      if (status || assignedTo !== undefined) {
        res.status(403).json({ ok: false, msg: "You cannot update status or assignment" });
        return;
      }
    }

    await enquiry.save();

    const populatedEnquiry = await Enquiry.findById(enquiry._id)
      .populate("createdBy", "name email")
      .populate("assignedTo", "name email");

    res.json({ 
      ok: true, 
      msg: "Enquiry updated successfully", 
      enquiry: populatedEnquiry 
    });
  } catch (err) {
    res.status(500).json({ ok: false, msg: err.message });
  }
};

const deleteEnquiry = async (req, res) => {
  try {
    if (req.user?.role !== "admin") {
      res.status(403).json({ ok: false, msg: "Only admins can delete" });
      return;
    }

    const enquiry = await Enquiry.findByIdAndUpdate(
      req.params.id, 
      { deletedAt: new Date() }, 
      { new: true }
    );
    
    if (!enquiry) {
      res.status(404).json({ ok: false, msg: "Enquiry not found" });
      return;
    }

    res.json({ ok: true, msg: "Enquiry deleted", enquiry });
  } catch (err) {
    res.status(500).json({ ok: false, msg: err.message });
  }
};

module.exports = { 
  createEnquiry, 
  getAllEnquiries, 
  getEnquiryById, 
  updateEnquiry, 
  deleteEnquiry 
};
