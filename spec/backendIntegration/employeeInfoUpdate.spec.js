const Employee = require("../../src/models/employee.model");
const responseMessages = require("../../src/resources/responseMessages");
const employeeValidationMessages = require("../../src/resources/employeeValidationMessages");
const {
  updateEmployeeInfo,
} = require("../../src/controllers/employee.controller");

describe("Employee update integration test", () => {
  let req, res, next;

  const input = {
    id: "67710722913928977aa04ea0",
    firstName: "Grace",
    lastName: "Clark",
    email: "gclark2@rocketmail.com",
    phoneNumber: "504-557-9967",
    ssn: "278-01-1926",
    city: "Maxwell",
    streetAddress: "36 Spring Street",
    zipCode: "95955",
    dept: "Marketing",
    title: "Product rep",
  };

  beforeEach(() => {
    res = {
      status: jasmine.createSpy("status").and.callFake(() => {
        return res;
      }),
      json: jasmine.createSpy("json"),
    };
    next = jasmine.createSpy("next");
    Employee.findByIdAndUpdate = jasmine
      .createSpy("findByIdAndUpdate")
      .and.resolveTo({});
  });

  afterEach(() => {
    res.status.calls.reset();
    res.json.calls.reset();
    next.calls.reset();
    Employee.findByIdAndUpdate.calls.reset();
  });

  describe("employee updated (201)", () => {
    const updatedEmployeeCases = [
      ["has only id", { id: input.id }],
      ["has valid fields", input],
    ];

    updatedEmployeeCases.forEach(([testName, validInput]) => {
      it(testName, async () => {
        req = { body: validInput };

        for (let middleware of updateEmployeeInfo) {
          await middleware(req, res, next);
        }

        expect(Employee.findByIdAndUpdate.calls.count()).toEqual(1);
        expect(res.status).toHaveBeenCalledWith(201);
        expect(res.json).toHaveBeenCalledWith({
          message: responseMessages.EMPLOYEE_UPDATED,
        });
      });
    });

    it("has some undefined and null fields", async () => {
      let validInput = { ...input };
      req = { body: validInput };
      req.body.lastName = undefined;
      req.body.phoneNumber = undefined;
      req.body.title = null;

      for (let middleware of updateEmployeeInfo) {
        await middleware(req, res, next);
      }

      expect(Employee.findByIdAndUpdate.calls.count()).toEqual(1);
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith({
        message: responseMessages.EMPLOYEE_UPDATED,
      });
    });
  });

  describe("bad request (400)", () => {
    const idRequiredCases = [
      ["id is undefined", undefined],
      ["id is null", null],
    ];

    idRequiredCases.forEach(([testName, missingId]) => {
      it(testName, async () => {
        let validInput = { ...input };
        req = { body: validInput };
        req.body.id = missingId;

        for (let middleware of updateEmployeeInfo) {
          await middleware(req, res, next);
        }

        expect(Employee.findByIdAndUpdate.calls.count()).toEqual(0);
        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({
          errors: [
            { message: employeeValidationMessages.EMP_ID_REQUIRED },
            { message: employeeValidationMessages.EMP_ID_INVALID },
            { message: employeeValidationMessages.EMP_ID_LENGTH },
          ],
        });
      });
    });

    const idLengthCases = [
      ["id is too short", "67710722913928977"],
      ["id is too long", "67710722913928977aa04ea067710722913928977aa04ea0"],
    ];

    idLengthCases.forEach(([testName, invalidId]) => {
      it(testName, async () => {
        let validInput = { ...input };
        req = { body: validInput };
        req.body.id = invalidId;

        for (let middleware of updateEmployeeInfo) {
          await middleware(req, res, next);
        }

        expect(Employee.findByIdAndUpdate.calls.count()).toEqual(0);
        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({
          errors: [{ message: employeeValidationMessages.EMP_ID_LENGTH }],
        });
      });
    });

    const idInvalidCases = [
      ["id contains special symbols", "67*db12ed*29a1*ed143e37e"],
      ["id contains white spaces", "6771 722 13928977aa04ea0"],
      ["id contains capital letters", "67710722913928977AA04ea0"],
    ];

    idInvalidCases.forEach(([testName, invalidId]) => {
      it(testName, async () => {
        let validInput = { ...input };
        req = { body: validInput };
        req.body.id = invalidId;

        for (let middleware of updateEmployeeInfo) {
          await middleware(req, res, next);
        }

        expect(Employee.findByIdAndUpdate.calls.count()).toEqual(0);
        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({
          errors: [{ message: employeeValidationMessages.EMP_ID_INVALID }],
        });
      });
    });

    it("has an undefined req", async () => {
      req = undefined;

      try {
        for (let middleware of updateEmployeeInfo) {
          await middleware(req, res, next);
        }
      } catch (err) {
        expect(err).toEqual(jasmine.any(TypeError));
      }
    });

    it("has a null req", async () => {
      req = null;

      try {
        for (let middleware of updateEmployeeInfo) {
          await middleware(req, res, next);
        }
      } catch (err) {
        expect(err).toEqual(jasmine.any(TypeError));
      }
    });
  });
});
