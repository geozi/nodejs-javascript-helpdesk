const { verifyAdminToken } = require("../../src/auth/authController");
const authResponses = require("../../src/auth/authResponseMessages");
const jwt = require("jsonwebtoken");
require("dotenv").config();

describe("Admin JWT integration test(s)", () => {
  let req, res, next;

  const validToken = jwt.sign({ username: "proUser" }, process.env.ADMIN_KEY, {
    expiresIn: "1h",
  });
  const invalidToken = jwt.sign({ username: "proUser" }, process.env.TEST_KEY, {
    expiresIn: "1h",
  });

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

  describe("user authorized (200)", () => {
    it("token is valid", async () => {
      let validInput = { ...input };
      req = {
        body: validInput,
        headers: { authorization: `Bearer ${validToken}` },
      };

      for (let middleware of verifyAdminToken) {
        await middleware(req, res, next);
      }

      expect(next.calls.count()).toBeGreaterThan(1);
    });
  });

  describe("user unauthorized (401)", () => {
    const authHeaderRequiredCases = [
      ["auth header is undefined", undefined],
      ["auth header is null", null],
      ["auth header is empty", ""],
    ];

    authHeaderRequiredCases.forEach(([testName, missingHeader]) => {
      it(testName, async () => {
        let validInput = { ...input };
        req = {
          body: validInput,
          headers: { authorization: missingHeader },
        };

        for (let middleware of verifyAdminToken) {
          await middleware(req, res, next);
        }

        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({
          errors: [{ message: authResponses.AUTH_HEADER_REQUIRED }],
        });
      });
    });

    it("token is invalid", async () => {
      let validInput = { ...input };
      req = {
        body: validInput,
        headers: { authorization: `Bearer ${invalidToken}` },
      };

      for (let middleware of verifyAdminToken) {
        await middleware(req, res, next);
      }

      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith({
        message: authResponses.TOKEN_INVALID,
      });
    });
  });
});
