/**
 * Employee routes.
 * @module src/routes/employee
 */
const express = require("express");
const employeeRouter = express.Router();
const { registerEmployee } = require("../controllers/employee.controller");

/**
 * @swagger
 * /api/register:
 *   post:
 *     summary: User registration
 *     tags: [Employees]
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
 *               - firstName
 *               - lastName
 *               - email
 *               - phoneNumber
 *               - ssn
 *               - city
 *               - streetAddress
 *               - zipCode
 *               - dept
 *               - title
 *             properties:
 *               firstName:
 *                 type: string
 *                 description: The first name of the employee.
 *               lastName:
 *                 type: string
 *                 description: The last name of the employee.
 *               email:
 *                 type: string
 *                 description: The email of the employee.
 *               phoneNumber:
 *                 type: string
 *                 description: The phone number of the employee.
 *               ssn:
 *                 type: string
 *                 description: The ssn of the employee.
 *               city:
 *                 type: string
 *                 description: The city where the employee currently lives.
 *               streetAddress:
 *                 type: string
 *                 description: The street address of the employee.
 *               zipCode:
 *                 type: string
 *                 description: The zip code for the street address.
 *               dept:
 *                 type: string
 *                 description: The department the employee belongs to.
 *               title:
 *                 type: string
 *                 description: The job title of the employee.
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
 *         description: Successful employee registration.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Confirmation message.
 *                 employeeId:
 *                   type: string
 *                   description: The ID of the employee record.
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
employeeRouter.post("/", registerEmployee);

module.exports = { employeeRouter };
