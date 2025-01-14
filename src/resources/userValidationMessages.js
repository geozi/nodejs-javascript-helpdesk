/**
 * User validation error messages.
 * @module src/resources/userValidationMessages
 */

module.exports = {
  EMPLOYEE_RECORD_NOT_FOUND: "Employee record was not found",
  USERNAME_REQUIRED: "Username is a required field",
  USERNAME_MAX_LENGTH: "Username must be no longer than 20 characters",
  USERNAME_MIN_LENGTH: "Username must be at least 3 characters long",
  USERNAME_UNIQUE: "Username must be unique",
  EMAIL_REQUIRED: "Email is a required field",
  EMAIL_INVALID: "Invalid email address",
  EMAIL_UNIQUE: "Email must be unique",
  PASSWORD_REQUIRED: "Password is a required field",
  PASSWORD_MIN_LENGTH: "Password must be at least 7 characters long",
  PASSWORD_MUST_HAVE_CHARACTERS:
    "Password must contain at least one lowercase character, one uppercase character, one number, and one special symbol",
};
