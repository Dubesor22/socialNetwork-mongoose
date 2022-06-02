const express = require("express");
const app = express();
const PORT = 8080;
const { dbConnection } = require("./config/config");
const Logger = require("logplease");
const logger = Logger.create("This Is Working Guys On", {
  color: Logger.Colors.Magenta,
});
const fs = require("fs");
const multer = require("multer");
const upload = multer({ dest: "public/images" });

app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

dbConnection();

app.use("/posts", require("./routes/posts"));
app.use("/comments", require("./routes/comments"));
app.use("/users", require("./routes/users"));

app.listen(PORT, logger.info(`Servidor Arrancado en puerto:  ${PORT}`));
