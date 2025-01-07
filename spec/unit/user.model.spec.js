/**
 * User model unit tests.
 */

const User = require("../../src/models/user.model");
const userValidationMessages = require("../../src/resources/userValidationMessages");

describe("User model unit test:", () => {
  const validUsername = "newUser";
  const validEmail = "random@mail.com";
  const validPassword = "5W]L8t1m4@PcTTO";
  const validRole = "assistant";

  beforeEach(() => {
    spyOn(User.prototype, "save");
  });

  afterEach(() => {
    User.prototype.save.calls.reset();
  });

  it("has valid inputs", () => {
    const newUser = new User({
      username: validUsername,
      email: validEmail,
      password: validPassword,
      role: validRole,
    });

    const err = newUser.validateSync();

    expect(err).toBeUndefined();
  });

  it("has too short username", () => {
    const newUser = new User({
      username: "ab",
      email: validEmail,
      password: validPassword,
      role: validRole,
    });

    const err = newUser.validateSync();

    expect(err.errors.username).toBeDefined();
    expect(err.errors.username.message).toEqual(
      userValidationMessages.USERNAME_MIN_LENGTH
    );
  });

  it("has too long username", () => {
    const newUser = new User({
      username: "thisIsAVeryLongUsernameToTest",
      email: validEmail,
      password: validPassword,
      role: validRole,
    });

    const err = newUser.validateSync();

    expect(err.errors.username).toBeDefined();
    expect(err.errors.username.message).toEqual(
      userValidationMessages.USERNAME_MAX_LENGTH
    );
  });

  const emailInvalidCases = [
    [
      "has invalid email: no prefix",
      {
        username: validUsername,
        email: "@mail.com",
        password: validPassword,
        role: validRole,
      },
    ],
    [
      "has invalid email: no @",
      {
        username: validUsername,
        email: "randommail.com",
        password: validPassword,
        role: validRole,
      },
    ],
    [
      "has invalid email: no domain name",
      {
        username: validUsername,
        email: "random@.com",
        password: validPassword,
        role: validRole,
      },
    ],
    [
      "has invalid email: no .",
      {
        username: validUsername,
        email: "random@mailcom",
        password: validPassword,
        role: validRole,
      },
    ],
    [
      "has invalid email: no top level domain",
      {
        username: validUsername,
        email: "random@mail.",
        password: validPassword,
        role: validRole,
      },
    ],
  ];

  emailInvalidCases.forEach(([testName, input]) => {
    it(testName, () => {
      const newUser = new User(input);
      const err = newUser.validateSync();

      expect(err.errors.email).toBeDefined();
      expect(err.errors.email.message).toEqual(
        userValidationMessages.EMAIL_INVALID
      );
    });
  });

  it("has invalid role", () => {
    const newUser = new User({
      username: validUsername,
      email: validEmail,
      password: validPassword,
      role: "retired",
    });

    const err = newUser.validateSync();

    expect(err.errors.role).toBeDefined();
    expect(err.errors.role.message).toEqual(
      userValidationMessages.ROLE_INVALID
    );
  });

  it("has invalid username and role", () => {
    const newUser = new User({
      username: "ab",
      email: validEmail,
      password: validPassword,
      role: "retired",
    });

    const err = newUser.validateSync();

    expect(Object.keys(err.errors).length).toEqual(2);
    expect(Object.keys(err.errors).sort()).toEqual(["role", "username"]);
    expect(err.errors.username.message).toEqual(
      userValidationMessages.USERNAME_MIN_LENGTH
    );

    expect(err.errors.role.message).toEqual(
      userValidationMessages.ROLE_INVALID
    );
  });
});
