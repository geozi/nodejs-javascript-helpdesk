/**
 * Role schema.
 * @module src/models/role
 */

const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const uniqueValidator = require("mongoose-unique-validator");
const roleValidationMessages = require("../resources/roleValidationMessages");
const employeeValidationMessages = require("../resources/employeeValidationMessages");

/**
 * Role schema for persistence in MongoDB.
 *
 * @memberof module:src/models/role
 * @type {mongoose.Schema<Role>}
 * @typedef {Object} Role
 * @property {mongoose.Schema.Types.ObjectId} employeeId - The ID of the employee with the designated role.
 * @property {String} role - The role designated to the employee.
 */
const roleSchema = new Schema(
  {
    employeeId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Employee",
      required: [true, employeeValidationMessages.EMP_ID_REQUIRED],
      unique: [true, employeeValidationMessages.EMP_ID_UNIQUE],
    },
    role: {
      type: String,
      required: [true, roleValidationMessages.ROLE_REQUIRED],
      enum: {
        values: ["admin", "assistant", "general"],
        message: roleValidationMessages.ROLE_INVALID,
      },
    },
  },
  {
    collection: "roles",
    timestamps: true,
  }
);

roleSchema.plugin(uniqueValidator);
module.exports = mongoose.model("Role", roleSchema);
