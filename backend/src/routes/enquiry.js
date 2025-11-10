const express = require("express");
const { protect } = require("../middlewares/authMiddleware");
const { 
  createEnquiry, 
  getAllEnquiries, 
  getEnquiryById, 
  updateEnquiry, 
  deleteEnquiry 
} = require("../controllers/enquiry");
const { validate } = require("../middlewares/validate");
const { 
  createEnquirySchema, 
  updateEnquirySchema 
} = require("../validators/enquiry.validator");

const router = express.Router();

// POST /api/enquiries - Create new enquiry
router.post("/", protect, validate(createEnquirySchema), createEnquiry);

// GET /api/enquiries - Get all enquiries (role-based filtering)
router.get("/", protect, getAllEnquiries);

// GET /api/enquiries/:id - Get single enquiry by ID
router.get("/:id", protect, getEnquiryById);

// PUT /api/enquiries/:id - Update enquiry (role-based permissions)
router.put("/:id", protect, validate(updateEnquirySchema), updateEnquiry);

// DELETE /api/enquiries/:id - Soft delete enquiry (admin only)
router.delete("/:id", protect, deleteEnquiry);

module.exports = router;
