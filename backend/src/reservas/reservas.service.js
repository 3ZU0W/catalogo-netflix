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
exports.ReservasService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const reserva_entity_1 = require("./reserva.entity");
const CAPACIDAD_SALA = 15;
let ReservasService = class ReservasService {
    repo;
    constructor(repo) {
        this.repo = repo;
    }
    async asientosOcupados(peliculaId, dia, horario) {
        const reservas = await this.repo.find({
            where: { peliculaId, dia, horario, estado: 'confirmada' },
        });
        return reservas.reduce((s, r) => s + r.asientos, 0);
    }
    async crear(datos) {
        const peliculaId = Number(datos.peliculaId);
        const dia = datos.dia ?? '';
        const horario = datos.horario ?? '';
        const asientos = Number(datos.asientos ?? 1);
        if (asientos < 1)
            throw new common_1.BadRequestException('Debe reservar al menos un asiento');
        const ocupados = await this.asientosOcupados(peliculaId, dia, horario);
        const disponibles = CAPACIDAD_SALA - ocupados;
        if (disponibles <= 0)
            throw new common_1.BadRequestException('Sala llena: no quedan asientos para esta función');
        if (asientos > disponibles)
            throw new common_1.BadRequestException(`Solo quedan ${disponibles} asiento(s) disponibles`);
        const r = this.repo.create(datos);
        return this.repo.save(r);
    }
    listarPorUsuario(usuarioId) {
        return this.repo.find({ where: { usuarioId }, order: { fecha: 'DESC' } });
    }
    listarTodas() {
        return this.repo.find({ order: { fecha: 'DESC' } });
    }
    async ocupacionPorPelicula(peliculaId) {
        const reservas = await this.repo.find({
            where: { peliculaId, estado: 'confirmada' },
        });
        const mapa = new Map();
        for (const r of reservas) {
            const clave = `${r.dia}||${r.horario}`;
            mapa.set(clave, (mapa.get(clave) ?? 0) + r.asientos);
        }
        return Array.from(mapa.entries()).map(([clave, ocupados]) => {
            const [dia, horario] = clave.split('||');
            return {
                dia,
                horario,
                ocupados,
                disponibles: Math.max(0, CAPACIDAD_SALA - ocupados),
                llena: ocupados >= CAPACIDAD_SALA,
            };
        });
    }
    async cancelar(id) {
        const r = await this.repo.findOne({ where: { id } });
        if (!r)
            throw new common_1.NotFoundException('Reserva no encontrada');
        await this.repo.update(id, { estado: 'cancelada' });
    }
    async eliminar(id) {
        const r = await this.repo.findOne({ where: { id } });
        if (!r)
            throw new common_1.NotFoundException('Reserva no encontrada');
        await this.repo.delete(id);
    }
};
exports.ReservasService = ReservasService;
exports.ReservasService = ReservasService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(reserva_entity_1.Reserva)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], ReservasService);
//# sourceMappingURL=reservas.service.js.map