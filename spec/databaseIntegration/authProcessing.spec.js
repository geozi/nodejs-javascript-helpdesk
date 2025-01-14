const User = require("../../src/models/user.model");
const Employee = require("../../src/models/employee.model");
const Role = require("../../src/models/role.model");
const mongoose = require("mongoose");
const { loginUser } = require("../../src/auth/authController");
const bcrypt = require("bcryptjs");
require("dotenv").config();
jasmine.DEFAULT_TIMEOUT_INTERVAL = 40000;

describe("Auth processing integration test(s)", () => {
  let req, res, next;

  const validUsername = "proUser";
  const validPassword = "Dg2&ysPrc3Lol4o";
  const validEmail = "m.g.bailey@aol.com";
  const employee = new Employee({
    firstName: "Mary",
    lastName: "Bailey",
    email: validEmail,
    phoneNumber: "907-945-8849",
    ssn: "940-42-2746",
    city: "Gambrills",
    streetAddress: "292 5th Street North",
    zipCode: "21054",
    dept: "Business Development",
    title: "Junior Analyst",
  });

  beforeAll(async () => {
    mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true });
  });

  afterAll(async () => {
    await User.deleteMany({});
    await Role.deleteMany({});
    await Employee.deleteMany({});
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

    const savedEmployee = await employee.save();
    const employeeRole = new Role({
      employeeId: savedEmployee._id,
      role: "assistant",
    });
    const hashedPassword = await bcrypt.hash(validPassword, 10);
    const employeeUserProfile = new User({
      username: validUsername,
      email: validEmail,
      password: hashedPassword,
      employeeId: savedEmployee._id,
    });

    await employeeRole.save();
    await employeeUserProfile.save();
  });

  afterEach(() => {
    res.status.calls.reset();
    res.json.calls.reset();
    next.calls.reset();
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
