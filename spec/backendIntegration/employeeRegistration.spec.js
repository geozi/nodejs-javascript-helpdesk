const Employee = require("../../src/models/employee.model");
const responseMessages = require("../../src/resources/responseMessages");
const employeeValidationMessages = require("../../src/resources/employeeValidationMessages");
const {
  registerEmployee,
} = require("../../src/controllers/employee.controller");

describe("Employee reg. integration test", () => {
  let req, res, next;

  const input = {
    firstName: "Gabriel",
    lastName: "Price",
    email: "gtprice35@yahoo.com",
    phoneNumber: "352-059-6936",
    ssn: "382-37-6150",
    city: "Maxwell",
    streetAddress: "36 Spring Street",
    zipCode: "95955",
    title: "Developer",
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
    Employee.prototype.save = jasmine.createSpy("save").and.resolveTo({});
  });

  afterEach(() => {
    res.status.calls.reset();
    res.json.calls.reset();
    next.calls.reset();
    Employee.prototype.save.calls.reset();
  });

  describe("registered (201)", () => {
    it("with valid fields", async () => {
      let validInput = { ...input };
      req = { body: validInput };

      for (let middleware of registerEmployee) {
        await middleware(req, res, next);
      }

      expect(Employee.prototype.save.calls.count()).toEqual(1);
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith({
        message: responseMessages.EMPLOYEE_REGISTERED,
      });
    });
  });

  describe("bad request (400)", () => {
    const firstNameRequiredCases = [
      ["firstName is undefined", undefined],
      ["firstName is null", null],
    ];

    firstNameRequiredCases.forEach(([testName, missingFirstName]) => {
      it(testName, async () => {
        let validInput = { ...input };
        req = { body: validInput };
        req.body.firstName = missingFirstName;

        for (let middleware of registerEmployee) {
          await middleware(req, res, next);
        }

        expect(Employee.prototype.save.calls.count()).toEqual(0);
        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({
          errors: [
            { message: employeeValidationMessages.EMP_FIRST_NAME_REQUIRED },
          ],
        });
      });
    });

    const lastNameRequiredCases = [
      ["lastName is undefined", undefined],
      ["lastName is null", null],
    ];

    lastNameRequiredCases.forEach(([testName, missingLastName]) => {
      it(testName, async () => {
        let validInput = { ...input };
        req = { body: validInput };
        req.body.lastName = missingLastName;

        for (let middleware of registerEmployee) {
          await middleware(req, res, next);
        }

        expect(Employee.prototype.save.calls.count()).toEqual(0);
        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({
          errors: [
            { message: employeeValidationMessages.EMP_LAST_NAME_REQUIRED },
          ],
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

        for (let middleware of registerEmployee) {
          await middleware(req, res, next);
        }

        expect(Employee.prototype.save.calls.count()).toEqual(0);
        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({
          errors: [{ message: employeeValidationMessages.EMP_EMAIL_REQUIRED }],
        });
      });
    });

    const phoneNumberRequiredCases = [
      ["phoneNumber is undefined", undefined],
      ["phoneNumber is null", null],
    ];

    phoneNumberRequiredCases.forEach(([testName, missingPhoneNumber]) => {
      it(testName, async () => {
        let validInput = { ...input };
        req = { body: validInput };
        req.body.phoneNumber = missingPhoneNumber;

        for (let middleware of registerEmployee) {
          await middleware(req, res, next);
        }

        expect(Employee.prototype.save.calls.count()).toEqual(0);
        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({
          errors: [
            { message: employeeValidationMessages.EMP_PHONE_NUMBER_REQUIRED },
          ],
        });
      });
    });

    const ssnRequiredCases = [
      ["ssn is undefined", undefined],
      ["ssn is null", null],
    ];

    ssnRequiredCases.forEach(([testName, missingSSN]) => {
      it(testName, async () => {
        let validInput = { ...input };
        req = { body: validInput };
        req.body.ssn = missingSSN;

        for (let middleware of registerEmployee) {
          await middleware(req, res, next);
        }

        expect(Employee.prototype.save.calls.count()).toEqual(0);
        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({
          errors: [{ message: employeeValidationMessages.EMP_SSN_REQUIRED }],
        });
      });
    });

    const cityRequiredCases = [
      ["city is undefined", undefined],
      ["city is null", null],
    ];

    cityRequiredCases.forEach(([testName, missingCity]) => {
      it(testName, async () => {
        let validInput = { ...input };
        req = { body: validInput };
        req.body.city = missingCity;

        for (let middleware of registerEmployee) {
          await middleware(req, res, next);
        }

        expect(Employee.prototype.save.calls.count()).toEqual(0);
        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({
          errors: [{ message: employeeValidationMessages.EMP_CITY_REQUIRED }],
        });
      });
    });

    const streetAddressRequiredCases = [
      ["streetAddress is undefined", undefined],
      ["streetAddress is null", null],
    ];

    streetAddressRequiredCases.forEach(([testName, missingStreetAddress]) => {
      it(testName, async () => {
        let validInput = { ...input };
        req = { body: validInput };
        req.body.streetAddress = missingStreetAddress;

        for (let middleware of registerEmployee) {
          await middleware(req, res, next);
        }

        expect(Employee.prototype.save.calls.count()).toEqual(0);
        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({
          errors: [
            { message: employeeValidationMessages.EMP_STREET_ADDRESS_REQUIRED },
          ],
        });
      });
    });

    const zipCodeRequiredCases = [
      ["zipCode is undefined", undefined],
      ["zipCode is null", null],
    ];
    zipCodeRequiredCases.forEach(([testName, missingZipCode]) => {
      it(testName, async () => {
        let validInput = { ...input };
        req = { body: validInput };
        req.body.zipCode = missingZipCode;

        for (let middleware of registerEmployee) {
          await middleware(req, res, next);
        }

        expect(Employee.prototype.save.calls.count()).toEqual(0);
        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({
          errors: [
            { message: employeeValidationMessages.EMP_ZIP_CODE_REQUIRED },
          ],
        });
      });
    });

    const deptRequiredCases = [
      ["dept is undefined", undefined],
      ["dept is null", null],
    ];

    deptRequiredCases.forEach(([testName, missingDept]) => {
      it(testName, async () => {
        let validInput = { ...input };
        req = { body: validInput };
        req.body.dept = missingDept;

        for (let middleware of registerEmployee) {
          await middleware(req, res, next);
        }

        expect(Employee.prototype.save.calls.count()).toEqual(0);
        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({
          errors: [{ message: employeeValidationMessages.EMP_DEPT_REQUIRED }],
        });
      });
    });

    const titleRequiredCases = [
      ["title is undefined", undefined],
      ["title is null", null],
    ];

    titleRequiredCases.forEach(([testName, missingTitle]) => {
      it(testName, async () => {
        let validInput = { ...input };
        req = { body: validInput };
        req.body.title = missingTitle;

        for (let middleware of registerEmployee) {
          await middleware(req, res, next);
        }

        expect(Employee.prototype.save.calls.count()).toEqual(0);
        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({
          errors: [{ message: employeeValidationMessages.EMP_TITLE_REQUIRED }],
        });
      });
    });

    it("has multiple undefined and null fields", async () => {
      let validInput = { ...input };
      req = { body: validInput };
      req.body.firstName = undefined;
      req.body.ssn = null;
      req.body.city = undefined;
      req.body.title = null;

      for (let middleware of registerEmployee) {
        await middleware(req, res, next);
      }

      expect(Employee.prototype.save.calls.count()).toEqual(0);
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        errors: [
          { message: employeeValidationMessages.EMP_FIRST_NAME_REQUIRED },
          { message: employeeValidationMessages.EMP_SSN_REQUIRED },
          { message: employeeValidationMessages.EMP_CITY_REQUIRED },
          { message: employeeValidationMessages.EMP_TITLE_REQUIRED },
        ],
      });
    });

    it("req is undefined", async () => {
      req = undefined;

      try {
        for (let middleware of registerEmployee) {
          await middleware(req, res, next);
        }
      } catch (err) {
        expect(err).toEqual(jasmine.any(TypeError));
      }
    });

    it("req is null", async () => {
      req = null;

      try {
        for (let middleware of registerEmployee) {
          await middleware(req, res, next);
        }
      } catch (err) {
        expect(err).toEqual(jasmine.any(TypeError));
      }
    });
  });
});
