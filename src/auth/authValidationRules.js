/**
 * Validation rules for authentication requests.
 * @module src/auth/authValidationRules
 */

const { check, header } = require("express-validator");
const userValidationMessages = require("../resources/userValidationMessages");
const { PASSWORD_REGEX } = require("../resources/validationRegExp");
const authMessages = require("./authResponseMessages");

/**
 * Returns a validation chain for user login.
 * @memberof module:src/auth/authValidationRules
 * @returns {ValidationChain[]} - Validation chain.
 */
const userLoginRules = () => {
  return [
    check("username")
      .notEmpty()
      .withMessage(userValidationMessages.USERNAME_REQUIRED),
    check("password")
      .notEmpty()
      .withMessage(userValidationMessages.PASSWORD_REQUIRED)
      .isLength({ min: 7 })
      .withMessage(userValidationMessages.PASSWORD_MIN_LENGTH)
      .matches(PASSWORD_REGEX)
      .withMessage(userValidationMessages.PASSWORD_MUST_HAVE_CHARACTERS),
  ];
};

/** Returns a validation chain for header validation.
 * @memberof module:src/auth/authValidationRules
 * @returns {ValidationChain[]} - Validation chain.
 */
const headerValidationRules = () => {
  return [
    header("Authorization")
      .notEmpty()
      .withMessage(authMessages.AUTH_HEADER_REQUIRED),
  ];
};

module.exports = { userLoginRules, headerValidationRules };
