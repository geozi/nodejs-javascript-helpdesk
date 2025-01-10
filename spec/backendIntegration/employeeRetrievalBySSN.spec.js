const Employee = require("../../src/models/employee.model");
const responseMessages = require("../../src/resources/responseMessages");
const employeeValidationMessages = require("../../src/resources/employeeValidationMessages");
const {
  retrieveEmployeeBySsn,
} = require("../../src/controllers/employee.controller");

describe("Employee retrieval by ssn integration test", () => {
  let req, res, next;

  const input = {
    ssn: "382-37-6150",
  };

  beforeEach(() => {
    res = {
      status: jasmine.createSpy("status").and.callFake(() => {
        return res;
      }),
      json: jasmine.createSpy("json"),
    };
    next = jasmine.createSpy("next");
  });

  afterEach(() => {
    res.status.calls.reset();
    res.json.calls.reset();
    next.calls.reset();
  });

  it("found (200)", async () => {
    let validInput = { ...input };
    req = { body: validInput };

    Employee.findOne = jasmine
      .createSpy("findOne")
      .and.resolveTo(jasmine.any(Employee));

    for (let middleware of retrieveEmployeeBySsn) {
      await middleware(req, res, next);
    }

    expect(Employee.findOne.calls.count()).toEqual(1);
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(jasmine.any(Employee));
  });

  it("not found (204)", async () => {
    let validInput = { ...input };
    req = { body: validInput };

    Employee.findOne = jasmine.createSpy("findOne").and.resolveTo(null);

    for (let middleware of retrieveEmployeeBySsn) {
      await middleware(req, res, next);
    }

    expect(Employee.findOne.calls.count()).toEqual(1);
    expect(res.status).toHaveBeenCalledWith(204);
    expect(res.json).toHaveBeenCalledWith({
      message: responseMessages.EMPLOYEE_NOT_FOUND,
    });
  });

  describe("bad request (400)", () => {
    it("ssn field is missing", async () => {
      req = { body: {} };

      for (let middleware of retrieveEmployeeBySsn) {
        await middleware(req, res, next);
      }

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        errors: [{ message: employeeValidationMessages.EMP_SSN_REQUIRED }],
      });
    });

    it("req is undefined", async () => {
      req = undefined;

      try {
        for (let middleware of retrieveEmployeeBySsn) {
          await middleware(req, res, next);
        }
      } catch (err) {
        expect(err).toEqual(jasmine.any(TypeError));
      }
    });

    it("req is null", async () => {
      req = null;

      try {
        for (let middleware of retrieveEmployeeBySsn) {
          await middleware(req, res, next);
        }
      } catch (err) {
        expect(err).toEqual(jasmine.any(TypeError));
      }
    });
  });
});
