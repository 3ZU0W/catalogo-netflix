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
exports.PeliculasService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const pelicula_entity_1 = require("./pelicula.entity");
let PeliculasService = class PeliculasService {
    repo;
    constructor(repo) {
        this.repo = repo;
    }
    listar() {
        return this.repo.find({ where: { activo: true } });
    }
    async buscarPorId(id) {
        const p = await this.repo.findOne({ where: { id } });
        if (!p)
            throw new common_1.NotFoundException('Película no encontrada');
        return p;
    }
    crear(datos) {
        const p = this.repo.create(datos);
        return this.repo.save(p);
    }
    async actualizar(id, datos) {
        await this.repo.update(id, datos);
        return this.buscarPorId(id);
    }
    async eliminar(id) {
        await this.repo.update(id, { activo: false });
    }
    async agregarValoracion(id, valoracion) {
        const p = await this.buscarPorId(id);
        const nueva = {
            id: Date.now(),
            ...valoracion,
            fecha: new Date().toLocaleDateString('es-BO'),
        };
        p.valoraciones = [...(p.valoraciones || []), nueva];
        const promedio = p.valoraciones.reduce((s, v) => s + v.puntuacion, 0) / p.valoraciones.length;
        p.promedio_valoraciones = promedio;
        return this.repo.save(p);
    }
};
exports.PeliculasService = PeliculasService;
exports.PeliculasService = PeliculasService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(pelicula_entity_1.Pelicula)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], PeliculasService);
//# sourceMappingURL=peliculas.service.js.map