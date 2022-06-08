const express = require("express");
const app = express();
require('dotenv').config()
const PORT = process.env.PORT || 3001;

const { typeError } = require("./middlewares/errors");
const { dbConnection } = require("./config/config");
const Logger = require("logplease");
const logger = Logger.create("NUCLEAR LAUNCH DETECTED...", {
  color: Logger.Colors.Magenta,
});
const swaggerUI = require('swagger-ui-express')
const docs = require('./docs/index')



app.use(express.json());
app.use(express.static("public"));

dbConnection();

app.get("/", (req, res) => {
  res.send("Open Postman Ma Men!!");
});

app.use("/posts", require("./routes/posts"));
app.use("/comments", require("./routes/comments"));
app.use("/users", require("./routes/users"));

app.use('/api-docs', swaggerUI.serve,swaggerUI.setup(docs))

app.use(typeError);

app.listen(PORT, logger.info(`Server Running at: ${PORT}`));
