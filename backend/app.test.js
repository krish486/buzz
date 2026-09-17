const assert = require("node:assert/strict");
const http = require("node:http");
const test = require("node:test");
const app = require("./src/app");

test("GET /health reports that the HTTP server is available", async (t) => {
    const server = http.createServer(app);

    await new Promise((resolve) => server.listen(0, "127.0.0.1", resolve));
    t.after(() => new Promise((resolve) => server.close(resolve)));

    const { port } = server.address();
    const response = await fetch(`http://127.0.0.1:${port}/health`);

    assert.equal(response.status, 200);
    assert.deepEqual(await response.json(), { status: "ok" });
});
