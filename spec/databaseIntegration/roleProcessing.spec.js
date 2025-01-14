const Role = require("../../src/models/role.model");
const mongoose = require("mongoose");
const {
  createRole,
  updateRole,
  deleteRole,
} = require("../../src/controllers/role.controller");
const responseMessages = require("../../src/resources/responseMessages");
require("dotenv").config();

describe("Role processing integration test(s)", () => {
  let req, res, next;

  const input = {
    employeeId: new mongoose.Types.ObjectId("67853f5d30e8c20b48bff6e0"),
    role: "general",
  };

  beforeAll(() => {
    mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true });
  });

  beforeEach(() => {
    res = {
      status: jasmine.createSpy("status").and.callFake(() => {
        return res;
      }),
      json: jasmine.createSpy("json"),
    };
    next = jasmine.createSpy("next");
  });

  afterEach(async () => {
    res.status.calls.reset();
    res.json.calls.reset();
    next.calls.reset();
    await Role.deleteMany({});
  });

  afterAll(async () => {
    await mongoose.connection.close();
  });

  it("role added (201)", async () => {
    req = {
      body: input,
    };

    for (let middleware of createRole) {
      await middleware(req, res, next);
    }

    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith({
      message: responseMessages.ROLE_CREATED,
    });
  });

  it("role updated (201)", async () => {
    const role = new Role(input);
    const roleToUpdate = await role.save();

    req = {
      body: {
        employeeId: roleToUpdate.employeeId,
        role: "assistant",
      },
    };

    for (let middleware of updateRole) {
      await middleware(req, res, next);
    }

    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith({
      message: responseMessages.ROLE_UPDATED,
    });
  });

  it("role deleted (204)", async () => {
    const role = new Role(input);
    const roleToDelete = await role.save();

    req = {
      body: {
        employeeId: roleToDelete.employeeId,
      },
    };

    for (let middleware of deleteRole) {
      await middleware(req, res, next);
    }

    expect(res.status).toHaveBeenCalledWith(204);
  });
});
