/**
 * Employee validation error messages.
 * @module src/resources/employeeValidationMessages
 */

module.exports = {
  EMP_FIRST_NAME_REQUIRED: "Employee first name is a required field",
  EMP_FIRST_NAME_INVALID: "Employee first name can contain only letters",
  EMP_LAST_NAME_REQUIRED: "Employee last name is a required field",
  EMP_LAST_NAME_INVALID: "Employee last name can contain only letters",
  EMP_EMAIL_REQUIRED: "Employee email is a required field",
  EMP_EMAIL_INVALID: "Employee email must be a valid email address",
  EMP_EMAIL_UNIQUE: "Employee email must be unique",
  EMP_PHONE_NUMBER_REQUIRED: "Employee phone number is a required field",
  EMP_PHONE_NUMBER_INVALID:
    "Employee phone number can only contain digits and/or hyphens",
  EMP_SSN_REQUIRED: "Employee SSN is a required field",
  EMP_SSN_INVALID: "Employee SSN can only contain digits and/or hyphens",
  EMP_SSN_UNIQUE: "Employee SSN must be unique",
  EMP_CITY_REQUIRED: "City is a required field",
  EMP_CITY_INVALID:
    "City can only contain letters and/or hyphens and/or whitespaces",
  EMP_STREET_ADDRESS_REQUIRED: "Street address is a required field",
  EMP_ZIP_CODE_REQUIRED: "Zipcode is a required field",
  EMP_ZIP_CODE_INVALID: "Zipcode can only contain digits",
  EMP_DEPT_REQUIRED: "Employee department is a required field",
  EMP_DEPT_INVALID: `
    **Employee department must be one of the following:**
    - **Accounting & Finance**,
    - **Business Development**,
    - **Human Resources**,
    - **IT**,
    - **Legal**,
    - **Marketing**,
    - **Quality Assurance**`,
  EMP_TITLE_REQUIRED: "Employee title is a required field",
  EMP_TITLE_INVALID:
    "Employee title can only contain letters and/or hyphens and/or white spaces",
};
