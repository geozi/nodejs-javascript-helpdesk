/**
 * Ticket validation error messages.
 * @module src/resources/ticketValidationMessages
 */

module.exports = {
  TICKET_TITLE_REQUIRED: "Ticket title is a required field",
  TICKET_TITLE_MAX_LENGTH:
    "Ticket title must be no longer than 80 characters long",
  TICKET_TITLE_MIN_LENGTH: "Ticket title must be at least 5 characters long",
  TICKET_DESCRIPTION_REQUIRED: "Ticket description is a required field",
  TICKET_DESCRIPTION_MAX_LENGTH:
    "Ticket description must be no longer than 300 characters long",
  TICKET_DESCRIPTION_MIN_LENGTH:
    "Ticket description must be at least 15 characters long",
  TICKET_STATUS_REQUIRED: "Ticket status is a required field",
  TICKET_STATUS_INVALID: `
  **Ticket status must be one of the following:**
  - **Pending**,
  - **Complete**
  `,
  EMPLOYEE_USERNAME_REQUIRED: "Employee username is a required field",
};
