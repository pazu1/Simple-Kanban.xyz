const express = require("express");
const api = require("./api/api")

const app = express();

api(app)

const port = process.env.PORT || 5000;
app.listen(port, () => console.log(`Listening on port ${port}...`));
