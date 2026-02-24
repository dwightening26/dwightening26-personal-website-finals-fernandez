"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createServer = void 0;
const core_1 = require("@nestjs/core");
const app_module_1 = require("../src/app.module");
const platform_express_1 = require("@nestjs/platform-express");
const express_1 = __importDefault(require("express"));
const server = (0, express_1.default)();
const createServer = async () => {
    const app = await core_1.NestFactory.create(app_module_1.AppModule, new platform_express_1.ExpressAdapter(server));
    app.enableCors({
        origin: ['http://localhost:5173', 'https://webprog-2025-2026-t2-react-nestjs241.vercel.app', /\.vercel\.app$/],
        methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
        credentials: true,
    });
    app.setGlobalPrefix('api');
    await app.init();
    return server;
};
exports.createServer = createServer;
exports.default = async (req, res) => {
    console.log('Incoming Vercel Request:', req.url);
    await (0, exports.createServer)();
    server(req, res);
};
//# sourceMappingURL=index.js.map