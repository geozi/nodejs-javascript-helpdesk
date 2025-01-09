/**
 * Validation rules for user registration
 * @module src/middleware/userValidationRules
 */

const { check } = require("express-validator");
const userValidationMessages = require("../resources/userValidationMessages");
const { PASSWORD_REGEX } = require("../resources/validationRegExp");

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
    check("role").notEmpty().withMessage(userValidationMessages.ROLE_REQUIRED),
  ];
};

module.exports = { userRegistrationRules };
