const express = require("express");
const app = express();
const port = 3000;
const mongoose = require("mongoose");
const swaggerUi = require("swagger-ui-express");
const swaggerOptions = require("../swagger.config");
const swaggerJSDoc = require("swagger-jsdoc");
const { authRouter } = require("./routes/auth.route");
const { employeeRouter } = require("./routes/employee.route");
const { userRouter } = require("./routes/user.route");
const { ticketRouter } = require("./routes/ticket.route");
const { roleRouter } = require("./routes/role.route");
require("dotenv").config();

const swaggerDocs = swaggerJSDoc(swaggerOptions);

async function connectToDb() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("Connection to database established");
  } catch (err) {
    console.log("Failed to connect to database", err);
  }
}

app.use(express.json());

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocs));
app.use("/api/login", authRouter);
app.use("/api/register", userRouter);
app.use("/api/employees", employeeRouter);
app.use("/api/tickets", ticketRouter);
app.use("/api/roles", roleRouter);

app.listen(port, () => {
  console.log(`Server is listening on port: ${port}`);
});

connectToDb();
