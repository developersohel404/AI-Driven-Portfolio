"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.discoverRouter = void 0;
const express_1 = require("express");
const llms_controller_1 = require("./llms.controller");
exports.discoverRouter = (0, express_1.Router)();
exports.discoverRouter.get('/llms.txt', llms_controller_1.llmsController.index);
