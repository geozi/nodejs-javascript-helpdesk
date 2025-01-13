/**
 * Role controller.
 * @module src/controllers/role
 */
const Role = require("../models/role.model");
const mongoose = require("mongoose");
const validator = require("express-validator");
const responseMessages = require("../resources/responseMessages");
const {
  roleCreationRules,
  roleUpdateRules,
  roleDeleteRules,
} = require("../middleware/roleValidationRules");

/**
 * Middleware array that contains role creation logic.
 *
 * @memberof module:src/controllers/role
 * @type {Array<Object>}
 * @property {ValidationChain[]} roleCreationRules - Express validation rules for role creation.
 * @property {Function} anonymousAsyncFunction - Handles role creation requests and responses.
 */
const createRole = [
  ...roleCreationRules(),
  async (req, res) => {
    const expressErrors = validator.validationResult(req);
    if (!expressErrors.isEmpty()) {
      const errorMessage = expressErrors.array().map((err) => ({
        message: err.msg,
      }));

      return res.status(400).json({ errors: errorMessage });
    }

    try {
      const { employeeId, role } = req.body;
      const employeeIdAsObjectId = new mongoose.Types.ObjectId(employeeId);
      const newRole = new Role({
        employeeId: employeeIdAsObjectId,
        role: role,
      });

      await newRole.save();
      return res.status(201).json({ message: responseMessages.ROLE_CREATED });
    } catch (err) {
      if (err.name === "ValidationError") {
        const mongooseErrors = Object.values(err.errors).map((e) => ({
          message: e.message,
        }));

        return res.status(400).json({ errors: mongooseErrors });
      }
      return res
        .status(500)
        .json({ message: responseMessages.INTERNAL_SERVER_ERROR });
    }
  },
];

/**
 * Middleware array that contains role update logic.
 *
 * @memberof module:src/controllers/role
 * @type {Array<Object>}
 * @property {ValidationChain[]} roleUpdateRules - Express validation rules for role update.
 * @property {Function} anonymousAsyncFunction - Handles role update requests and responses.
 */
const updateRole = [
  ...roleUpdateRules(),
  async (req, res) => {
    const expressErrors = validator.validationResult(req);
    if (!expressErrors.isEmpty()) {
      const errorMessage = expressErrors.array().map((err) => ({
        message: err.msg,
      }));

      return res.status(400).json({ errors: errorMessage });
    }

    try {
      const { employeeId, role } = req.body;
      const employeeIdAsObjectId = new mongoose.Types.ObjectId(employeeId);

      const roleToUpdate = {
        employeeId: employeeIdAsObjectId,
        role: role,
      };

      const updatedRole = await Role.findOneAndUpdate(
        { employeeId: employeeIdAsObjectId },
        roleToUpdate,
        { new: true, runValidators: true, context: "query" }
      );

      if (updatedRole === null) {
        return res
          .status(404)
          .json({ message: responseMessages.ROLE_NOT_FOUND });
      }

      return res.status(201).json({ message: responseMessages.ROLE_UPDATED });
    } catch (err) {
      if (err.name === "ValidationError") {
        const mongooseErrors = Object.values(err.errors).map((e) => ({
          message: e.message,
        }));

        return res.status(400).json({ errors: mongooseErrors });
      }
      return res
        .status(500)
        .json({ message: responseMessages.INTERNAL_SERVER_ERROR });
    }
  },
];

/**
 * Middleware array that contains role deletion logic.
 *
 * @memberof module:src/controllers/role
 * @type {Array<Object>}
 * @property {ValidationChain[]} roleDeleteRules - Express validation rules for role deletion.
 * @property {Function} anonymousAsyncFunction - Handles role deletion requests and responses.
 */
const deleteRole = [
  ...roleDeleteRules(),
  async (req, res) => {
    const expressErrors = validator.validationResult(req);
    if (!expressErrors.isEmpty()) {
      const errorMessage = expressErrors.array().map((err) => ({
        message: err.msg,
      }));

      return res.status(400).json({ errors: errorMessage });
    }

    try {
      const { employeeId } = req.body;
      const employeeIdAsObjectId = new mongoose.Types.ObjectId(employeeId);
      const deletedRole = await Role.findOneAndDelete({
        employeeId: employeeIdAsObjectId,
      });

      if (deletedRole === null) {
        return res
          .status(404)
          .json({ message: responseMessages.ROLE_NOT_FOUND });
      }

      res.status(204).json({});
    } catch (err) {
      if (err.name === "ValidationError") {
        const mongooseErrors = Object.values(err.errors).map((e) => ({
          message: e.message,
        }));

        return res.status(400).json({ errors: mongooseErrors });
      }
      return res
        .status(500)
        .json({ message: responseMessages.INTERNAL_SERVER_ERROR });
    }
  },
];

module.exports = { createRole, updateRole, deleteRole };
