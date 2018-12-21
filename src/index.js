const app = require("express")();
const bodyParser = require("body-parser");

// Allows us to parse request bodies.
app.use(bodyParser.json());

// Set up routes.
app.use("/users", require("./controllers/users"));
app.get("/", (_, res) => res.json({ greeting: "Hello world!" }));

module.exports = app;