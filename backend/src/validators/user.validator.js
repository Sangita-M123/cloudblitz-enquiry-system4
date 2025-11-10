const { z } = require("zod");

const updateRoleSchema = z.object({
  role: z.enum(["user", "staff", "admin"], {
    errorMap: () => ({ message: "Role must be user, staff, or admin" }),
  }),
});

module.exports = { updateRoleSchema };
