const swaggerOptions = {
  swaggerDefinition: {
    openapi: "3.0.0",
    info: {
      title: "HelpDesk API",
      version: "1.0.0",
      description: "API endpoints for a HelpDesk service",
      contact: {
        name: "geozi",
        url: "https://github.com/geozi/nodejs-javascript-helpdesk",
      },
      servers: [
        {
          url: "http://localhost:3000",
          description: "Local server",
        },
      ],
    },
  },
  apis: ["./routes/*.js", "./src/routes/*.js"],
};

module.exports = swaggerOptions;
