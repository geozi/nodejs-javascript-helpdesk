const User = require("../../src/models/user.model");
const Employee = require("../../src/models/employee.model");
const mongoose = require("mongoose");
const { registerUser } = require("../../src/controllers/user.controller");
const { loginUser } = require("../../src/auth/authController");
require("dotenv").config();
jasmine.DEFAULT_TIMEOUT_INTERVAL = 40000;

describe("Auth processing integration test(s)", () => {
  let req, res, next;

  const validUsername = "proUser";
  const validEmail = "email@random.com";
  const validPassword = "Dg2&ysPrc3Lol4o";
  const validRole = "general";

  beforeAll(async () => {
    mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true });
  });

  afterAll(async () => {
    await User.deleteMany({});
    await mongoose.connection.close();
  });

  beforeEach(async () => {
    res = {
      status: jasmine.createSpy("status").and.callFake(() => {
        return res;
      }),
      json: jasmine.createSpy("json"),
    };
    next = jasmine.createSpy("next");
    Employee.findOne = jasmine.createSpy("findOne").and.resolveTo({});

    const createTestUserReq = {
      body: {
        username: validUsername,
        email: validEmail,
        password: validPassword,
        role: validRole,
      },
    };

    for (let middleware of registerUser) {
      await middleware(createTestUserReq, res, next);
    }
  });

  afterEach(() => {
    res.status.calls.reset();
    res.json.calls.reset();
    next.calls.reset();
    Employee.findOne.calls.reset();
  });

  it("logged in (201)", async () => {
    req = {
      body: {
        username: validUsername,
        password: validPassword,
      },
    };

    for (let middleware of loginUser) {
      await middleware(req, res, next);
    }

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(
      jasmine.objectContaining({ token: jasmine.any(String) })
    );
  });
});
