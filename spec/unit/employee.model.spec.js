/**
 * Employee model unit tests
 */

const Employee = require("../../src/models/employee.model");
const employeeValidationMessages = require("../../src/resources/employeeValidationMessages");

describe("Employee model unit test:", () => {
  // Test object with valid inputs
  const validInput = {
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
    spyOn(Employee.prototype, "save");
  });

  afterEach(() => {
    Employee.prototype.save.calls.reset();
  });

  it("has valid inputs", () => {
    const newEmployee = new Employee(validInput);

    const err = newEmployee.validateSync();

    expect(err).toBeUndefined();
  });

  const firstNameInvalidCases = [
    ["firstName contains digits", "G4bri3l"],
    ["firstName contains special symbols", "G@briel*"],
    ["firstName contains whitespaces", "Ga briel"],
    ["firstName contains digits + symbols", "G@br1el"],
  ];

  firstNameInvalidCases.forEach(([testName, invalidFirstName]) => {
    it(testName, () => {
      const newEmployee = new Employee(validInput);
      newEmployee.firstName = invalidFirstName;
      const err = newEmployee.validateSync();

      expect(err.errors.firstName).toBeDefined();
      expect(err.errors.firstName.message).toEqual(
        employeeValidationMessages.EMP_FIRST_NAME_INVALID
      );
    });
  });

  const lastNameInvalidCases = [
    ["lastName contains digits", "Pr1c3"],
    ["lastName contains special symbols", "Price&"],
    ["lastName contains whitespaces", "P rice"],
    ["lastName contains digits + whitespaces", "P ric3"],
  ];

  lastNameInvalidCases.forEach(([testName, invalidLastName]) => {
    it(testName, () => {
      const newEmployee = new Employee(validInput);
      newEmployee.lastName = invalidLastName;
      const err = newEmployee.validateSync();

      expect(err.errors.lastName).toBeDefined();
      expect(err.errors.lastName.message).toEqual(
        employeeValidationMessages.EMP_LAST_NAME_INVALID
      );
    });
  });

  const emailInvalidCases = [
    ["email has no prefix", "@yahoo.com"],
    ["email has no @", "price35yahoo.com"],
    ["email has no email domain", "price35@."],
    ["email has no .", "price35@yahoocom"],
    ["email has no top level domain", "price35@yahoo."],
  ];

  emailInvalidCases.forEach(([testName, invalidEmail]) => {
    it(testName, () => {
      const newEmployee = new Employee(validInput);
      newEmployee.email = invalidEmail;
      const err = newEmployee.validateSync();

      expect(err.errors.email).toBeDefined();
      expect(err.errors.email.message).toEqual(
        employeeValidationMessages.EMP_EMAIL_INVALID
      );
    });
  });

  const phoneNumberInvalidCases = [
    ["phoneNumber contains letters", "a1234-5678"],
    ["phoneNumber contains special symbols", "1234*5678"],
    ["phoneNumber contains a hyphen in wrong position", "1234-5678-"],
    ["phoneNumber contains letters + special symbols", "a12*4-5678"],
  ];

  phoneNumberInvalidCases.forEach(([testName, invalidPhoneNumber]) => {
    it(testName, async () => {
      const newEmployee = new Employee(validInput);
      newEmployee.phoneNumber = invalidPhoneNumber;
      const err = newEmployee.validateSync();

      expect(err.errors.phoneNumber).toBeDefined();
      expect(err.errors.phoneNumber.message).toEqual(
        employeeValidationMessages.EMP_PHONE_NUMBER_INVALID
      );
    });
  });

  it("has invalid ssn", () => {
    const newEmployee = new Employee(validInput);
    newEmployee.ssn = "382#37 6150";
    const err = newEmployee.validateSync();

    expect(err.errors.ssn).toBeDefined();
    expect(err.errors.ssn.message).toEqual(
      employeeValidationMessages.EMP_SSN_INVALID
    );
  });

  const zipCodeInvalidCases = [
    ["zipCode contains letters", "6453a"],
    ["zipCode contains special symbols", "123B5"],
    ["zipCode contains whitespace(s)", "4556 6"],
    ["zipCode contains letters + special symbols", "64@31L"],
    ["zipCode has length !== 5", "645378"],
  ];

  zipCodeInvalidCases.forEach(([testName, invalidZipCode]) => {
    it(testName, () => {
      const newEmployee = new Employee(validInput);
      newEmployee.zipCode = invalidZipCode;
      const err = newEmployee.validateSync();

      expect(err.errors.zipCode).toBeDefined();
      expect(err.errors.zipCode.message).toEqual(
        employeeValidationMessages.EMP_ZIP_CODE_INVALID
      );
    });
  });

  it("has invalid dept", () => {
    const newEmployee = new Employee(validInput);
    newEmployee.dept = "R & D";
    const err = newEmployee.validateSync();

    expect(err.errors.dept).toBeDefined();
    expect(err.errors.dept.message).toEqual(
      employeeValidationMessages.EMP_DEPT_INVALID
    );
  });

  it("has invalid title", () => {
    const newEmployee = new Employee(validInput);
    newEmployee.title = "D3vel0p3r";
    const err = newEmployee.validateSync();

    expect(err.errors.title).toBeDefined();
    expect(err.errors.title.message).toEqual(
      employeeValidationMessages.EMP_TITLE_INVALID
    );
  });

  it("has multiple invalid fields", () => {
    const newEmployee = new Employee(validInput);
    newEmployee.firstName = "G4br13l";
    newEmployee.phoneNumber = "352 059 6936";
    newEmployee.title = "D3vel0p3r";
    const err = newEmployee.validateSync();

    expect(Object.keys(err.errors).length).toEqual(3);
    expect(Object.keys(err.errors).sort()).toEqual([
      "firstName",
      "phoneNumber",
      "title",
    ]);

    expect(err.errors.firstName.message).toEqual(
      employeeValidationMessages.EMP_FIRST_NAME_INVALID
    );

    expect(err.errors.phoneNumber.message).toEqual(
      employeeValidationMessages.EMP_PHONE_NUMBER_INVALID
    );

    expect(err.errors.title.message).toEqual(
      employeeValidationMessages.EMP_TITLE_INVALID
    );
  });
});
