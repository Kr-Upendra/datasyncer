import dotenv from "dotenv";
dotenv.config();

import http from "http";
import app from "./app";

const PORT = process.env.PORT || 9001;

const startServer = async () => {
  const server = http.createServer(app);
  server.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}/`);
  });
};

startServer();
