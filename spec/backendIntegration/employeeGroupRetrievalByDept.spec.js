const Employee = require("../../src/models/employee.model");
const responseMessages = require("../../src/resources/responseMessages");
const employeeValidationMessages = require("../../src/resources/employeeValidationMessages");
const {
  retrieveEmployeesByDept,
} = require("../../src/controllers/employee.controller");

describe("Employee group retrieval by dept integration test", () => {
  let req, res, next;

  const input = {
    dept: "IT",
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

  it("employees found (200)", async () => {
    let validInput = { ...input };
    req = { body: validInput };
    const mockEmployees = [new Employee(), new Employee()];

    Employee.find = jasmine.createSpy("find").and.resolveTo(mockEmployees);

    for (let middleware of retrieveEmployeesByDept) {
      await middleware(req, res, next);
    }

    expect(Employee.find.calls.count()).toEqual(1);
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(
      jasmine.arrayContaining([jasmine.any(Employee)])
    );
  });

  it("employees not found (204)", async () => {
    let validInput = { ...input };
    req = { body: validInput };

    Employee.find = jasmine.createSpy("find").and.resolveTo([]);

    for (let middleware of retrieveEmployeesByDept) {
      await middleware(req, res, next);
    }

    expect(Employee.find.calls.count()).toEqual(1);
    expect(res.status).toHaveBeenCalledWith(204);
    expect(res.json).toHaveBeenCalledWith({
      message: responseMessages.EMPLOYEE_GROUP_NOT_FOUND,
    });
  });

  describe("bad request (400)", () => {
    it("dept field is missing", async () => {
      req = { body: {} };

      for (let middleware of retrieveEmployeesByDept) {
        await middleware(req, res, next);
      }

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        errors: [{ message: employeeValidationMessages.EMP_DEPT_REQUIRED }],
      });
    });

    it("req is undefined", async () => {
      req = undefined;

      try {
        for (let middleware of retrieveEmployeesByDept) {
          await middleware(req, res, next);
        }
      } catch (err) {
        expect(err).toEqual(jasmine.any(TypeError));
      }
    });

    it("req is null", async () => {
      req = null;

      try {
        for (let middleware of retrieveEmployeesByDept) {
          await middleware(req, res, next);
        }
      } catch (err) {
        expect(err).toEqual(jasmine.any(TypeError));
      }
    });
  });
});
