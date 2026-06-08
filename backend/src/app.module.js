"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const config_1 = require("@nestjs/config");
const auth_module_1 = require("./auth/auth.module");
const usuarios_module_1 = require("./usuarios/usuarios.module");
const peliculas_module_1 = require("./peliculas/peliculas.module");
const reservas_module_1 = require("./reservas/reservas.module");
const usuario_entity_1 = require("./usuarios/usuario.entity");
const pelicula_entity_1 = require("./peliculas/pelicula.entity");
const reserva_entity_1 = require("./reservas/reserva.entity");
const log_acceso_entity_1 = require("./auth/log-acceso.entity");
const comentarios_module_1 = require("./comentarios/comentarios.module");
const comentario_entity_1 = require("./comentarios/comentario.entity");
let AppModule = class AppModule {
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            config_1.ConfigModule.forRoot({ isGlobal: true }),
            typeorm_1.TypeOrmModule.forRoot(process.env.DATABASE_URL
                ? {
                    type: 'postgres',
                    url: process.env.DATABASE_URL,
                    entities: [usuario_entity_1.Usuario, pelicula_entity_1.Pelicula, reserva_entity_1.Reserva, log_acceso_entity_1.LogAcceso, comentario_entity_1.Comentario],
                    synchronize: true,
                    ssl: process.env.DATABASE_URL?.includes('railway')
                        ? { rejectUnauthorized: false }
                        : false,
                }
                : {
                    type: 'better-sqlite3',
                    database: 'netflick.db',
                    entities: [usuario_entity_1.Usuario, pelicula_entity_1.Pelicula, reserva_entity_1.Reserva, log_acceso_entity_1.LogAcceso, comentario_entity_1.Comentario],
                    synchronize: true,
                }),
            auth_module_1.AuthModule,
            usuarios_module_1.UsuariosModule,
            peliculas_module_1.PeliculasModule,
            reservas_module_1.ReservasModule,
            comentarios_module_1.ComentariosModule,
        ],
    })
], AppModule);
//# sourceMappingURL=app.module.js.map