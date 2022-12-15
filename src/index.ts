import express, { Response, Request } from "express";
import bodyParser from "body-parser";
import routes from "./routes";

const cors = require("cors");

const server = express();
const port = 3333;

server.use(bodyParser.json());
server.use(cors());
server.use(routes);

server.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
