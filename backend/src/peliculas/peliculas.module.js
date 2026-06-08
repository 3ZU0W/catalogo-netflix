"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PeliculasModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const peliculas_service_1 = require("./peliculas.service");
const peliculas_controller_1 = require("./peliculas.controller");
const upload_controller_1 = require("./upload.controller");
const pelicula_entity_1 = require("./pelicula.entity");
let PeliculasModule = class PeliculasModule {
};
exports.PeliculasModule = PeliculasModule;
exports.PeliculasModule = PeliculasModule = __decorate([
    (0, common_1.Module)({
        imports: [typeorm_1.TypeOrmModule.forFeature([pelicula_entity_1.Pelicula])],
        providers: [peliculas_service_1.PeliculasService],
        controllers: [peliculas_controller_1.PeliculasController, upload_controller_1.UploadController],
        exports: [peliculas_service_1.PeliculasService],
    })
], PeliculasModule);
//# sourceMappingURL=peliculas.module.js.map