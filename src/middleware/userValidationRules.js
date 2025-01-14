/**
 * Express validation rules for user registration.
 * @module src/middleware/userValidationRules
 */

const { check } = require("express-validator");
const userValidationMessages = require("../resources/userValidationMessages");
const { PASSWORD_REGEX } = require("../resources/validationRegExp");

/**
 * Returns a validation chain for user registration.
 * @memberof module:src/middleware/userValidationRules
 * @returns {ValidationChain[]} - Validation chain
 */
const userRegistrationRules = () => {
  return [
    check("username")
      .notEmpty()
      .withMessage(userValidationMessages.USERNAME_REQUIRED),
    check("email")
      .notEmpty()
      .withMessage(userValidationMessages.EMAIL_REQUIRED),
    check("password")
      .notEmpty()
      .withMessage(userValidationMessages.PASSWORD_REQUIRED)
      .isLength({ min: 7 })
      .withMessage(userValidationMessages.PASSWORD_MIN_LENGTH)
      .matches(PASSWORD_REGEX)
      .withMessage(userValidationMessages.PASSWORD_MUST_HAVE_CHARACTERS),
  ];
};

module.exports = { userRegistrationRules };
