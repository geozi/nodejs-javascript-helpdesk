const Ticket = require("../../src/models/ticket.model");
const responseMessages = require("../../src/resources/responseMessages");
const ticketValidationMessages = require("../../src/resources/ticketValidationMessages");
const {
  retrieveTicketsByUsername,
} = require("../../src/controllers/ticket.controller");

describe("Ticket group retrieval by username integration test", () => {
  let req, res, next;

  const input = {
    username: "newUser",
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

  it("tickets found (200)", async () => {
    let validInput = { ...input };
    req = { body: validInput };
    const mockTickets = [new Ticket(), new Ticket()];

    Ticket.find = jasmine.createSpy("find").and.resolveTo(mockTickets);

    for (let middleware of retrieveTicketsByUsername) {
      await middleware(req, res, next);
    }

    expect(Ticket.find.calls.count()).toEqual(1);
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(
      jasmine.arrayContaining([jasmine.any(Ticket)])
    );
  });

  it("tickets not found (404)", async () => {
    let validInput = { ...input };
    req = { body: validInput };

    Ticket.find = jasmine.createSpy("find").and.resolveTo([]);

    for (let middleware of retrieveTicketsByUsername) {
      await middleware(req, res, next);
    }

    expect(Ticket.find.calls.count()).toEqual(1);
    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({
      message: responseMessages.TICKET_GROUP_NOT_FOUND,
    });
  });

  describe("baq request (400)", () => {
    it("username field is missing", async () => {
      req = { body: {} };

      for (let middleware of retrieveTicketsByUsername) {
        await middleware(req, res, next);
      }

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        errors: [
          { message: ticketValidationMessages.EMPLOYEE_USERNAME_REQUIRED },
        ],
      });
    });

    it("req is undefined", async () => {
      req = undefined;

      try {
        for (let middleware of retrieveTicketsByUsername) {
          await middleware(req, res, next);
        }
      } catch (err) {
        expect(err).toEqual(jasmine.any(TypeError));
      }
    });

    it("req is null", async () => {
      req = null;

      try {
        for (let middleware of retrieveTicketsByUsername) {
          await middleware(req, res, next);
        }
      } catch (err) {
        expect(err).toEqual(jasmine.any(TypeError));
      }
    });
  });
});
