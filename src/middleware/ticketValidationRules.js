/**
 * Express validation rules for ticket operations.
 * @module src/middleware/ticketValidationRules
 */

const { check } = require("express-validator");
const ticketValidationMessages = require("../resources/ticketValidationMessages");
const { ID_REGEX } = require("../resources/validationRegExp");

/**
 * Returns a validation chain for ticket addition.
 * @memberof module:src/middleware/ticketValidationRules
 * @returns {ValidationChain[]} - Validation chain.
 */
const ticketAdditionRules = () => {
  return [
    check("title")
      .notEmpty()
      .withMessage(ticketValidationMessages.TICKET_TITLE_REQUIRED),
    check("description")
      .notEmpty()
      .withMessage(ticketValidationMessages.TICKET_DESCRIPTION_REQUIRED),
    check("status")
      .notEmpty()
      .withMessage(ticketValidationMessages.TICKET_STATUS_REQUIRED),
    check("progressNote").optional(),
    check("username")
      .notEmpty()
      .withMessage(ticketValidationMessages.EMPLOYEE_USERNAME_REQUIRED),
  ];
};

/**
 * Returns a validation chain for ticket update.
 * @memberof module:src/middleware/ticketValidationRules
 * @returns {ValidationChain[]} - Validation chain.
 */
const ticketUpdateRules = () => {
  return [
    check("id")
      .notEmpty()
      .withMessage(ticketValidationMessages.TICKET_ID_REQUIRED)
      .matches(ID_REGEX)
      .withMessage(ticketValidationMessages.TICKET_ID_INVALID)
      .isLength({ min: 24, max: 24 })
      .withMessage(ticketValidationMessages.TICKET_ID_LENGTH),
    check("title").optional(),
    check("description").optional(),
    check("status").optional(),
    check("progressNote").optional(),
    check("username").optional(),
  ];
};

/**
 * Returns a validation chain for ticket deletion.
 * @memberof module:src/middleware/ticketValidationRules
 * @returns {ValidationChain[]} - Validation chain.
 */
const ticketDeletionRules = () => {
  return [
    check("id")
      .notEmpty()
      .withMessage(ticketValidationMessages.TICKET_ID_REQUIRED)
      .matches(ID_REGEX)
      .withMessage(ticketValidationMessages.TICKET_ID_INVALID)
      .isLength({ min: 24, max: 24 })
      .withMessage(ticketValidationMessages.TICKET_ID_LENGTH),
  ];
};

/**
 * Returns a validation chain for id-based ticket retrieval.
 * @memberof module:src/middleware/ticketValidationRules
 * @returns {ValidationChain[]} - Validation chain.
 */
const ticketRetrievalByIdRules = () => {
  return [
    check("id")
      .notEmpty()
      .withMessage(ticketValidationMessages.TICKET_ID_REQUIRED)
      .matches(ID_REGEX)
      .withMessage(ticketValidationMessages.TICKET_ID_INVALID)
      .isLength({ min: 24, max: 24 })
      .withMessage(ticketValidationMessages.TICKET_ID_LENGTH),
  ];
};

/**
 * Returns a validation chain for username-based retrieval of tickets.
 * @memberof module:src/middleware/ticketValidationRules
 * @returns {ValidationChain[]} - Validation chain.
 */
const ticketGroupRetrievalByUsernameRules = () => {
  return [
    check("username")
      .notEmpty()
      .withMessage(ticketValidationMessages.EMPLOYEE_USERNAME_REQUIRED),
  ];
};

module.exports = {
  ticketAdditionRules,
  ticketUpdateRules,
  ticketDeletionRules,
  ticketRetrievalByIdRules,
  ticketGroupRetrievalByUsernameRules,
};
