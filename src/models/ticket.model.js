/**
 * Ticket schema.
 * @module src/models/ticket
 */
const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const uniqueValidator = require("mongoose-unique-validator");
const ticketValidationMessages = require("../resources/ticketValidationMessages");

/**
 * Ticket schema for persistence in MongoDB.
 *
 * @memberof module:src/models/ticket
 * @type {mongoose.Schema<Ticket>}
 * @typedef {Object} Ticket
 * @property {String} title - The title of the ticket.
 * @property {String} description - The description of the ticket.
 * @property {String} status - The status of the ticket.
 * @property {String} progressNote - A note placed by the assistant charged with the ticket (optional).
 * @property {String} username - The username of the employee placing the ticket.
 */
const ticketSchema = new Schema(
  {
    title: {
      type: String,
      required: [true, ticketValidationMessages.TICKET_TITLE_REQUIRED],
      maxLength: [80, ticketValidationMessages.TICKET_TITLE_MAX_LENGTH],
      minLength: [5, ticketValidationMessages.TICKET_TITLE_MIN_LENGTH],
      trim: true,
    },
    description: {
      type: String,
      required: [true, ticketValidationMessages.TICKET_DESCRIPTION_REQUIRED],
      maxLength: [300, ticketValidationMessages.TICKET_DESCRIPTION_MAX_LENGTH],
      minLength: [15, ticketValidationMessages.TICKET_DESCRIPTION_MIN_LENGTH],
      trim: true,
    },
    status: {
      type: String,
      required: [true, ticketValidationMessages.TICKET_STATUS_REQUIRED],
      enum: {
        values: ["Pending", "Complete"],
        message: ticketValidationMessages.TICKET_STATUS_INVALID,
      },
    },
    progressNote: {
      type: String,
    },
    username: {
      type: String,
      required: [true, ticketValidationMessages.EMPLOYEE_USERNAME_REQUIRED],
    },
  },
  {
    collection: "tickets",
    timestamps: true,
  }
);

ticketSchema.plugin(uniqueValidator);
module.exports = mongoose.model("Ticket", ticketSchema);
