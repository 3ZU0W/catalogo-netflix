"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const app_module_1 = require("./app.module");
const usuarios_service_1 = require("./usuarios/usuarios.service");
const path_1 = require("path");
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule);
    app.enableCors({
        origin: '*',
        methods: ['GET', 'POST', 'PUT', 'DELETE'],
        allowedHeaders: ['Content-Type', 'Authorization'],
    });
    const uploadsPath = (0, path_1.join)(process.cwd(), 'uploads');
    const fs = await import('fs');
    if (!fs.existsSync(uploadsPath))
        fs.mkdirSync(uploadsPath);
    app.useStaticAssets(uploadsPath, { prefix: '/uploads' });
    const usuariosService = app.get(usuarios_service_1.UsuariosService);
    try {
        await usuariosService.crear({
            username: 'admin',
            email: 'admin@minuit-cinema.bo',
            password: 'Admin@2026',
            fechaNacimiento: '1990-01-01',
            rol: 'admin',
        });
        console.log('Usuario admin creado');
    }
    catch {
        console.log('Admin ya existe');
    }
    const { DataSource } = await import('typeorm');
    const dataSource = app.get(DataSource);
    await app.listen(3000);
    console.log('http://localhost:3000');
}
bootstrap();
//# sourceMappingURL=main.js.map