const { z } = require("zod");

const createEnquirySchema = z.object({
  customerName: z.string().min(2, "Customer name must be at least 2 characters").max(100, "Name too long"),
  email: z.string().email("Invalid email address").optional().or(z.literal("")),
  phone: z.string().regex(/^[0-9+\-\s()]*$/, "Invalid phone number").max(20, "Phone number too long").optional().or(z.literal("")),
  message: z.string().min(10, "Message must be at least 10 characters").max(1000, "Message too long"),
});

const updateEnquirySchema = z.object({
  customerName: z.string().min(2, "Customer name must be at least 2 characters").max(100, "Name too long").optional(),
  email: z.string().email("Invalid email address").optional().or(z.literal("")),
  phone: z.string().regex(/^[0-9+\-\s()]*$/, "Invalid phone number").max(20, "Phone number too long").optional().or(z.literal("")),
  message: z.string().min(10, "Message must be at least 10 characters").max(1000, "Message too long").optional(),
  status: z.enum(["New", "In Progress", "Closed"]).optional(),
  assignedTo: z.string().optional().nullable(),
});

module.exports = { createEnquirySchema, updateEnquirySchema };
