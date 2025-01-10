/**
 * Express validation rules for employee operations.
 * @module src/middleware/employeeValidationRules
 */

const { check } = require("express-validator");
const employeeValidationMessages = require("../resources/employeeValidationMessages");
const { ID_REGEX } = require("../resources/validationRegExp");

/**
 * Returns a validation chain for employee registration.
 * @memberof module:src/middleware/employeeValidationRules
 * @returns {ValidationChain[]} - Validation chain.
 */
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

/**
 * Returns a validation chain for employee info update.
 * @memberof module:src/middleware/employeeValidationRules
 * @returns {ValidationChain[]} - Validation chain.
 */
const employeeUpdateRules = () => {
  return [
    check("id")
      .notEmpty()
      .withMessage(employeeValidationMessages.EMP_ID_REQUIRED)
      .matches(ID_REGEX)
      .withMessage(employeeValidationMessages.EMP_ID_INVALID)
      .isLength({ min: 24, max: 24 })
      .withMessage(employeeValidationMessages.EMP_ID_LENGTH),
    check("firstName").optional(),
    check("lastName").optional(),
    check("email").optional(),
    check("phoneNumber").optional(),
    check("ssn").optional(),
    check("city").optional(),
    check("streetAddress").optional(),
    check("zipCode").optional(),
    check("dept").optional(),
    check("title").optional(),
  ];
};

/**
 * Returns a validation chain for employee info deletion.
 * @memberof module:src/middleware/employeeValidationRules
 * @returns {ValidationChain[]} - Validation chain.
 */
const employeeDeletionRules = () => {
  return [
    check("id")
      .notEmpty()
      .withMessage(employeeValidationMessages.EMP_ID_REQUIRED)
      .matches(ID_REGEX)
      .withMessage(employeeValidationMessages.EMP_ID_INVALID)
      .isLength({ min: 24, max: 24 })
      .withMessage(employeeValidationMessages.EMP_ID_LENGTH),
  ];
};

/**
 * Returns a validation chain for email-based employee retrieval.
 * @memberof module:src/middleware/employeeValidationRules
 * @returns {ValidationChain[]} - Validation chain.
 */
const employeeRetrievalByEmailRules = () => {
  return [
    check("email")
      .notEmpty()
      .withMessage(employeeValidationMessages.EMP_EMAIL_REQUIRED),
  ];
};

/**
 * Returns a validation chain for SSN-based employee retrieval.
 * @memberof module:src/middleware/employeeValidationRules
 * @returns {ValidationChain[]} - Validation chain.
 */
const employeeRetrievalBySSNRules = () => {
  return [
    check("ssn")
      .notEmpty()
      .withMessage(employeeValidationMessages.EMP_SSN_REQUIRED),
  ];
};

/**
 * Returns a validation chain for city-based retrieval of employees.
 * @memberof module:src/middleware/employeeValidationRules
 * @returns {ValidationChain[]} - Validation chain.
 */
const employeeGroupRetrievalByCity = () => {
  return [
    check("city")
      .notEmpty()
      .withMessage(employeeValidationMessages.EMP_CITY_REQUIRED),
  ];
};

/**
 * Returns a validation chain for department-based retrieval of employees.
 * @memberof module:src/middleware/employeeValidationRules
 * @returns {ValidationChain[]} - Validation chain.
 */
const employeeGroupRetrievalByDept = () => {
  return [
    check("dept")
      .notEmpty()
      .withMessage(employeeValidationMessages.EMP_DEPT_REQUIRED),
  ];
};

/**
 * Returns validation chain for title-based retrieval of employees.
 * @memberof module:src/middleware/employeeValidationRules
 * @returns {ValidationChain[]} - Validation chain.
 */
const employeeGroupRetrievalByTitle = () => {
  return [
    check("dept")
      .notEmpty()
      .withMessage(employeeValidationMessages.EMP_DEPT_REQUIRED),
  ];
};

module.exports = {
  employeeRegistrationRules,
  employeeUpdateRules,
  employeeDeletionRules,
  employeeRetrievalByEmailRules,
  employeeRetrievalBySSNRules,
  employeeGroupRetrievalByCity,
  employeeGroupRetrievalByDept,
  employeeGroupRetrievalByTitle,
};
