/**
 * Express validation rules for role operations.
 * @module src/middleware/roleValidationRules
 */
const { check } = require("express-validator");
const employeeValidationMessages = require("../resources/employeeValidationMessages");
const roleValidationMessages = require("../resources/roleValidationMessages");
const { ID_REGEX } = require("../resources/validationRegExp");

/**
 * Returns a validation chain for role creation.
 * @memberof module:src/middleware/roleValidationRules
 * @returns {ValidationChain[]} - Validation chain.
 */
const roleCreationRules = () => {
  return [
    check("employeeId")
      .notEmpty()
      .withMessage(employeeValidationMessages.EMP_ID_REQUIRED)
      .matches(ID_REGEX)
      .withMessage(employeeValidationMessages.EMP_ID_INVALID)
      .isLength({ min: 24, max: 24 })
      .withMessage(employeeValidationMessages.EMP_ID_LENGTH),
    check("role").notEmpty().withMessage(roleValidationMessages.ROLE_REQUIRED),
  ];
};

/**
 * Returns a validation chain for role update.
 * @memberof module:src/middleware/roleValidationRules
 * @returns {ValidationChain[]} - Validation chain.
 */
const roleUpdateRules = () => {
  return [
    check("employeeId")
      .notEmpty()
      .withMessage(employeeValidationMessages.EMP_ID_REQUIRED)
      .matches(ID_REGEX)
      .withMessage(employeeValidationMessages.EMP_ID_INVALID)
      .isLength({ min: 24, max: 24 })
      .withMessage(employeeValidationMessages.EMP_ID_LENGTH),
    check("role").optional(),
  ];
};

/**
 * Returns a validation chain for role deletion.
 * @memberof module:src/middleware/roleValidationRules
 * @returns {ValidationChain[]} - Validation chain.
 */
const roleDeleteRules = () => {
  return [
    check("employeeId")
      .notEmpty()
      .withMessage(employeeValidationMessages.EMP_ID_REQUIRED)
      .matches(ID_REGEX)
      .withMessage(employeeValidationMessages.EMP_ID_INVALID)
      .isLength({ min: 24, max: 24 })
      .withMessage(employeeValidationMessages.EMP_ID_LENGTH),
  ];
};

module.exports = { roleCreationRules, roleUpdateRules, roleDeleteRules };
