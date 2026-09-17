require("dotenv").config();

const http = require("http");
const app = require("./src/app");
const { initSocket } = require("./src/socket");
const {
    closeDatabase,
    connectDatabase
} = require("./src/database");

const port = process.env.PORT || 5000;

async function startServer() {
    await connectDatabase();

    const server = http.createServer(app);

    initSocket(server);

    await new Promise((resolve) => {
        server.listen(port, resolve);
    });

    console.log(`Server is running on http://localhost:${port}`);

    const shutdown = (signal) => {
        console.log(`${signal} received. Shutting down...`);

        server.close(async () => {
            await closeDatabase();
            process.exit(0);
        });
    };

    process.once("SIGINT", () => shutdown("SIGINT"));
    process.once("SIGTERM", () => shutdown("SIGTERM"));

    return server;
}

if (require.main === module) {
    startServer().catch((error) => {
        console.error("Unable to start the server:", error.message);
        process.exitCode = 1;
    });
}

module.exports = { startServer };