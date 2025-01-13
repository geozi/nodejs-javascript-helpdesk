const Role = require("../../src/models/role.model");
const responseMessages = require("../../src/resources/responseMessages");
const { createRole } = require("../../src/controllers/role.controller");
const employeeValidationMessages = require("../../src/resources/employeeValidationMessages");
const roleValidationMessages = require("../../src/resources/roleValidationMessages");

describe("Role creation integration test", () => {
  let req, res, next;

  const input = {
    employeeId: "678544f103dac5e1a1b8485c",
    role: "assistant",
  };

  beforeEach(() => {
    res = {
      status: jasmine.createSpy("status").and.callFake(() => {
        return res;
      }),
      json: jasmine.createSpy("json"),
    };
    next = jasmine.createSpy("next");
    Role.prototype.save = jasmine.createSpy("save").and.resolveTo({});
  });

  afterEach(() => {
    res.status.calls.reset();
    res.json.calls.reset();
    next.calls.reset();
    Role.prototype.save.calls.reset();
  });

  describe("role created (201)", () => {
    it("with valid fields", async () => {
      let validInput = { ...input };
      req = { body: validInput };

      for (let middleware of createRole) {
        await middleware(req, res, next);
      }

      expect(Role.prototype.save.calls.count()).toEqual(1);
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith({
        message: responseMessages.ROLE_CREATED,
      });
    });
  });

  describe("bad request (400)", () => {
    const employeeIdRequiredCases = [
      ["employeeId is undefined", undefined],
      ["employeeId is null", null],
    ];

    employeeIdRequiredCases.forEach(([testName, missingEmployeeId]) => {
      it(testName, async () => {
        let validInput = { ...input };
        req = { body: validInput };
        req.body.employeeId = missingEmployeeId;

        for (let middleware of createRole) {
          await middleware(req, res, next);
        }

        expect(Role.prototype.save.calls.count()).toEqual(0);
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

    const employeeIdInvalidCases = [
      ["employeeId contains special symbols", "67*db12ed*29a1*ed143e37e"],
      ["employeeId contains white spaces", "6771 722 13928977aa04ea0"],
      ["employeeId contains capital letters", "67710722913928977AA04ea0"],
    ];

    employeeIdInvalidCases.forEach(([testName, invalidEmployeeId]) => {
      it(testName, async () => {
        let validInput = { ...input };
        req = { body: validInput };
        req.body.employeeId = invalidEmployeeId;

        for (let middleware of createRole) {
          await middleware(req, res, next);
        }

        expect(Role.prototype.save.calls.count()).toEqual(0);
        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({
          errors: [{ message: employeeValidationMessages.EMP_ID_INVALID }],
        });
      });
    });

    const roleRequiredCases = [
      ["role is undefined", undefined],
      ["role is null", null],
    ];

    roleRequiredCases.forEach(([testName, missingRole]) => {
      it(testName, async () => {
        let validInput = { ...input };
        req = { body: validInput };
        req.body.role = missingRole;

        for (let middleware of createRole) {
          await middleware(req, res, next);
        }

        expect(Role.prototype.save.calls.count()).toEqual(0);
        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({
          errors: [{ message: roleValidationMessages.ROLE_REQUIRED }],
        });
      });
    });

    it("req is undefined", async () => {
      req = undefined;

      try {
        for (let middleware of createRole) {
          await middleware(req, res, next);
        }
      } catch (err) {
        expect(err).toEqual(jasmine.any(TypeError));
      }
    });

    it("req is null", async () => {
      req = null;

      try {
        for (let middleware of createRole) {
          await middleware(req, res, next);
        }
      } catch (err) {
        expect(err).toEqual(jasmine.any(TypeError));
      }
    });
  });
});
