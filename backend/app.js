const express = require("express");
const dotenv = require("dotenv");
const app = express();

dotenv.config({ path: "config.env" });
const Port = process.env.port || 8000;

app.listen(Port, () => {
  console.log(`server running on http://localhost:${Port}`);
});
