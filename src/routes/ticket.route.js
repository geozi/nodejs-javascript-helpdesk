/**
 * Ticket routes.
 * @module src/routes/ticket
 */
const express = require("express");
const ticketRouter = express.Router();
const {
  retrieveTicketById,
  retrieveTicketsByUsername,
  addTicket,
  updateTicket,
  deleteTicket,
} = require("../controllers/ticket.controller");
const {
  verifyAssistantToken,
  verifyGeneralToken,
} = require("../auth/authController");

/**
 * @swagger
 * /api/tickets:
 *   get:
 *     summary: Ticket retrieval by ID.
 *     tags: [Tickets]
 *     parameters:
 *       - in: path
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - id
 *             properties:
 *               id:
 *                 type: string
 *                 description: The ID of the ticket.
 *     responses:
 *       400:
 *         description: Bad request.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 errors:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       message:
 *                         type: string
 *                         description: Error messages.
 *       200:
 *         description: Successful ticket retrieval by ID.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: object
 *                   description: The retrieved ticket.
 *       404:
 *         description: Ticket not found.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Ticket not found message.
 *       500:
 *         description: Internal server error.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Error message.
 */
ticketRouter.get("/", verifyAssistantToken, retrieveTicketById);

/**
 * @swagger
 * /api/tickets/username:
 *   get:
 *     summary: Retrieval of tickets by username.
 *     tags: [Tickets]
 *     parameters:
 *       - in: path
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - username
 *             properties:
 *               username:
 *                 type: string
 *                 description: The username of the employee opening the ticket.
 *     responses:
 *       400:
 *         description: Bad request.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 errors:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       message:
 *                         type: string
 *                         description: Error messages.
 *       200:
 *         description: Successful retrieval of tickets by username.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     description: A retrieved ticket.
 *       404:
 *         description: Tickets not found.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Tickets not found message.
 *       500:
 *         description: Internal server error.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Error message.
 */
ticketRouter.get("/username", verifyGeneralToken, retrieveTicketsByUsername);

/**
 * @swagger
 * /api/tickets:
 *   post:
 *     summary: Ticket addition.
 *     tags: [Tickets]
 *     parameters:
 *       - in: path
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *               - description
 *               - status
 *               - username
 *             properties:
 *               title:
 *                 type: string
 *                 description: The title/subject of the ticket.
 *               description:
 *                 type: string
 *                 description: The description of the ticket.
 *               status:
 *                 type: string
 *                 description: The status of the ticket.
 *               progressNote:
 *                 type: string
 *                 description: Assistant comments on ticket progress.
 *               username:
 *                 type: string
 *                 description: The username of the employee opening the ticket.
 *     responses:
 *       400:
 *         description: Bad request.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 errors:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       message:
 *                         type: string
 *                         description: Error messages.
 *       201:
 *         description: Successful ticket addition.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Ticket addition confirmation message.
 *       500:
 *         description: Internal server error.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Error message.
 */
ticketRouter.post("/", verifyGeneralToken, addTicket);

/**
 * @swagger
 * /api/tickets:
 *   put:
 *     summary: Ticket update.
 *     tags: [Tickets]
 *     parameters:
 *       - in: path
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - id
 *             properties:
 *               id:
 *                 type: string
 *                 description: The ID of the ticket.
 *               title:
 *                 type: string
 *                 description: The title/subject of the ticket.
 *               description:
 *                 type: string
 *                 description: The description of the ticket.
 *               status:
 *                 type: string
 *                 description: The status of the ticket.
 *               progressNote:
 *                 type: string
 *                 description: Assistant comments on ticket progress.
 *               username:
 *                 type: string
 *                 description: The username of the employee opening the ticket.
 *     responses:
 *       400:
 *         description: Bad request.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 errors:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       message:
 *                         type: string
 *                         description: Error messages.
 *       404:
 *         description: Role not found.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Role not found message.
 *       201:
 *         description: Role updated.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Role update confirmation message.
 *       500:
 *         description: Internal server error.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Error message.
 */
ticketRouter.put("/", verifyAssistantToken, updateTicket);

/**
 * @swagger
 * /api/tickets:
 *   delete:
 *     summary: Ticket deletion
 *     tags: [Tickets]
 *     parameters:
 *       - in: path
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - id
 *             properties:
 *               id:
 *                 type: string
 *                 description: The ID of the ticket.
 *     responses:
 *       400:
 *         description: Bad request.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 errors:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       message:
 *                         type: string
 *                         description: Error messages.
 *       404:
 *         description: Ticket not found.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Ticket not found message.
 *       204:
 *         description: Ticket deleted.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *       500:
 *         description: Internal server error.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Error message.
 */
ticketRouter.delete("/", verifyAssistantToken, deleteTicket);

module.exports = { ticketRouter };
