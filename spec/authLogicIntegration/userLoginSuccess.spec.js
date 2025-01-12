const User = require("../../src/models/user.model");
const bcrypt = require("bcryptjs");
const { loginUser } = require("../../src/auth/authController");
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");

describe("Successful user admin integration test", () => {
  let req, res, next;

  const validUsername = "proUser";
  const validEmail = "my@email.com";
  const validPassword = "W;Vj(+C8Sgqo'_4";
  const validRole = "admin";

  const user = new User({
    id: new mongoose.Types.ObjectId("67794ce0cd23fbb2ce77d982"),
    username: validUsername,
    email: validEmail,
    password: validPassword,
    role: validRole,
  });

  const testToken =
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6InByb1VzZXIiLCJpYXQiOjE1MTYyMzkwMjJ9.wHEHyrHkSbNkkN-8MrZohaim7HS_tjrZdh9Od8zj_M4";

  beforeEach(() => {
    jwt.sign = jasmine.createSpy("sign").and.resolveTo(testToken);
    res = {
      status: jasmine.createSpy("status").and.callFake(() => {
        return res;
      }),
      json: jasmine.createSpy("json").and.resolveTo({ token: testToken }),
    };
    next = jasmine.createSpy("next");
    User.findOne = jasmine.createSpy("findOne").and.resolveTo(user);
    bcrypt.compare = jasmine.createSpy("compare").and.resolveTo(true);
  });

  afterEach(() => {
    jwt.sign.calls.reset();
    res.status.calls.reset();
    res.json.calls.reset();
    next.calls.reset();
    User.findOne.calls.reset();
    bcrypt.compare.calls.reset();
  });

  it("admin logged in (200)", async () => {
    req = {
      body: {
        username: validUsername,
        password: validPassword,
      },
    };

    for (let middleware of loginUser) {
      await middleware(req, res, next);
    }

    expect(User.findOne.calls.count()).toEqual(1);
    expect(User.findOne).toHaveBeenCalledWith({ username: validUsername });
    await expectAsync(User.findOne()).toBeResolvedTo(user);

    expect(bcrypt.compare.calls.count()).toEqual(1);
    await expectAsync(bcrypt.compare()).toBeResolvedTo(true);

    expect(res.status).toHaveBeenCalledWith(200);
    await expectAsync(res.json()).toBeResolvedTo({
      token: testToken,
    });
  });
});
