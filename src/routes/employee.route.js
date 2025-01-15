/**
 * Employee routes.
 * @module src/routes/employee
 */
const express = require("express");
const employeeRouter = express.Router();
const {
  registerEmployee,
  updateEmployeeInfo,
  deleteEmployeeInfo,
  retrieveEmployeeByEmail,
  retrieveEmployeeBySsn,
  retrieveEmployeesByCity,
  retrieveEmployeesByDept,
  retrieveEmployeesByTitle,
} = require("../controllers/employee.controller");
const { verifyAdminToken } = require("../../src/auth/authController");

/**
 * @swagger
 * /api/employees:
 *   post:
 *     summary: Employee registration.
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
 *                   description: Successful registration confirmation message.
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
employeeRouter.post("/", verifyAdminToken, registerEmployee);

/**
 * @swagger
 * /api/employees:
 *   put:
 *     summary: Employee information update.
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
 *               - id
 *             properties:
 *               id:
 *                 type: string
 *                 description: The ID of the employee  record.
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
 *       404:
 *         description: Employee record not found.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Employee record not found message.
 *       201:
 *         description: Successful employee update.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Successful update confirmation message.
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
employeeRouter.put("/", verifyAdminToken, updateEmployeeInfo);

/**
 * @swagger
 * /api/employees:
 *   delete:
 *     summary: Employee information deletion.
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
 *               - id
 *             properties:
 *               id:
 *                 type: string
 *                 description: The ID of the employee  record.
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
 *       204:
 *         description: Successful deletion of employee information.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *       404:
 *         description: Employee record not found.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Employee record not found message.
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
employeeRouter.delete("/", verifyAdminToken, deleteEmployeeInfo);

/**
 * @swagger
 * /api/employees/email:
 *   get:
 *     summary: Employee record retrieval by email.
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
 *               - email
 *             properties:
 *               email:
 *                 type: string
 *                 description: The email of the employee
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
 *         description: Employee record not found.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Employee record not found message.
 *       200:
 *         description: Successful employee retrieval by email.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: object
 *                   description: The retrieved employee record.
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
employeeRouter.get("/email", verifyAdminToken, retrieveEmployeeByEmail);

/**
 * @swagger
 * /api/employees/ssn:
 *   get:
 *     summary: Employee record retrieval by SSN.
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
 *               - ssn
 *             properties:
 *               ssn:
 *                 type: string
 *                 description: The SSN of the employee.
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
 *         description: Employee record not found.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Employee record not found message.
 *       200:
 *         description: Successful employee retrieval by SSN.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: object
 *                   description: The retrieved employee record.
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
employeeRouter.get("/ssn", verifyAdminToken, retrieveEmployeeBySsn);

/**
 * @swagger
 * /api/employees/city:
 *   get:
 *     summary: Retrieval of Employee records by city.
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
 *               - city
 *             properties:
 *               city:
 *                 type: string
 *                 description: The city where an employee resides.
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
 *         description: Employee records not found.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Employee records not found message.
 *       200:
 *         description: Successful retrieval of employee records by city.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     description: A retrieved employee record.
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
employeeRouter.get("/city", verifyAdminToken, retrieveEmployeesByCity);

/**
 * @swagger
 * /api/employees/dept:
 *   get:
 *     summary: Retrieval of Employee records by department.
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
 *               - dept
 *             properties:
 *               dept:
 *                 type: string
 *                 description: The department an employee belongs to.
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
 *         description: Employee records not found.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Employee records not found message.
 *       200:
 *         description: Successful retrieval of employee records by department.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     description: A retrieved employee record.
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
employeeRouter.get("/dept", verifyAdminToken, retrieveEmployeesByDept);

/**
 * @swagger
 * /api/employees/title:
 *   get:
 *     summary: Retrieval of Employee records by title.
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
 *               - title
 *             properties:
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
 *       404:
 *         description: Employee records not found.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Employee records not found message.
 *       200:
 *         description: Successful retrieval of employee records by title.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     description: A retrieved employee record.
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
employeeRouter.get("/title", verifyAdminToken, retrieveEmployeesByTitle);

module.exports = { employeeRouter };
