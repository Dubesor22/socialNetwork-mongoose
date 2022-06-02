const express = require("express");
const app = express();
const PORT = 8080;

const { typeError } = require("./middlewares/errors");
const { dbConnection } = require("./config/config");
const Logger = require("logplease");
const logger = Logger.create("FunSioNandoooo", {
  color: Logger.Colors.Magenta,
});

app.use(express.json());
app.use(express.static("public"));

dbConnection();

app.use("/posts", require("./routes/posts"));
app.use("/comments", require("./routes/comments"));
app.use("/users", require("./routes/users"));

app.use(typeError);

app.listen(PORT, logger.info(`Servidor Arrancado en puerto:  ${PORT}`));
