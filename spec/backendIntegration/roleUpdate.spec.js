const Role = require("../../src/models/role.model");
const responseMessages = require("../../src/resources/responseMessages");
const employeeValidationMessages = require("../../src/resources/employeeValidationMessages");
const { updateRole } = require("../../src/controllers/role.controller");

describe("Role update integration test", () => {
  let req, res, next;

  const input = {
    employeeId: "67710722913928977aa04ea0",
    role: "general",
  };

  beforeEach(() => {
    res = {
      status: jasmine.createSpy("status").and.callFake(() => {
        return res;
      }),
      json: jasmine.createSpy("json"),
    };
    next = jasmine.createSpy("next");
    Role.findOneAndUpdate = jasmine
      .createSpy("findOneAndUpdate")
      .and.resolveTo({});
  });

  afterEach(() => {
    res.status.calls.reset();
    res.json.calls.reset();
    next.calls.reset();
    Role.findOneAndUpdate.calls.reset();
  });

  describe("role updated (201)", () => {
    const updatedRoleCases = [
      ["has only employeeId", { employeeId: input.employeeId }],
      ["has all valid fields", input],
    ];

    updatedRoleCases.forEach(([testName, validInput]) => {
      it(testName, async () => {
        req = { body: validInput };

        for (let middleware of updateRole) {
          await middleware(req, res, next);
        }

        expect(Role.findOneAndUpdate.calls.count()).toEqual(1);
        expect(res.status).toHaveBeenCalledWith(201);
        expect(res.json).toHaveBeenCalledWith({
          message: responseMessages.ROLE_UPDATED,
        });
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

        for (let middleware of updateRole) {
          await middleware(req, res, next);
        }

        expect(Role.findOneAndUpdate.calls.count()).toEqual(0);
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

    const employeeIdLengthCases = [
      ["employeeId is too short", "67710722913928977"],
      [
        "employeeId is too long",
        "67710722913928977aa04ea067710722913928977aa04ea0",
      ],
    ];

    employeeIdLengthCases.forEach(([testName, invalidEmployeeId]) => {
      it(testName, async () => {
        let validInput = { ...input };
        req = { body: validInput };
        req.body.employeeId = invalidEmployeeId;

        for (let middleware of updateRole) {
          await middleware(req, res, next);
        }

        expect(Role.findOneAndUpdate.calls.count()).toEqual(0);
        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({
          errors: [{ message: employeeValidationMessages.EMP_ID_LENGTH }],
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

        for (let middleware of updateRole) {
          await middleware(req, res, next);
        }

        expect(Role.findOneAndUpdate.calls.count()).toEqual(0);
        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({
          errors: [{ message: employeeValidationMessages.EMP_ID_INVALID }],
        });
      });
    });

    it("req is undefined", async () => {
      req = undefined;

      try {
        for (let middleware of updateRole) {
          await middleware(req, res, next);
        }
      } catch (err) {
        expect(err).toEqual(jasmine.any(TypeError));
      }
    });

    it("req is null", async () => {
      req = null;

      try {
        for (let middleware of updateRole) {
          await middleware(req, res, next);
        }
      } catch (err) {
        expect(err).toEqual(jasmine.any(TypeError));
      }
    });
  });
});
