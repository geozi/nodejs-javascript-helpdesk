const Employee = require("../../src/models/employee.model");
const mongoose = require("mongoose");
const {
  registerEmployee,
  updateEmployeeInfo,
  deleteEmployeeInfo,
} = require("../../src/controllers/employee.controller");
const responseMessages = require("../../src/resources/responseMessages");
require("dotenv").config();
jasmine.DEFAULT_TIMEOUT_INTERVAL = 20000;

describe("Employee processing integration test(s)", () => {
  let req, res, next;

  const input = {
    firstName: "Gabriel",
    lastName: "Price",
    email: "gtprice35@yahoo.com",
    phoneNumber: "352-059-6936",
    ssn: "382-37-6150",
    city: "Maxwell",
    streetAddress: "36 Spring Street",
    zipCode: "95955",
    title: "Developer",
    dept: "IT",
  };

  beforeAll(async () => {
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
    await Employee.deleteMany({});
  });

  afterAll(async () => {
    await mongoose.connection.close();
  });

  it("employee added (201)", async () => {
    req = {
      body: input,
    };

    for (let middleware of registerEmployee) {
      await middleware(req, res, next);
    }

    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith({
      message: responseMessages.EMPLOYEE_REGISTERED,
    });
  });

  it("employee updated (201)", async () => {
    const employee = new Employee(input);
    await employee.save();
    const employeeToUpdate = await Employee.findOne({
      email: input.email,
    });

    const req = {
      body: {
        id: employeeToUpdate._id.toString(),
        city: "Athens",
      },
    };

    for (let middleware of updateEmployeeInfo) {
      await middleware(req, res, next);
    }

    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith({
      message: responseMessages.EMPLOYEE_UPDATED,
    });
  });

  it("employee info deleted (204)", async () => {
    const employee = new Employee(input);
    await employee.save();
    const employeeToDelete = await Employee.findOne({
      email: input.email,
    });

    const req = {
      body: {
        id: employeeToDelete._id.toString(),
      },
    };

    for (let middleware of deleteEmployeeInfo) {
      await middleware(req, res, next);
    }

    expect(res.status).toHaveBeenCalledWith(204);
  });
});
