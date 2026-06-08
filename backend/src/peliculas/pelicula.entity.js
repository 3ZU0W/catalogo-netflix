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
Object.defineProperty(exports, "__esModule", { value: true });
exports.Pelicula = void 0;
const typeorm_1 = require("typeorm");
let Pelicula = class Pelicula {
    id;
    titulo;
    anio;
    director;
    duracion_min;
    sinopsis;
    portada;
    estado;
    fechaEstreno;
    horarios;
    funciones;
    capacidad;
    precioEntrada;
    sala;
    soloMayores18;
    generos;
    actores;
    valoraciones;
    promedio_valoraciones;
    activo;
};
exports.Pelicula = Pelicula;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], Pelicula.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Pelicula.prototype, "titulo", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", Number)
], Pelicula.prototype, "anio", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Pelicula.prototype, "director", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", Number)
], Pelicula.prototype, "duracion_min", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], Pelicula.prototype, "sinopsis", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    __metadata("design:type", String)
], Pelicula.prototype, "portada", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: 'en_cartelera' }),
    __metadata("design:type", String)
], Pelicula.prototype, "estado", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Pelicula.prototype, "fechaEstreno", void 0);
__decorate([
    (0, typeorm_1.Column)('simple-array'),
    __metadata("design:type", Array)
], Pelicula.prototype, "horarios", void 0);
__decorate([
    (0, typeorm_1.Column)('simple-json', { default: '[]' }),
    __metadata("design:type", Array)
], Pelicula.prototype, "funciones", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: 15 }),
    __metadata("design:type", Number)
], Pelicula.prototype, "capacidad", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'float', default: 35 }),
    __metadata("design:type", Number)
], Pelicula.prototype, "precioEntrada", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: 'Sala 1' }),
    __metadata("design:type", String)
], Pelicula.prototype, "sala", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: false }),
    __metadata("design:type", Boolean)
], Pelicula.prototype, "soloMayores18", void 0);
__decorate([
    (0, typeorm_1.Column)('simple-json', { default: '[]' }),
    __metadata("design:type", Array)
], Pelicula.prototype, "generos", void 0);
__decorate([
    (0, typeorm_1.Column)('simple-json', { default: '[]' }),
    __metadata("design:type", Array)
], Pelicula.prototype, "actores", void 0);
__decorate([
    (0, typeorm_1.Column)('simple-json', { default: '[]' }),
    __metadata("design:type", Array)
], Pelicula.prototype, "valoraciones", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'real', nullable: true }),
    __metadata("design:type", Number)
], Pelicula.prototype, "promedio_valoraciones", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: true }),
    __metadata("design:type", Boolean)
], Pelicula.prototype, "activo", void 0);
exports.Pelicula = Pelicula = __decorate([
    (0, typeorm_1.Entity)()
], Pelicula);
//# sourceMappingURL=pelicula.entity.js.map