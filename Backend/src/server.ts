import http from "http";
import app from "./app.js";
import { initSocket } from "./websocket/socket.js";

const PORT = 8000;

// Create HTTP server from Express app
const server = http.createServer(app);

// Initialize socket with server
initSocket(server);

server.listen(PORT);
