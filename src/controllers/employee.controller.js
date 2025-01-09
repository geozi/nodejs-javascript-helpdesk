/**
 * Employee controller.
 * @module src/controllers/employee
 */

const validator = require("express-validator");
const Employee = require("../models/employee.model");
const responseMessages = require("../resources/responseMessages");
const {
  employeeRegistrationRules,
} = require("../middleware/employeeValidationRules");

/**
 * Middleware array that contains employee registration logic.
 *
 * @memberof module:src/controllers/employee
 * @type {Array<Function>}
 * @property {Array<Function>} employeeRegistrationRules - Express validation rules for employee registration.
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

module.exports = { registerEmployee };
