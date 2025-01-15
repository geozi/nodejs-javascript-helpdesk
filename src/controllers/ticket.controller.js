/**
 * Ticket controller.
 * @module src/controllers/ticket
 */

const mongoose = require("mongoose");
const validator = require("express-validator");
const Ticket = require("../models/ticket.model");
const responseMessages = require("../resources/responseMessages");
const {
  ticketRetrievalByIdRules,
  ticketGroupRetrievalByUsernameRules,
  ticketAdditionRules,
  ticketUpdateRules,
  ticketDeletionRules,
} = require("../middleware/ticketValidationRules");

/**
 * Middleware array that contains id-based ticket retrieval logic.
 *
 * @memberof module:src/controllers/ticket
 * @type {Array<Object>}
 * @property {ValidationChain[]} ticketRetrievalByIdRules - Express validation rules for id-based ticket retrieval.
 * @property {Function} anonymousAsyncFunction - Handles id-based ticket retrieval requests and responses.
 */
const retrieveTicketById = [
  ...ticketRetrievalByIdRules(),
  async (req, res) => {
    const expressErrors = validator.validationResult(req);
    if (!expressErrors.isEmpty()) {
      const errorMessage = expressErrors.array().map((err) => ({
        message: err.msg,
      }));

      return res.status(400).json({ errors: errorMessage });
    }

    try {
      const { id } = req.body;
      const idAsObjectId = new mongoose.Types.ObjectId(id);
      const ticket = await Ticket.findById(idAsObjectId);
      if (ticket === null) {
        return res
          .status(404)
          .json({ message: responseMessages.TICKET_NOT_FOUND });
      }

      return res.status(200).json({ data: ticket });
    } catch (err) {
      if (err.name === "ValidationError") {
        const mongooseErrors = Object.values(err.errors).map((e) => ({
          message: e.message,
        }));

        return res.status(400).json({ errors: mongooseErrors });
      }
      return res
        .status(500)
        .json({ message: responseMessages.INTERNAL_SERVER_ERROR });
    }
  },
];

/**
 * Middleware array that contains username-based retrieval of tickets.
 *
 * @memberof module:src/controllers/ticket
 * @type {Array<Object>}
 * @property {ValidationChain[]} ticketGroupRetrievalByUsernameRules - Express validation rules for username-based retrieval of tickets.
 * @property {Function} anonymousAsyncFunction - Handles username-based ticket retrieval requests and responses.
 */
const retrieveTicketsByUsername = [
  ...ticketGroupRetrievalByUsernameRules(),
  async (req, res) => {
    const expressErrors = validator.validationResult(req);
    if (!expressErrors.isEmpty()) {
      const errorMessage = expressErrors.array().map((err) => ({
        message: err.msg,
      }));

      return res.status(400).json({ errors: errorMessage });
    }

    try {
      const { username } = req.body;
      const tickets = await Ticket.find({ username: username });
      if (tickets.length === 0) {
        return res
          .status(404)
          .json({ message: responseMessages.TICKET_GROUP_NOT_FOUND });
      }

      return res.status(200).json({ data: tickets });
    } catch (err) {
      if (err.name === "ValidationError") {
        const mongooseErrors = Object.values(err.errors).map((e) => ({
          message: e.message,
        }));

        return res.status(400).json({ errors: mongooseErrors });
      }
      return res
        .status(500)
        .json({ message: responseMessages.INTERNAL_SERVER_ERROR });
    }
  },
];

/**
 * Middleware array that contains ticket addition logic.
 *
 * @memberof module:src/controllers/ticket
 * @type {Array<Object>}
 * @property {ValidationChain[]} ticketAdditionRules - Express validation rules for ticket addition.
 * @property {Function} anonymousAsyncFunction - Handles ticket addition requests and responses.
 */
const addTicket = [
  ...ticketAdditionRules(),
  async (req, res) => {
    const expressErrors = validator.validationResult(req);
    if (!expressErrors.isEmpty()) {
      const errorMessage = expressErrors.array().map((err) => ({
        message: err.msg,
      }));

      return res.status(400).json({ errors: errorMessage });
    }

    try {
      const { title, description, status, progressNote, username } = req.body;
      const newTicket = new Ticket({
        title: title,
        description: description,
        status: status,
        progressNote: progressNote,
        username: username,
      });

      await newTicket.save();
      res.status(201).json({ message: responseMessages.TICKET_ADDED });
    } catch (err) {
      if (err.name === "ValidationError") {
        const mongooseErrors = Object.values(err.errors).map((e) => ({
          message: e.message,
        }));

        return res.status(400).json({ errors: mongooseErrors });
      }
      return res
        .status(500)
        .json({ message: responseMessages.INTERNAL_SERVER_ERROR });
    }
  },
];

/**
 * Middleware array that contains ticket update logic.
 *
 * @memberof module:src/controllers/ticket
 * @type {Array<Object>}
 * @property {ValidationChain[]} ticketUpdateRules - Express validation rules for ticket updates.
 * @property {Function} anonymousAsyncFunction - Handles ticket update requests and responses.
 */
const updateTicket = [
  ...ticketUpdateRules(),
  async (req, res) => {
    const expressErrors = validator.validationResult(req);
    if (!expressErrors.isEmpty()) {
      const errorMessage = expressErrors.array().map((err) => ({
        message: err.msg,
      }));

      console.log(errorMessage);
      return res.status(400).json({ errors: errorMessage });
    }

    try {
      const { id, title, description, status, progressNote, username } =
        req.body;
      const idAsObjectId = new mongoose.Types.ObjectId(id);

      const ticketToUpdate = {
        title: title,
        description: description,
        status: status,
        progressNote: progressNote,
        username: username,
      };

      const updatedTicket = await Ticket.findByIdAndUpdate(
        idAsObjectId,
        ticketToUpdate,
        {
          new: true,
          runValidators: true,
          context: "query",
        }
      );

      if (updatedTicket === null) {
        return res
          .status(404)
          .json({ message: responseMessages.TICKET_NOT_FOUND });
      }

      return res.status(201).json({ message: responseMessages.TICKET_UPDATED });
    } catch (err) {
      if (err.name === "ValidationError") {
        const mongooseErrors = Object.values(err.errors).map((e) => ({
          message: e.message,
        }));

        return res.status(400).json({ errors: mongooseErrors });
      }
      return res
        .status(500)
        .json({ message: responseMessages.INTERNAL_SERVER_ERROR });
    }
  },
];

/**
 * Middleware array that contains ticket deletion logic.
 *
 * @memberof module:src/controllers/ticket
 * @type {Array<Object>}
 * @property {ValidationChain[]} ticketDeletionRules - Express validation rules for ticket deletions.
 * @property {Function} anonymousAsyncFunction - Handles ticket deletion requests and responses.
 */
const deleteTicket = [
  ...ticketDeletionRules(),
  async (req, res) => {
    const expressErrors = validator.validationResult(req);
    if (!expressErrors.isEmpty()) {
      const errorMessage = expressErrors.array().map((err) => ({
        message: err.msg,
      }));

      console.log(errorMessage);
      return res.status(400).json({ errors: errorMessage });
    }

    try {
      const { id } = req.body;
      const idAsObjectId = new mongoose.Types.ObjectId(id);
      const deletedTicket = await Ticket.findByIdAndDelete(idAsObjectId);

      if (deletedTicket === null) {
        return res
          .status(404)
          .json({ message: responseMessages.TICKET_NOT_FOUND });
      }

      res.status(204).json({});
    } catch (err) {
      if (err.name === "ValidationError") {
        const mongooseErrors = Object.values(err.errors).map((e) => ({
          message: e.message,
        }));

        return res.status(400).json({ errors: mongooseErrors });
      }
      return res
        .status(500)
        .json({ message: responseMessages.INTERNAL_SERVER_ERROR });
    }
  },
];

module.exports = {
  retrieveTicketById,
  retrieveTicketsByUsername,
  addTicket,
  updateTicket,
  deleteTicket,
};
