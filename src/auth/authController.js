/**
 * Auth controller functions.
 * @module src/auth/authController
 */

require("dotenv").config();
const validator = require("express-validator");
const authMessages = require("./authResponseMessages");
const responseMessages = require("../resources/responseMessages");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/user.model");
const Role = require("../models/role.model");
const {
  ADMIN_GROUP,
  ASSISTANT_GROUP,
  GENERAL_GROUP,
} = require("./credentialGroups");
const {
  userLoginRules,
  headerValidationRules,
} = require("./authValidationRules");

/**
 * Middleware array that contains user login logic.
 *
 * @memberof module:src/auth/authController
 * @type {Array<Object>}
 * @property {ValidationChain[]} userLoginRules - Express validation rules for user login.
 * @property {Function} anonymousAsyncFunction - Handles user login requests and responses.
 */
const loginUser = [
  ...userLoginRules(),
  async (req, res) => {
    const expressErrors = validator.validationResult(req);
    if (!expressErrors.isEmpty()) {
      const errorMsg = expressErrors.array().map((err) => ({
        message: err.msg,
      }));

      return res.status(400).json({ errors: errorMsg });
    }

    try {
      const { username, password } = req.body;

      const user = await User.findOne({ username: username });
      if (user === null) {
        return res.status(401).json({ message: authMessages.AUTH_FAILED });
      }

      const role = await Role.findOne({ employeeId: user.employeeId });
      if (role === null) {
        return res.status(401).json({ message: authMessages.AUTH_FAILED });
      }

      const passwordMatch = await bcrypt.compare(password, user.password);
      if (!passwordMatch) {
        return res.status(401).json({ message: authMessages.AUTH_FAILED });
      }

      let token;
      let payload;
      switch (role.role) {
        case ADMIN_GROUP:
          token = jwt.sign({ username: username }, process.env.ADMIN_KEY, {
            expiresIn: "1h",
          });
          payload = { token: token, group: ADMIN_GROUP };
          break;
        case ASSISTANT_GROUP:
          token = jwt.sign({ username: username }, process.env.ASSISTANT_KEY, {
            expiresIn: "1h",
          });
          payload = { token: token, group: ASSISTANT_GROUP };
          break;
        case GENERAL_GROUP:
          token = jwt.sign({ username: username }, process.env.GENERAL_KEY, {
            expiresIn: "1h",
          });
          payload = { token: token, group: GENERAL_GROUP };
          break;
      }

      res.status(200).json(payload);

      /*eslint-disable no-unused-vars*/
    } catch (err) {
      /*eslint-enable no-unused-vars*/
      return res
        .status(500)
        .json({ message: responseMessages.INTERNAL_SERVER_ERROR });
    }
  },
];

/**
 * Middleware array that contains admin token validation logic.
 *
 * @memberof module:src/auth/authController
 * @type {Array<Object>}
 * @property {ValidationChain[]} headerValidationRules - Express validation rules for admin token validation.
 * @property {Function} anonymousAsyncFunction - Handles admin token validation processes.
 */
const verifyAdminToken = [
  ...headerValidationRules(),
  async (req, res, next) => {
    const expressErrors = validator.validationResult(req);
    if (!expressErrors.isEmpty()) {
      const errorMsg = expressErrors.array().map((err) => ({
        message: err.msg,
      }));

      return res.status(400).json({ errors: errorMsg });
    }

    try {
      const token = req.headers.authorization;
      const decoded = jwt.verify(
        token.replace("Bearer ", ""),
        process.env.ADMIN_KEY
      );
      req.body.username = decoded.username;
      next();
      /*eslint-disable no-unused-vars*/
    } catch (err) {
      /*eslint-enable no-unused-vars*/
      return res.status(401).json({ message: authMessages.TOKEN_INVALID });
    }
  },
];

/**
 * Middleware array that contains assistant token validation logic.
 *
 * @memberof module:src/auth/authController
 * @type {Array<Object>}
 * @property {ValidationChain[]} headerValidationRules - Express validation rules for assistant token validation.
 * @property {Function} anonymousAsyncFunction - Handles assistant token validation processes.
 */
const verifyAssistantToken = [
  ...headerValidationRules(),
  async (req, res, next) => {
    const expressErrors = validator.validationResult(req);
    if (!expressErrors.isEmpty()) {
      const errorMsg = expressErrors.array().map((err) => ({
        message: err.msg,
      }));

      return res.status(400).json({ errors: errorMsg });
    }

    try {
      const token = req.headers.authorization;
      const decoded = jwt.verify(
        token.replace("Bearer ", ""),
        process.env.ASSISTANT_KEY
      );
      req.body.username = decoded.username;
      next();
      /*eslint-disable no-unused-vars*/
    } catch (err) {
      /*eslint-enable no-unused-vars*/
      return res.status(401).json({ message: authMessages.TOKEN_INVALID });
    }
  },
];

/**
 * Middleware array that contains general token validation logic.
 *
 * @memberof module:src/auth/authController
 * @type {Array<Object>}
 * @property {ValidationChain[]} headerValidationRules - Express validation rules for general token validation.
 * @property {Function} anonymousAsyncFunction - Handles general token validation processes.
 */
const verifyGeneralToken = [
  ...headerValidationRules(),
  async (req, res, next) => {
    const expressErrors = validator.validationResult(req);
    if (!expressErrors.isEmpty()) {
      const errorMsg = expressErrors.array().map((err) => ({
        message: err.msg,
      }));

      return res.status(400).json({ errors: errorMsg });
    }

    try {
      const token = req.headers.authorization;
      const decoded = jwt.verify(
        token.replace("Bearer ", ""),
        process.env.GENERAL_KEY
      );
      req.body.username = decoded.username;
      next();
      /*eslint-disable no-unused-vars*/
    } catch (err) {
      /*eslint-enable no-unused-vars*/
      return res.status(401).json({ message: authMessages.TOKEN_INVALID });
    }
  },
];

module.exports = {
  loginUser,
  verifyAdminToken,
  verifyAssistantToken,
  verifyGeneralToken,
};
