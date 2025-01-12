/**
 * User model unit tests.
 */

const User = require("../../src/models/user.model");
const Employee = require("../../src/models/employee.model");
const userValidationMessages = require("../../src/resources/userValidationMessages");

describe("User model unit test:", () => {
  const validInput = {
    username: "newUser",
    email: "random@mail.com",
    password: "5W]L8t1m4@PcTTO",
    role: "assistant",
  };

  beforeEach(() => {
    spyOn(User.prototype, "save");
    spyOn(Employee, "findOne").and.resolveTo({});
  });

  afterEach(() => {
    User.prototype.save.calls.reset();
    Employee.findOne.calls.reset();
  });

  it("has valid inputs", () => {
    const newUser = new User(validInput);
    const err = newUser.validateSync();

    expect(err).toBeUndefined();
  });

  it("has too short username", () => {
    const newUser = new User(validInput);
    newUser.username = "ab";
    const err = newUser.validateSync();

    expect(err.errors.username).toBeDefined();
    expect(err.errors.username.message).toEqual(
      userValidationMessages.USERNAME_MIN_LENGTH
    );
  });

  it("has too long username", () => {
    const newUser = new User(validInput);
    newUser.username = "thisIsAVeryLongUsernameToTest";
    const err = newUser.validateSync();

    expect(err.errors.username).toBeDefined();
    expect(err.errors.username.message).toEqual(
      userValidationMessages.USERNAME_MAX_LENGTH
    );
  });

  const emailInvalidCases = [
    ["has invalid email: no prefix", "@mail.com"],
    ["has invalid email: no @", "randommail.com"],
    ["has invalid email: no domain name", "random@.com"],
    ["has invalid email: no .", "random@mailcom"],
    ["has invalid email: no top level domain", "random@mail."],
  ];

  emailInvalidCases.forEach(([testName, invalidEmail]) => {
    it(testName, () => {
      const newUser = new User(validInput);
      newUser.email = invalidEmail;
      const err = newUser.validateSync();

      expect(err.errors.email).toBeDefined();
      expect(err.errors.email.message).toEqual(
        userValidationMessages.EMAIL_INVALID
      );
    });
  });

  it("has invalid role", () => {
    const newUser = new User(validInput);
    newUser.role = "retired";
    const err = newUser.validateSync();

    expect(err.errors.role).toBeDefined();
    expect(err.errors.role.message).toEqual(
      userValidationMessages.ROLE_INVALID
    );
  });

  it("has invalid username and role", () => {
    const newUser = new User(validInput);
    newUser.username = "ab";
    newUser.role = "retired";
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
