const Employee = require("../../src/models/employee.model");
const employeeValidationMessages = require("../../src/resources/employeeValidationMessages");
const {
  deleteEmployeeInfo,
} = require("../../src/controllers/employee.controller");

describe("Employee info deletion integration test", () => {
  let req, res, next;

  const input = {
    id: "67710722913928977aa04ea0",
  };

  beforeEach(() => {
    res = {
      status: jasmine.createSpy("status").and.callFake(() => {
        return res;
      }),
      json: jasmine.createSpy("json"),
    };
    next = jasmine.createSpy("next");
    Employee.findByIdAndDelete = jasmine
      .createSpy("findByIdAndDelete")
      .and.resolveTo({});
  });

  afterEach(() => {
    res.status.calls.reset();
    res.json.calls.reset();
    next.calls.reset();
    Employee.findByIdAndDelete.calls.reset();
  });

  describe("employee info deleted (204)", () => {
    it("id is valid", async () => {
      let validInput = { ...input };
      req = { body: validInput };

      for (let middleware of deleteEmployeeInfo) {
        await middleware(req, res, next);
      }

      expect(Employee.findByIdAndDelete.calls.count()).toEqual(1);
      expect(res.status).toHaveBeenCalledWith(204);
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

        for (let middleware of deleteEmployeeInfo) {
          await middleware(req, res, next);
        }

        expect(Employee.findByIdAndDelete.calls.count()).toEqual(0);
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

        for (let middleware of deleteEmployeeInfo) {
          await middleware(req, res, next);
        }

        expect(Employee.findByIdAndDelete.calls.count()).toEqual(0);
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

        for (let middleware of deleteEmployeeInfo) {
          await middleware(req, res, next);
        }

        expect(Employee.findByIdAndDelete.calls.count()).toEqual(0);
        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({
          errors: [{ message: employeeValidationMessages.EMP_ID_INVALID }],
        });
      });
    });

    it("req is undefined", async () => {
      req = undefined;

      try {
        for (let middleware of deleteEmployeeInfo) {
          await middleware(req, res, next);
        }
      } catch (err) {
        expect(err).toEqual(jasmine.any(TypeError));
      }
    });

    it("req is null", async () => {
      req = null;

      try {
        for (let middleware of deleteEmployeeInfo) {
          await middleware(req, res, next);
        }
      } catch (err) {
        expect(err).toEqual(jasmine.any(TypeError));
      }
    });
  });
});
