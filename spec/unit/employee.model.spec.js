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

  it("has invalid firstName", () => {
    const newEmployee = new Employee(validInput);
    newEmployee.firstName = "G4br13l";
    const err = newEmployee.validateSync();

    expect(err.errors.firstName).toBeDefined();
    expect(err.errors.firstName.message).toEqual(
      employeeValidationMessages.EMP_FIRST_NAME_INVALID
    );
  });

  it("has invalid lastName", () => {
    const newEmployee = new Employee(validInput);
    newEmployee.lastName = "1";
    const err = newEmployee.validateSync();

    expect(err.errors.lastName).toBeDefined();
    expect(err.errors.lastName.message).toEqual(
      employeeValidationMessages.EMP_LAST_NAME_INVALID
    );
  });

  it("has invalid email", () => {
    const newEmployee = new Employee(validInput);
    newEmployee.email = "price35yahoo.com";
    const err = newEmployee.validateSync();

    expect(err.errors.email).toBeDefined();
    expect(err.errors.email.message).toEqual(
      employeeValidationMessages.EMP_EMAIL_INVALID
    );
  });

  it("has invalid phoneNumber", () => {
    const newEmployee = new Employee(validInput);
    newEmployee.phoneNumber = "352 059 6936";
    const err = newEmployee.validateSync();

    expect(err.errors.phoneNumber).toBeDefined();
    expect(err.errors.phoneNumber.message).toEqual(
      employeeValidationMessages.EMP_PHONE_NUMBER_INVALID
    );
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

  it("has invalid zipCode", () => {
    const newEmployee = new Employee(validInput);
    newEmployee.zipCode = "a4345";
    const err = newEmployee.validateSync();

    expect(err.errors.zipCode).toBeDefined();
    expect(err.errors.zipCode.message).toEqual(
      employeeValidationMessages.EMP_ZIP_CODE_INVALID
    );
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
