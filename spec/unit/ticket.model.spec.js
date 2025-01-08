/**
 * Ticket model unit tests.
 */

const Ticket = require("../../src/models/ticket.model");
const ticketValidationMessages = require("../../src/resources/ticketValidationMessages");

describe("Ticket model unit test:", () => {
  const validInput = {
    title: "Problem with email",
    description: "I do not received email from specific clients.",
    status: "Pending",
    progressNote: "",
    username: "newUser",
  };
  beforeEach(() => {
    spyOn(Ticket.prototype, "save");
  });

  afterEach(() => {
    Ticket.prototype.save.calls.reset();
  });

  it("has valid inputs", () => {
    const newTicket = new Ticket(validInput);
    const err = newTicket.validateSync();

    expect(err).toBeUndefined();
  });

  it("has too short title", () => {
    const newTicket = new Ticket(validInput);
    newTicket.title = "Some";
    const err = newTicket.validateSync();

    expect(err.errors.title).toBeDefined();
    expect(err.errors.title.message).toEqual(
      ticketValidationMessages.TICKET_TITLE_MIN_LENGTH
    );
  });

  it("has too long title", () => {
    const newTicket = new Ticket(validInput);
    newTicket.title =
      "Detailed Troubleshooting Request: Intermittent Network Connectivity Issues Affecting Multiple Devices and Users";
    const err = newTicket.validateSync();

    expect(err.errors.title).toBeDefined();
    expect(err.errors.title.message).toEqual(
      ticketValidationMessages.TICKET_TITLE_MAX_LENGTH
    );
  });

  it("has too short description", () => {
    const newTicket = new Ticket(validInput);
    newTicket.description = "Description";
    const err = newTicket.validateSync();

    expect(err.errors.description).toBeDefined();
    expect(err.errors.description.message).toEqual(
      ticketValidationMessages.TICKET_DESCRIPTION_MIN_LENGTH
    );
  });

  it("has too long description", () => {
    const newTicket = new Ticket(validInput);
    newTicket.description = `Over the past week, we have been experiencing intermittent network connectivity issues that have been affecting multiple devices and users within the organization. These issues include frequent disconnections, slow internet speeds, and difficulty accessing internal resources. These problems persist across both wired and wireless connections. Preliminary troubleshooting efforts have not resolved the issues, and the impact on productivity is escalating. A detailed investigation and resolution are urgently required to ensure uninterrupted operations and workflow. Please prioritize this ticket and assign to the appropriate technical team for further analysis.`;
    const err = newTicket.validateSync();

    expect(err.errors.description).toBeDefined();
    expect(err.errors.description.message).toEqual(
      ticketValidationMessages.TICKET_DESCRIPTION_MAX_LENGTH
    );
  });

  it("has invalid status", () => {
    const newTicket = new Ticket(validInput);
    newTicket.status = "Denied";
    const err = newTicket.validateSync();

    expect(err.errors.status).toBeDefined();
    expect(err.errors.status.message).toEqual(
      ticketValidationMessages.TICKET_STATUS_INVALID
    );
  });
});
