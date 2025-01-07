/**
 * User schema.
 * @module src/models/user
 */

const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const uniqueValidator = require("mongoose-unique-validator");
const { EMAIL_REGEX } = require("../resources/validationRegExp");
const userValidationMessages = require("../resources/userValidationMessages");

/**
 * User schema for persistence in MongoDB.
 *
 * @memberof module:src/models/user
 * @type {mongoose.Schema<User>}
 * @typedef {Object} User
 * @property {String} username - The username of the user.
 * @property {String} email - The email of the user.
 * @property {String} password -The password of the user.
 * @property {String} role - The role of the user.
 */
const userSchema = new Schema(
  {
    username: {
      type: String,
      required: [true, userValidationMessages.USERNAME_REQUIRED],
      unique: [true, userValidationMessages.USERNAME_UNIQUE],
      maxLength: [20, userValidationMessages.USERNAME_MAX_LENGTH],
      minLength: [3, userValidationMessages.USERNAME_MIN_LENGTH],
      trim: true,
    },
    email: {
      type: String,
      required: [true, userValidationMessages.EMAIL_REQUIRED],
      unique: [true, userValidationMessages.EMAIL_UNIQUE],
      match: [EMAIL_REGEX, userValidationMessages.EMAIL_INVALID],
      trim: true,
      lowercase: true,
    },
    password: {
      type: String,
      required: [true, userValidationMessages.PASSWORD_REQUIRED],
      trim: true,
    },
    role: {
      type: String,
      required: [true, userValidationMessages.ROLE_REQUIRED],
      enum: {
        values: ["admin", "assistant", "general"],
        message: userValidationMessages.ROLE_INVALID,
      },
    },
  },
  {
    collection: "users",
    timestamps: true,
  }
);

userSchema.plugin(uniqueValidator);
module.exports = mongoose.model("User", userSchema);
