const bcrypt = require("bcryptjs");
const User = require("../../src/models/user.model");
const { registerUser } = require("../../src/controllers/user.controller");
const responseMessages = require("../../src/resources/responseMessages");
const userValidationMessages = require("../../src/resources/userValidationMessages");

describe("User reg. integration test", () => {
  let req, res, next;

  const input = {
    username: "newUser",
    email: "myEmail@example.com",
    password: "lj}6L6H$=0(UgI&",
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
    User.prototype.save = jasmine.createSpy("save").and.resolveTo({});
    bcrypt.hash = jasmine.createSpy("hash").and.resolveTo("hashedPassword");
  });

  afterEach(() => {
    res.status.calls.reset();
    res.json.calls.reset();
    next.calls.reset();
    User.prototype.save.calls.reset();
    bcrypt.hash.calls.reset();
  });

  describe("registered (201)", () => {
    it("with valid fields", async () => {
      let validInput = { ...input };
      req = { body: validInput };

      for (let middleware of registerUser) {
        await middleware(req, res, next);
      }

      expect(bcrypt.hash).toHaveBeenCalledWith("lj}6L6H$=0(UgI&", 10);
      expect(User.prototype.save.calls.count()).toEqual(1);
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith({
        message: responseMessages.USER_REGISTERED,
      });
    });
  });

  describe("bad request (400):", () => {
    const usernameRequiredCases = [
      ["username is undefined", undefined],
      ["username is null", null],
    ];

    usernameRequiredCases.forEach(([testName, missingUsername]) => {
      it(testName, async () => {
        let validInput = { ...input };
        req = { body: validInput };
        req.body.username = missingUsername;

        for (let middleware of registerUser) {
          await middleware(req, res, next);
        }

        expect(User.prototype.save.calls.count()).toEqual(0);
        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({
          errors: [{ message: userValidationMessages.USERNAME_REQUIRED }],
        });
      });
    });

    const emailRequiredCases = [
      ["email is undefined", undefined],
      ["email is null", null],
    ];

    emailRequiredCases.forEach(([testName, missingEmail]) => {
      it(testName, async () => {
        let validInput = { ...input };
        req = { body: validInput };
        req.body.email = missingEmail;

        for (let middleware of registerUser) {
          await middleware(req, res, next);
        }

        expect(User.prototype.save.calls.count()).toEqual(0);
        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({
          errors: [{ message: userValidationMessages.EMAIL_REQUIRED }],
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

        for (let middleware of registerUser) {
          await middleware(req, res, next);
        }

        expect(User.prototype.save.calls.count()).toEqual(0);
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

    const roleRequiredCases = [
      ["role is undefined", undefined],
      ["role is null", null],
    ];

    roleRequiredCases.forEach(([testName, missingRole]) => {
      it(testName, async () => {
        let validInput = { ...input };
        req = { body: validInput };
        req.body.role = missingRole;

        for (let middleware of registerUser) {
          await middleware(req, res, next);
        }

        expect(User.prototype.save.calls.count()).toEqual(0);
        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({
          errors: [{ message: userValidationMessages.ROLE_REQUIRED }],
        });
      });
    });

    it("mix of undefined and null fields", async () => {
      let validInput = { ...input };
      req = { body: validInput };
      req.body.username = undefined;
      req.body.role = null;

      for (let middleware of registerUser) {
        await middleware(req, res, next);
      }

      expect(User.prototype.save.calls.count()).toEqual(0);
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        errors: [
          { message: userValidationMessages.USERNAME_REQUIRED },
          { message: userValidationMessages.ROLE_REQUIRED },
        ],
      });
    });

    it("request obj is undefined", async () => {
      req = undefined;

      try {
        for (let middleware of registerUser) {
          await middleware(req, res, next);
        }
      } catch (err) {
        expect(err).toEqual(jasmine.any(TypeError));
      }
    });

    it("request obj is null", async () => {
      req = null;

      try {
        for (let middleware of registerUser) {
          await middleware(req, res, next);
        }
      } catch (err) {
        expect(err).toEqual(jasmine.any(TypeError));
      }
    });
  });
});
