# HelpDesk API test plan

Document version 1.0.0

## Introduction

The HelpDesk API test plan contains information on tests, which are run during the development phase of the project.

## In Scope

The project's tests are unit and integration tests. Completed tests are noted with ✔, while the pending ones are noted with ⌛.

### Unit tests

Focus is placed on the validation rules of the Mongoose schemas. The tests include both positive and negative scenarios. In the case of the negative scenarios, the tests aim to break the validation rules and trigger specific validation messages.

### Integration tests

#### Backend integration test(s)

[Under development]

#### Auth logic integration test(s)

[Under development]

#### Database integration test(s)

[Under development]

## Out of scope

The HelpDesk API is a backend project, therefore any tests referring to the frontend are excluded.

## Assumptions

The backend implementation is ongoing.

## Environments + Tools

The primary tool for unit testing is the Jasmine testing framework. The same framework might be also used for the smooth running of integration tests.
