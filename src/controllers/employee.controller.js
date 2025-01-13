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
  employeeRetrievalByEmailRules,
  employeeRetrievalBySSNRules,
  employeeGroupRetrievalByCityRules,
  employeeGroupRetrievalByDeptRules,
  employeeGroupRetrievalByTitleRules,
} = require("../middleware/employeeValidationRules");

/**
 * Middleware array that contains email-based employee retrieval logic.
 *
 * @memberof module:src/controllers/employee
 * @type {Array<Object>}
 * @property {ValidationChain[]} employeeRetrievalByEmailRules - Express validation rules for email-based employee retrieval.
 * @property {Function} anonymousAsyncFunction - Handles email-based employee retrieval requests and responses.
 */
const retrieveEmployeeByEmail = [
  ...employeeRetrievalByEmailRules(),
  async (req, res) => {
    const expressErrors = validator.validationResult(req);
    if (!expressErrors.isEmpty()) {
      const errorMessage = expressErrors.array().map((err) => ({
        message: err.msg,
      }));

      return res.status(400).json({ errors: errorMessage });
    }

    try {
      const { email } = req.body;
      const employee = await Employee.findOne({ email: email });

      if (employee === null) {
        return res
          .status(204)
          .json({ message: responseMessages.EMPLOYEE_NOT_FOUND });
      }

      res.status(200).json(employee);
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
 * Middleware array that contains SSN-based employee retrieval logic.
 *
 * @memberof module:src/controllers/employee
 * @type {Array<Object>}
 * @property {ValidationChain[]} employeeRetrievalBySSNRules - Express validation rules for ssn-based employee retrieval.
 * @property {Function} anonymousAsyncFunction - Handles ssn-based employee retrieval requests and responses.
 */
const retrieveEmployeeBySsn = [
  ...employeeRetrievalBySSNRules(),
  async (req, res) => {
    const expressErrors = validator.validationResult(req);
    if (!expressErrors.isEmpty()) {
      const errorMessage = expressErrors.array().map((err) => ({
        message: err.msg,
      }));

      return res.status(400).json({ errors: errorMessage });
    }

    try {
      const { ssn } = req.body;
      const employee = await Employee.findOne({ ssn: ssn });

      if (employee === null) {
        return res
          .status(204)
          .json({ message: responseMessages.EMPLOYEE_NOT_FOUND });
      }

      return res.status(200).json(employee);
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
 * Middleware array that contains city-based employee group retrieval logic.
 *
 * @memberof module:src/controllers/employee
 * @type {Array<Object>}
 * @property {ValidationChain[]} employeeGroupRetrievalByCityRules - Express validation rules for city-based employee-group retrieval.
 * @property {Function} anonymousAsyncFunction - Handles city-based employee group retrieval requests and responses.
 */
const retrieveEmployeesByCity = [
  ...employeeGroupRetrievalByCityRules(),
  async (req, res) => {
    const expressErrors = validator.validationResult(req);
    if (!expressErrors.isEmpty()) {
      const errorMessage = expressErrors.array().map((err) => ({
        message: err.msg,
      }));

      return res.status(400).json({ errors: errorMessage });
    }

    try {
      const { city } = req.body;
      const employees = await Employee.find({ city: city });

      if (employees.length === 0) {
        return res
          .status(204)
          .json({ message: responseMessages.EMPLOYEE_GROUP_NOT_FOUND });
      }
      return res.status(200).json(employees);
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
 * Middleware array that contains dept-based employee group retrieval logic.
 *
 * @memberof module:src/controllers/employee
 * @type {Array<Object>}
 * @property {ValidationChain[]} employeeGroupRetrievalByDeptRules - Express validation rules for debt-based employee-group retrieval.
 * @property {Function} anonymousAsyncFunction - Handles debt-based employee group retrieval requests and responses.
 */
const retrieveEmployeesByDept = [
  ...employeeGroupRetrievalByDeptRules(),
  async (req, res) => {
    const expressErrors = validator.validationResult(req);
    if (!expressErrors.isEmpty()) {
      const errorMessage = expressErrors.array().map((err) => ({
        message: err.msg,
      }));

      return res.status(400).json({ errors: errorMessage });
    }

    try {
      const { dept } = req.body;
      const employees = await Employee.find({ dept: dept });

      if (employees.length === 0) {
        return res
          .status(204)
          .json({ message: responseMessages.EMPLOYEE_GROUP_NOT_FOUND });
      }
      return res.status(200).json(employees);
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
 * Middleware array that contains title-based employee group retrieval logic.
 *
 * @memberof module:src/controllers/employee
 * @type {Array<Object>}
 * @property {ValidationChain[]} employeeGroupRetrievalByTitleRules - Express validation rules for title-based employee-group retrieval.
 * @property {Function} anonymousAsyncFunction - Handles title-based employee group retrieval requests and responses.
 */
const retrieveEmployeesByTitle = [
  ...employeeGroupRetrievalByTitleRules(),
  async (req, res) => {
    const expressErrors = validator.validationResult(req);
    if (!expressErrors.isEmpty()) {
      const errorMessage = expressErrors.array().map((err) => ({
        message: err.msg,
      }));

      return res.status(400).json({ errors: errorMessage });
    }

    try {
      const { title } = req.body;
      const employees = await Employee.find({ title: title });

      if (employees.length === 0) {
        return res
          .status(204)
          .json({ message: responseMessages.EMPLOYEE_GROUP_NOT_FOUND });
      }
      return res.status(200).json(employees);
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

      const savedEmployee = await newEmployee.save();

      return res.status(201).json({
        message: responseMessages.EMPLOYEE_REGISTERED,
        id: savedEmployee._id,
      });
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

module.exports = {
  registerEmployee,
  updateEmployeeInfo,
  deleteEmployeeInfo,
  retrieveEmployeeByEmail,
  retrieveEmployeeBySsn,
  retrieveEmployeesByCity,
  retrieveEmployeesByDept,
  retrieveEmployeesByTitle,
};
