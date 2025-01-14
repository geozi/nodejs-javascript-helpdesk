const User = require("../../src/models/user.model");
const Role = require("../../src/models/role.model");
const { loginUser } = require("../../src/auth/authController");
const authResponses = require("../../src/auth/authResponseMessages");
const userValidationMessages = require("../../src/resources/userValidationMessages");

describe("Failed assistant login integration test(s)", () => {
  let req, res, next;

  const input = {
    username: "proUser",
    password: "W;Vj(+C8Sgqo'_4",
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

  describe("bad request (400)", () => {
    const userNameRequiredCases = [
      ["username is undefined", undefined],
      ["username is null", null],
    ];

    userNameRequiredCases.forEach(([testName, missingUsername]) => {
      it(testName, async () => {
        let validInput = { ...input };
        req = { body: validInput };
        req.body.username = missingUsername;

        for (let middleware of loginUser) {
          await middleware(req, res, next);
        }

        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({
          errors: [{ message: userValidationMessages.USERNAME_REQUIRED }],
        });
      });
    });

    const passwordRequiredCases = [
      ["password is undefined", undefined],
      ["password is null", null],
    ];

    passwordRequiredCases.forEach(([testName, missingPassword]) => {
      it(testName, async () => {
        let validInput = { ...input };
        req = { body: validInput };
        req.body.password = missingPassword;

        for (let middleware of loginUser) {
          await middleware(req, res, next);
        }

        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({
          errors: [
            { message: userValidationMessages.PASSWORD_REQUIRED },
            { message: userValidationMessages.PASSWORD_MIN_LENGTH },
            { message: userValidationMessages.PASSWORD_MUST_HAVE_CHARACTERS },
          ],
        });
      });
    });

    const passwordInvalidCases = [
      ["password has no uppercase letters", "!]i&u^^.57h3.,%"],
      ["password has no lowercase letters", "+[Q]D~~A,9CGYZ~"],
      ["password has no numbers", "Q}_MC}mdguOs!Gr"],
      ["password has no special symbols", "EyB0McqoXAOYA1Y"],
    ];

    passwordInvalidCases.forEach(([testName, invalidPassword]) => {
      it(testName, async () => {
        let validInput = { ...input };
        req = { body: validInput };
        req.body.password = invalidPassword;

        for (let middleware of loginUser) {
          await middleware(req, res, next);
        }

        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({
          errors: [
            { message: userValidationMessages.PASSWORD_MUST_HAVE_CHARACTERS },
          ],
        });
      });
    });

    it("password is too short", async () => {
      let validInput = { ...input };
      req = { body: validInput };
      req.body.password = "$b4'1A";

      for (let middleware of loginUser) {
        await middleware(req, res, next);
      }

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        errors: [{ message: userValidationMessages.PASSWORD_MIN_LENGTH }],
      });
    });

    it("with mix of undefined and null fields", async () => {
      let validInput = { ...input };
      req = { body: validInput };
      req.body.username = undefined;
      req.body.password = null;

      for (let middleware of loginUser) {
        await middleware(req, res, next);
      }

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        errors: [
          { message: userValidationMessages.USERNAME_REQUIRED },
          { message: userValidationMessages.PASSWORD_REQUIRED },
          { message: userValidationMessages.PASSWORD_MIN_LENGTH },
          { message: userValidationMessages.PASSWORD_MUST_HAVE_CHARACTERS },
        ],
      });
    });

    it("with empty request body", async () => {
      req = { body: {} };

      for (let middleware of loginUser) {
        await middleware(req, res, next);
      }

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        errors: [
          { message: userValidationMessages.USERNAME_REQUIRED },
          { message: userValidationMessages.PASSWORD_REQUIRED },
          { message: userValidationMessages.PASSWORD_MIN_LENGTH },
          { message: userValidationMessages.PASSWORD_MUST_HAVE_CHARACTERS },
        ],
      });
    });
  });

  describe("unauthorized (401)", () => {
    it("user not found", async () => {
      User.findOne = jasmine.createSpy("findOne").and.resolveTo(null);

      req = { body: input };

      for (let middleware of loginUser) {
        await middleware(req, res, next);
      }

      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith({
        message: authResponses.AUTH_FAILED,
      });
    });

    it("role not found", async () => {
      User.findOne = jasmine.createSpy("findOne").and.resolveTo({});
      Role.findOne = jasmine.createSpy("findOne").and.resolveTo(null);

      req = { body: input };

      for (let middleware of loginUser) {
        await middleware(req, res, next);
      }

      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith({
        message: authResponses.AUTH_FAILED,
      });
    });
  });
});
