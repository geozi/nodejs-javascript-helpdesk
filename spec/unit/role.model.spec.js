/**
 * Role model unit tests.
 */
const mongoose = require("mongoose");
const Role = require("../../src/models/role.model");
const roleValidationMessages = require("../../src/resources/roleValidationMessages");

describe("Role model unit test:", () => {
  const validInput = {
    employeeId: new mongoose.Types.ObjectId("67853f5d30e8c20b48bff6e0"),
    role: "assistant",
  };

  beforeEach(() => {
    spyOn(Role.prototype, "save");
  });

  afterEach(() => {
    Role.prototype.save.calls.reset();
  });

  it("has valid inputs", () => {
    const newRole = new Role(validInput);
    const err = newRole.validateSync();

    expect(err).toBeUndefined();
  });

  it("role is invalid", () => {
    const newRole = new Role(validInput);
    newRole.role = "secretary";
    const err = newRole.validateSync();

    expect(err.errors.role).toBeDefined();
    expect(err.errors.role.message).toEqual(
      roleValidationMessages.ROLE_INVALID
    );
  });
});
