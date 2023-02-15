const express = require("express");
const app = express();
const cors = require("cors");
const port = process.env.PORT || 3000;
const bodyParser = require("body-parser");

app.use(bodyParser.json());
app.use(cors({ origin: "*" }));

const user = require("./routes/user.js");

app.use("/user", user);

app.listen(port, () => {
  console.log(`App listening on port ${port}`);
});
