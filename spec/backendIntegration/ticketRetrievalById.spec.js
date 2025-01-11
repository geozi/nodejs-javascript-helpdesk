const Ticket = require("../../src/models/ticket.model");
const responseMessages = require("../../src/resources/responseMessages");
const ticketValidationMessages = require("../../src/resources/ticketValidationMessages");
const {
  retrieveTicketById,
} = require("../../src/controllers/ticket.controller");

describe("Ticket retrieval by ID integration test", () => {
  let req, res, next;

  const input = {
    id: "67829b413b14e65793d9bdfe",
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

  it("ticket found (200)", async () => {
    let validInput = { ...input };
    req = { body: validInput };

    Ticket.findById = jasmine
      .createSpy("findById")
      .and.resolveTo(jasmine.any(Ticket));

    for (let middleware of retrieveTicketById) {
      await middleware(req, res, next);
    }

    expect(Ticket.findById.calls.count()).toEqual(1);
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(jasmine.any(Ticket));
  });

  it("ticket not found (404)", async () => {
    let validInput = { ...input };
    req = { body: validInput };

    Ticket.findById = jasmine.createSpy("findById").and.resolveTo(null);

    for (let middleware of retrieveTicketById) {
      await middleware(req, res, next);
    }

    expect(Ticket.findById.calls.count()).toEqual(1);
    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({
      message: responseMessages.TICKET_NOT_FOUND,
    });
  });

  describe("baq request (400)", () => {
    it("id field is missing", async () => {
      req = { body: {} };

      for (let middleware of retrieveTicketById) {
        await middleware(req, res, next);
      }

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        errors: [
          { message: ticketValidationMessages.TICKET_ID_REQUIRED },
          { message: ticketValidationMessages.TICKET_ID_INVALID },
          { message: ticketValidationMessages.TICKET_ID_LENGTH },
        ],
      });
    });

    it("req is undefined", async () => {
      req = undefined;

      try {
        for (let middleware of retrieveTicketById) {
          await middleware(req, res, next);
        }
      } catch (err) {
        expect(err).toEqual(jasmine.any(TypeError));
      }
    });

    it("req is null", async () => {
      req = null;

      try {
        for (let middleware of retrieveTicketById) {
          await middleware(req, res, next);
        }
      } catch (err) {
        expect(err).toEqual(jasmine.any(TypeError));
      }
    });
  });
});
