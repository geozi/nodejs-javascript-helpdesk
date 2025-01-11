const Ticket = require("../../src/models/ticket.model");
const responseMessages = require("../../src/resources/responseMessages");
const ticketValidationMessages = require("../../src/resources/ticketValidationMessages");
const { addTicket } = require("../../src/controllers/ticket.controller");

describe("Ticket addition integration test", () => {
  let req, res, next;

  const input = {
    title: "Problem with email",
    description: "I do not received email from specific clients.",
    status: "Pending",
    progressNote: "",
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
    Ticket.prototype.save = jasmine.createSpy("save").and.resolveTo({});
  });

  afterEach(() => {
    res.status.calls.reset();
    res.json.calls.reset();
    next.calls.reset();
    Ticket.prototype.save.calls.reset();
  });

  describe("ticket added (201)", () => {
    it("with valid fields", async () => {
      let validInput = { ...input };
      req = { body: validInput };

      for (let middleware of addTicket) {
        await middleware(req, res, next);
      }

      expect(Ticket.prototype.save.calls.count()).toEqual(1);
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith({
        message: responseMessages.TICKET_ADDED,
      });
    });
  });

  describe("bad request (400)", () => {
    const titleRequiredCases = [
      ["title is undefined", undefined],
      ["title is null", null],
    ];

    titleRequiredCases.forEach(([testName, missingTitle]) => {
      it(testName, async () => {
        let validInput = { ...input };
        req = { body: validInput };
        req.body.title = missingTitle;

        for (let middleware of addTicket) {
          await middleware(req, res, next);
        }

        expect(Ticket.prototype.save.calls.count()).toEqual(0);
        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({
          errors: [
            {
              message: ticketValidationMessages.TICKET_TITLE_REQUIRED,
            },
          ],
        });
      });
    });

    const descriptionRequiredCases = [
      ["description is undefined", undefined],
      ["description is null", null],
    ];

    descriptionRequiredCases.forEach(([testName, missingDescription]) => {
      it(testName, async () => {
        let validInput = { ...input };
        req = { body: validInput };
        req.body.description = missingDescription;

        for (let middleware of addTicket) {
          await middleware(req, res, next);
        }

        expect(Ticket.prototype.save.calls.count()).toEqual(0);
        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({
          errors: [
            { message: ticketValidationMessages.TICKET_DESCRIPTION_REQUIRED },
          ],
        });
      });
    });

    const statusRequiredCases = [
      ["status is undefined", undefined],
      ["status is null", null],
    ];

    statusRequiredCases.forEach(([testName, missingStatus]) => {
      it(testName, async () => {
        let validInput = { ...input };
        req = { body: validInput };
        req.body.status = missingStatus;

        for (let middleware of addTicket) {
          await middleware(req, res, next);
        }

        expect(Ticket.prototype.save.calls.count()).toEqual(0);
        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({
          errors: [
            { message: ticketValidationMessages.TICKET_STATUS_REQUIRED },
          ],
        });
      });
    });

    const usernameRequiredCases = [
      ["username is undefined", undefined],
      ["username is null", null],
    ];

    usernameRequiredCases.forEach(([testName, missingUsername]) => {
      it(testName, async () => {
        let validInput = { ...input };
        req = { body: validInput };
        req.body.username = missingUsername;

        for (let middleware of addTicket) {
          await middleware(req, res, next);
        }

        expect(Ticket.prototype.save.calls.count()).toEqual(0);
        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({
          errors: [
            { message: ticketValidationMessages.EMPLOYEE_USERNAME_REQUIRED },
          ],
        });
      });
    });

    it("req is undefined", async () => {
      req = undefined;

      try {
        for (let middleware of addTicket) {
          await middleware(req, res, next);
        }
      } catch (err) {
        expect(err).toEqual(jasmine.any(TypeError));
      }
    });

    it("req is null", async () => {
      req = null;

      try {
        for (let middleware of addTicket) {
          await middleware(req, res, next);
        }
      } catch (err) {
        expect(err).toEqual(jasmine.any(TypeError));
      }
    });
  });
});
