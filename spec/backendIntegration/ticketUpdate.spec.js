const Ticket = require("../../src/models/ticket.model");
const responseMessages = require("../../src/resources/responseMessages");
const ticketValidationMessages = require("../../src/resources/ticketValidationMessages");
const { updateTicket } = require("../../src/controllers/ticket.controller");

describe("Ticket update integration test", () => {
  let req, res, next;

  const input = {
    id: "67710722913928977aa04ea0",
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
    Ticket.findByIdAndUpdate = jasmine
      .createSpy("findByIdAndUpdate")
      .and.resolveTo({});
  });

  afterEach(() => {
    res.status.calls.reset();
    res.json.calls.reset();
    next.calls.reset();
    Ticket.findByIdAndUpdate.calls.reset();
  });

  describe("ticket updated (201)", () => {
    const updatedTicketCases = [
      ["has only id", { id: input.id }],
      ["has all valid fields", input],
    ];

    updatedTicketCases.forEach(([testName, validInput]) => {
      it(testName, async () => {
        req = { body: validInput };

        for (let middleware of updateTicket) {
          await middleware(req, res, next);
        }

        expect(Ticket.findByIdAndUpdate.calls.count()).toEqual(1);
        expect(res.status).toHaveBeenCalledWith(201);
        expect(res.json).toHaveBeenCalledWith({
          message: responseMessages.TICKET_UPDATED,
        });
      });
    });

    it("has some undefined and null fields", async () => {
      let validInput = { ...input };
      req = { body: validInput };
      req.body.title = undefined;
      req.body.status = null;

      for (let middleware of updateTicket) {
        await middleware(req, res, next);
      }

      expect(Ticket.findByIdAndUpdate.calls.count()).toEqual(1);
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith({
        message: responseMessages.TICKET_UPDATED,
      });
    });
  });

  describe("bad request (400)", () => {
    const idRequiredCases = [
      ["id is undefined", undefined],
      ["id is null", null],
    ];

    idRequiredCases.forEach(([testName, missingId]) => {
      it(testName, async () => {
        let validInput = { ...input };
        req = { body: validInput };
        req.body.id = missingId;

        for (let middleware of updateTicket) {
          await middleware(req, res, next);
        }

        expect(Ticket.findByIdAndUpdate.calls.count()).toEqual(0);
        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({
          errors: [
            { message: ticketValidationMessages.TICKET_ID_REQUIRED },
            { message: ticketValidationMessages.TICKET_ID_INVALID },
            { message: ticketValidationMessages.TICKET_ID_LENGTH },
          ],
        });
      });
    });

    const idLengthCases = [
      ["id is too short", "67710722913928977"],
      ["id is too long", "67710722913928977aa04ea067710722913928977aa04ea0"],
    ];

    idLengthCases.forEach(([testName, invalidId]) => {
      it(testName, async () => {
        let validInput = { ...input };
        req = { body: validInput };
        req.body.id = invalidId;

        for (let middleware of updateTicket) {
          await middleware(req, res, next);
        }

        expect(Ticket.findByIdAndUpdate.calls.count()).toEqual(0);
        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({
          errors: [{ message: ticketValidationMessages.TICKET_ID_LENGTH }],
        });
      });
    });

    const idInvalidCases = [
      ["id contains special symbols", "67*db12ed*29a1*ed143e37e"],
      ["id contains white spaces", "6771 722 13928977aa04ea0"],
      ["id contains capital letters", "67710722913928977AA04ea0"],
    ];

    idInvalidCases.forEach(([testName, invalidId]) => {
      it(testName, async () => {
        let validInput = { ...input };
        req = { body: validInput };
        req.body.id = invalidId;

        for (let middleware of updateTicket) {
          await middleware(req, res, next);
        }

        expect(Ticket.findByIdAndUpdate.calls.count()).toEqual(0);
        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({
          errors: [{ message: ticketValidationMessages.TICKET_ID_INVALID }],
        });
      });
    });

    it("req is undefined", async () => {
      req = undefined;

      try {
        for (let middleware of updateTicket) {
          await middleware(req, res, next);
        }
      } catch (err) {
        expect(err).toEqual(jasmine.any(TypeError));
      }
    });

    it("req is null", async () => {
      req = null;

      try {
        for (let middleware of updateTicket) {
          await middleware(req, res, next);
        }
      } catch (err) {
        expect(err).toEqual(jasmine.any(TypeError));
      }
    });
  });
});
