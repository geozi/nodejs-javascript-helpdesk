/**
 * Regular expressions for validation processes.
 * @module src/resources/validationRegExp
 */

const EMAIL_REGEX = new RegExp(
  /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
);

const NAME_REGEX = new RegExp(/^[A-Za-z]+$/);

const ZIP_CODE_REGEX = new RegExp(/^\d{5}$/);

/*eslint-disable no-useless-escape*/
const CITY_REGEX = new RegExp(/^[A-Za-z\s\-]+$/);
/*eslint-enable no-useless-escape*/

const PHONE_SSN_REGEX = new RegExp(/^\d+(-\d+)*$/);

const EMP_TITLE_REGEX = new RegExp(/^[a-zA-Z\s-]+$/);

const PASSWORD_REGEX = new RegExp(
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).+$/
);

const ID_REGEX = new RegExp(/^[0-9a-f]{1,}$/);

module.exports = {
  EMAIL_REGEX,
  NAME_REGEX,
  ZIP_CODE_REGEX,
  CITY_REGEX,
  PHONE_SSN_REGEX,
  EMP_TITLE_REGEX,
  PASSWORD_REGEX,
  ID_REGEX,
};
