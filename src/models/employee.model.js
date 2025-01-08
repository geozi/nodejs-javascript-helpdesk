/**
 * Employee schema.
 * @module src/models/employee
 */

const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const uniqueValidator = require("mongoose-unique-validator");
const {
  EMAIL_REGEX,
  NAME_REGEX,
  PHONE_SSN_REGEX,
  CITY_REGEX,
  ZIP_CODE_REGEX,
  EMP_TITLE_REGEX,
} = require("../resources/validationRegExp");
const employeeValidationMessages = require("../resources/employeeValidationMessages");

/**
 * Employee schema for persistence in MongoDB.
 *
 * @memberof module:src/models/employee
 * @type {mongoose.Schema<Employee>}
 * @typedef {Object} Employee
 * @property {String} firstName - The first name of the employee
 * @property {String} lastName - The last name of the employee
 * @property {String} email - The email of the employee
 * @property {String} phoneNumber - The phone number of the employee
 * @property {String} ssn - The SSN of the employee
 * @property {String} city - The city of the employee
 * @property {String} streetAddress - The street address of the employee
 * @property {String} zipCode - The zip code of the employee
 * @property {String} dept - The department of the employee
 * @property {String} title - The job title of the employee
 */
const employeeSchema = new Schema(
  {
    firstName: {
      type: String,
      required: [true, employeeValidationMessages.EMP_FIRST_NAME_REQUIRED],
      match: [NAME_REGEX, employeeValidationMessages.EMP_FIRST_NAME_INVALID],
      trim: true,
    },
    lastName: {
      type: String,
      required: [true, employeeValidationMessages.EMP_LAST_NAME_REQUIRED],
      match: [NAME_REGEX, employeeValidationMessages.EMP_LAST_NAME_INVALID],
      trim: true,
    },
    email: {
      type: String,
      required: [true, employeeValidationMessages.EMP_EMAIL_REQUIRED],
      unique: [true, employeeValidationMessages.EMP_EMAIL_UNIQUE],
      match: [EMAIL_REGEX, employeeValidationMessages.EMP_EMAIL_INVALID],
      trim: true,
      lowercase: true,
    },
    phoneNumber: {
      type: String,
      required: [true, employeeValidationMessages.EMP_PHONE_NUMBER_REQUIRED],
      match: [
        PHONE_SSN_REGEX,
        employeeValidationMessages.EMP_PHONE_NUMBER_INVALID,
      ],
      trim: true,
    },
    ssn: {
      type: String,
      required: [true, employeeValidationMessages.EMP_SSN_REQUIRED],
      unique: [true, employeeValidationMessages.EMP_SSN_UNIQUE],
      match: [PHONE_SSN_REGEX, employeeValidationMessages.EMP_SSN_INVALID],
      trim: true,
    },
    city: {
      type: String,
      required: [true, employeeValidationMessages.EMP_CITY_REQUIRED],
      match: [CITY_REGEX, employeeValidationMessages.EMP_CITY_INVALID],
      trim: true,
    },
    streetAddress: {
      type: String,
      required: [true, employeeValidationMessages.EMP_STREET_ADDRESS_REQUIRED],
      trim: true,
    },
    zipCode: {
      type: String,
      required: [true, employeeValidationMessages.EMP_ZIP_CODE_REQUIRED],
      match: [ZIP_CODE_REGEX, employeeValidationMessages.EMP_ZIP_CODE_INVALID],
      trim: true,
    },
    dept: {
      type: String,
      required: [true, employeeValidationMessages.EMP_DEPT_REQUIRED],
      enum: {
        values: [
          "Accounting & Finance",
          "Business Development",
          "Human Resources",
          "IT",
          "Legal",
          "Marketing",
          "Quality Assurance",
        ],
        message: employeeValidationMessages.EMP_DEPT_INVALID,
      },
    },
    title: {
      type: String,
      required: [true, employeeValidationMessages.EMP_TITLE_REQUIRED],
      match: [EMP_TITLE_REGEX, employeeValidationMessages.EMP_TITLE_INVALID],
      trim: true,
    },
  },
  {
    collection: "employees",
    timestamps: true,
  }
);

employeeSchema.plugin(uniqueValidator);
module.exports = mongoose.model("Employee", employeeSchema);
