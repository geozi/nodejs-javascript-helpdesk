/**
 * Employee controller.
 * @module src/controllers/employee
 */
const mongoose = require("mongoose");
const validator = require("express-validator");
const Employee = require("../models/employee.model");
const responseMessages = require("../resources/responseMessages");
const {
  employeeRegistrationRules,
  employeeUpdateRules,
  employeeDeletionRules,
} = require("../middleware/employeeValidationRules");

/**
 * Middleware array that contains employee registration logic.
 *
 * @memberof module:src/controllers/employee
 * @type {Array<Object>}
 * @property {ValidationChain[]} employeeRegistrationRules - Express validation rules for employee registration.
 * @property {Function} anonymousAsyncFunction - Handles employee registration requests and responses.
 */
const registerEmployee = [
  ...employeeRegistrationRules(),
  async (req, res) => {
    const expressErrors = validator.validationResult(req);
    if (!expressErrors.isEmpty()) {
      const errorMessage = expressErrors.array().map((err) => ({
        message: err.msg,
      }));

      return res.status(400).json({ errors: errorMessage });
    }

    try {
      const {
        firstName,
        lastName,
        email,
        phoneNumber,
        ssn,
        city,
        streetAddress,
        zipCode,
        dept,
        title,
      } = req.body;

      const newEmployee = new Employee({
        firstName: firstName,
        lastName: lastName,
        email: email,
        phoneNumber: phoneNumber,
        ssn: ssn,
        city: city,
        streetAddress: streetAddress,
        zipCode: zipCode,
        dept: dept,
        title: title,
      });

      await newEmployee.save();
      res.status(201).json({ message: responseMessages.EMPLOYEE_REGISTERED });
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
 * Middleware array that contains employee info update logic.
 *
 * @memberof module:src/controllers/employee
 * @type {Array<Object>}
 * @property {ValidationChain[]}  employeeUpdateRules - Express validation rules for employee info update.
 * @property {Function} anonymousAsyncFunction - Handles employee info update requests and responses.
 */
const updateEmployeeInfo = [
  ...employeeUpdateRules(),
  async (req, res) => {
    const expressErrors = validator.validationResult(req);
    if (!expressErrors.isEmpty()) {
      const errorMessage = expressErrors.array().map((err) => ({
        message: err.msg,
      }));

      return res.status(400).json({ errors: errorMessage });
    }

    try {
      const {
        id,
        firstName,
        lastName,
        email,
        phoneNumber,
        ssn,
        city,
        streetAddress,
        zipCode,
        dept,
        title,
      } = req.body;

      const idAsObjectId = new mongoose.Types.ObjectId(id);

      const employeeToUpdate = {
        firstName: firstName,
        lastName: lastName,
        email: email,
        phoneNumber: phoneNumber,
        ssn: ssn,
        city: city,
        streetAddress: streetAddress,
        zipCode: zipCode,
        dept: dept,
        title: title,
      };

      const updatedEmployee = await Employee.findByIdAndUpdate(
        idAsObjectId,
        employeeToUpdate,
        { new: true, runValidators: true, context: "query" }
      );

      if (updatedEmployee === null) {
        return res
          .status(404)
          .json({ message: responseMessages.EMPLOYEE_NOT_FOUND });
      }

      return res
        .status(201)
        .json({ message: responseMessages.EMPLOYEE_UPDATED });
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
 * Middleware array that contains employee info deletion logic.
 *
 * @memberof module:src/controllers/employee
 * @type {Array<Object>}
 * @property {ValidationChain[]} employeeDeletionRules - Express validation rules for employee info deletion.
 * @property {Function} anonymousAsyncFunction - Handles employee info deletion requests and responses.
 */
const deleteEmployeeInfo = [
  ...employeeDeletionRules(),
  async (req, res) => {
    const expressErrors = validator.validationResult(req);
    if (!expressErrors.isEmpty()) {
      const errorMessage = expressErrors.array().map((err) => ({
        message: err.msg,
      }));

      return res.status(400).json({ errors: errorMessage });
    }

    try {
      const { id } = req.body;
      const idAsObjectId = new mongoose.Types.ObjectId(id);
      const deletedEmployeeInfo = await Employee.findByIdAndDelete(
        idAsObjectId
      );

      if (deletedEmployeeInfo === null) {
        return res
          .status(404)
          .json({ message: responseMessages.EMPLOYEE_NOT_FOUND });
      }

      return res.status(204).json({});
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

module.exports = { registerEmployee, updateEmployeeInfo, deleteEmployeeInfo };
