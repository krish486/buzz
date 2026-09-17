const express = require("express");
const cors = require("cors");
const authRoute = require("./modules/auth/auth.routes");
const buzzRoute = require("./modules/buzz/buzz.routes");

const app = express();

app.use(
    cors({
        origin: [process.env.USER_FRONTEND, process.env.ADMIN_FRONTEND].filter(Boolean),
    })
);

app.use(express.json());

app.get("/health", (req, res) => {
    res.status(200).json({ status: "ok" });
});

app.use("/app", authRoute);
app.use("/app", buzzRoute);

module.exports = app;
