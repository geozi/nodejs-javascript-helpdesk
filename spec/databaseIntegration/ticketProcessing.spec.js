const Ticket = require("../../src/models/ticket.model");
const mongoose = require("mongoose");
const {
  addTicket,
  updateTicket,
  deleteTicket,
  //   updateTicket,
  //   deleteTicket,
} = require("../../src/controllers/ticket.controller");
const responseMessages = require("../../src/resources/responseMessages");
require("dotenv").config();

describe("Ticket processing integration test(s)", () => {
  let req, res, next;

  const input = {
    title: "Problem with email",
    description: "I do not received email from specific clients.",
    status: "Pending",
    progressNote: "",
    username: "newUser",
  };

  beforeAll(() => {
    mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true });
  });

  beforeEach(() => {
    res = {
      status: jasmine.createSpy("status").and.callFake(() => {
        return res;
      }),
      json: jasmine.createSpy("json"),
    };
    next = jasmine.createSpy("next");
  });

  afterEach(async () => {
    res.status.calls.reset();
    res.json.calls.reset();
    next.calls.reset();
  });

  afterAll(async () => {
    await Ticket.deleteMany({});
    await mongoose.connection.close();
  });

  it("ticket added (201)", async () => {
    req = {
      body: input,
    };

    for (let middleware of addTicket) {
      await middleware(req, res, next);
    }

    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith({
      message: responseMessages.TICKET_ADDED,
    });
  });

  it("ticket updated (201)", async () => {
    const ticket = new Ticket(input);
    const ticketToUpdate = await ticket.save();

    const req = {
      body: {
        id: ticketToUpdate._id.toString(),
        status: "Complete",
      },
    };

    for (let middleware of updateTicket) {
      await middleware(req, res, next);
    }

    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith({
      message: responseMessages.TICKET_UPDATED,
    });
  });

  it("ticket deleted (204)", async () => {
    const ticket = new Ticket(input);
    const ticketToDelete = await ticket.save();

    const req = {
      body: {
        id: ticketToDelete._id.toString(),
      },
    };

    for (let middleware of deleteTicket) {
      await middleware(req, res, next);
    }

    expect(res.status).toHaveBeenCalledWith(204);
  });
});
