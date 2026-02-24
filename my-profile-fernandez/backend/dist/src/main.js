"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const app_module_1 = require("./app.module");
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule);
    app.enableCors({
        origin: ['http://localhost:5173', 'http://127.0.0.1:5173'],
        methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
        credentials: true,
    });
    console.log('Backend starting...');
    console.log('Supabase URL from Env:', process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL || 'NOT_FOUND');
    await app.listen(3000);
}
bootstrap();
//# sourceMappingURL=main.js.map