const { Router } = require("express");
const { getRoomStateController } = require("./buzz.controller");

const buzzRoute = Router();

buzzRoute.get("/room/:roomId", getRoomStateController);

module.exports = buzzRoute;
