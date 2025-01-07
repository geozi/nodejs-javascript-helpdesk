/**
 * Regular expressions for validation processes.
 * @module src/resources/validationRegExp
 */

const EMAIL_REGEX = new RegExp(
  /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
);

module.exports = { EMAIL_REGEX };
