const express = require("express");
const app = express();
require('dotenv').config()
const PORT = process.env.PORT || 3001;

const { typeError } = require("./middlewares/errors");
const { dbConnection } = require("./config/config");
const Logger = require("logplease");
const logger = Logger.create("FunSioNandoooo", {
  color: Logger.Colors.Magenta,
});



app.use(express.json());
app.use(express.static("public"));

dbConnection();

app.get("/", (req, res) => {
  res.send("aqui no es!! abre el postman!! que todavia no sabes REACT");
});

app.use("/posts", require("./routes/posts"));
app.use("/comments", require("./routes/comments"));
app.use("/users", require("./routes/users"));

app.use(typeError);

app.listen(PORT, logger.info(`Servidor Arrancado en puerto:  ${PORT}`));
