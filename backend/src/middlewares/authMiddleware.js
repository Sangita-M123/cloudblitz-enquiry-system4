// This file exports the same functions as auth.js for compatibility
const { protect, adminOnly } = require("./auth");

module.exports = { protect, adminOnly };
