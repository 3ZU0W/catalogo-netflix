"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PeliculasController = void 0;
const common_1 = require("@nestjs/common");
const peliculas_service_1 = require("./peliculas.service");
const jwt_auth_guard_1 = require("../auth/jwt-auth.guard");
let PeliculasController = class PeliculasController {
    service;
    constructor(service) {
        this.service = service;
    }
    listar() {
        return this.service.listar();
    }
    async chatbaseFeed() {
        const peliculas = await this.service.listar();
        const activas = peliculas.filter((p) => p.activo);
        const texto = activas.map((p) => `Título: ${p.titulo}
  Año: ${p.anio}
  Estado: ${p.estado === 'en_cartelera' ? 'En cartelera' : 'Próximo estreno'}
  Géneros: ${p.generos?.map((g) => g.nombre).join(', ') || 'N/A'}
  Horarios: ${p.horarios?.join(', ') || 'N/A'}
  Sinopsis: ${p.sinopsis || 'N/A'}
  ---`).join('\n');
        return `Películas en MINUIT CINEMA:\n\n${texto}`;
    }
    buscar(id) {
        return this.service.buscarPorId(Number(id));
    }
    crear(body) {
        return this.service.crear(body);
    }
    actualizar(id, body) {
        return this.service.actualizar(Number(id), body);
    }
    eliminar(id) {
        return this.service.eliminar(Number(id));
    }
    valorar(id, body) {
        return this.service.agregarValoracion(Number(id), body);
    }
};
exports.PeliculasController = PeliculasController;
__decorate([
    (0, common_1.Get)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], PeliculasController.prototype, "listar", null);
__decorate([
    (0, common_1.Get)('chatbase-feed'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], PeliculasController.prototype, "chatbaseFeed", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], PeliculasController.prototype, "buscar", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], PeliculasController.prototype, "crear", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Put)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], PeliculasController.prototype, "actualizar", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Delete)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], PeliculasController.prototype, "eliminar", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Post)(':id/valoracion'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], PeliculasController.prototype, "valorar", null);
exports.PeliculasController = PeliculasController = __decorate([
    (0, common_1.Controller)('peliculas'),
    __metadata("design:paramtypes", [peliculas_service_1.PeliculasService])
], PeliculasController);
//# sourceMappingURL=peliculas.controller.js.map