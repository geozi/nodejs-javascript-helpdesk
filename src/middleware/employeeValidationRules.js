/**
 * Express validation rules for employee operations
 * @module src/middleware/employeeValidationRules
 */

const { check } = require("express-validator");
const employeeValidationMessages = require("../resources/employeeValidationMessages");

const employeeRegistrationRules = () => {
  return [
    check("firstName")
      .notEmpty()
      .withMessage(employeeValidationMessages.EMP_FIRST_NAME_REQUIRED),
    check("lastName")
      .notEmpty()
      .withMessage(employeeValidationMessages.EMP_LAST_NAME_REQUIRED),
    check("email")
      .notEmpty()
      .withMessage(employeeValidationMessages.EMP_EMAIL_REQUIRED),
    check("phoneNumber")
      .notEmpty()
      .withMessage(employeeValidationMessages.EMP_PHONE_NUMBER_REQUIRED),
    check("ssn")
      .notEmpty()
      .withMessage(employeeValidationMessages.EMP_SSN_REQUIRED),
    check("city")
      .notEmpty()
      .withMessage(employeeValidationMessages.EMP_CITY_REQUIRED),
    check("streetAddress")
      .notEmpty()
      .withMessage(employeeValidationMessages.EMP_STREET_ADDRESS_REQUIRED),
    check("zipCode")
      .notEmpty()
      .withMessage(employeeValidationMessages.EMP_ZIP_CODE_REQUIRED),
    check("dept")
      .notEmpty()
      .withMessage(employeeValidationMessages.EMP_DEPT_REQUIRED),
    check("title")
      .notEmpty()
      .withMessage(employeeValidationMessages.EMP_TITLE_REQUIRED),
  ];
};

module.exports = { employeeRegistrationRules };
