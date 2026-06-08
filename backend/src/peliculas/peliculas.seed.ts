import { Pelicula } from './pelicula.entity';
import { DataSource } from 'typeorm';

export async function seedPeliculas(dataSource: DataSource) {
  const repo = dataSource.getRepository(Pelicula);
  const cantidad = await repo.count();
  if (cantidad > 0) return;

  const peliculas: Partial<Pelicula>[] = [
    {
      titulo: 'Minecraft: La Película',
      anio: 2025,
      director: 'Jared Hess',
      duracion_min: 101,
      sinopsis: 'Cuatro inadaptados se ven arrastrados al Mundo Inferior, un reino cubierto de bloques donde la creatividad es la única forma de sobrevivir.',
      portada: undefined,
      estado: 'en_cartelera',
      fechaEstreno: '2025-04-04',
      horarios: ['13:30', '16:00', '18:30', '21:00'],
      precioEntrada: 35,
      sala: 'Sala 1',
      soloMayores18: false,
      generos: [{ id: 1, nombre: 'Aventura' }, { id: 2, nombre: 'Familia' }],
      actores: [
        { id: 1, nombre: 'Jack', apellido: 'Black', personaje: 'Steve' },
        { id: 2, nombre: 'Jason', apellido: 'Momoa', personaje: 'Garnett' },
      ],
      valoraciones: [],
      promedio_valoraciones: undefined,
      activo: true,
    },
    {
      titulo: 'Megamente 2',
      anio: 2025,
      director: 'Tom McGrath',
      duracion_min: 98,
      sinopsis: 'El villano más brillante del mundo regresa con un nuevo plan que amenaza toda la ciudad.',
      portada: undefined,
      estado: 'en_cartelera',
      fechaEstreno: '2025-04-25',
      horarios: ['14:00', '17:00', '20:00'],
      precioEntrada: 35,
      sala: 'Sala 2',
      soloMayores18: false,
      generos: [{ id: 3, nombre: 'Animación' }, { id: 4, nombre: 'Comedia' }],
      actores: [
        { id: 3, nombre: 'Will', apellido: 'Smith', personaje: 'Metro Man' },
      ],
      valoraciones: [],
      promedio_valoraciones: undefined,
      activo: true,
    },
    {
      titulo: 'Madagascar Salvaje',
      anio: 2026,
      director: 'Eric Darnell',
      duracion_min: 92,
      sinopsis: 'Alex, Marty y sus amigos emprenden una nueva aventura por tierras desconocidas.',
      portada: undefined,
      estado: 'en_cartelera',
      fechaEstreno: '2026-01-10',
      horarios: ['11:00', '13:30', '16:00', '18:30'],
      precioEntrada: 30,
      sala: 'Sala 3',
      soloMayores18: false,
      generos: [{ id: 3, nombre: 'Animación' }, { id: 2, nombre: 'Familia' }],
      actores: [
        { id: 5, nombre: 'Ben', apellido: 'Stiller', personaje: 'Alex' },
      ],
      valoraciones: [],
      promedio_valoraciones: undefined,
      activo: true,
    },
    {
      titulo: 'Rescate Implacable 3',
      anio: 2026,
      director: 'Sam Hargrave',
      duracion_min: 130,
      sinopsis: 'Tyler Rake regresa en la misión más peligrosa de su vida.',
      portada: undefined,
      estado: 'en_cartelera',
      fechaEstreno: '2026-03-22',
      horarios: ['15:00', '18:00', '21:00', '23:30'],
      precioEntrada: 40,
      sala: 'Sala IMAX',
      soloMayores18: false,
      generos: [{ id: 5, nombre: 'Acción' }, { id: 6, nombre: 'Thriller' }],
      actores: [
        { id: 9, nombre: 'Chris', apellido: 'Hemsworth', personaje: 'Tyler Rake' },
      ],
      valoraciones: [],
      promedio_valoraciones: undefined,
      activo: true,
    },
    {
      titulo: 'Estación Zombie',
      anio: 2016,
      director: 'Yeon Sang-ho',
      duracion_min: 118,
      sinopsis: 'Un hombre y su hija viajan en tren cuando un brote zombi azota Corea del Sur.',
      portada: undefined,
      estado: 'en_cartelera',
      fechaEstreno: '2026-05-01',
      horarios: ['19:00', '21:30'],
      precioEntrada: 35,
      sala: 'Sala 4',
      soloMayores18: false,
      generos: [{ id: 6, nombre: 'Thriller' }, { id: 7, nombre: 'Terror' }],
      actores: [
        { id: 10, nombre: 'Gong', apellido: 'Yoo', personaje: 'Seok-woo' },
      ],
      valoraciones: [],
      promedio_valoraciones: undefined,
      activo: true,
    },
    {
      titulo: 'Blanca Nieves',
      anio: 2025,
      director: 'Marc Webb',
      duracion_min: 110,
      sinopsis: 'Una reimaginación del cuento clásico en live-action.',
      portada: undefined,
      estado: 'proximo_estreno',
      fechaEstreno: '2026-07-04',
      horarios: ['14:00', '17:30', '20:30'],
      precioEntrada: 35,
      sala: 'Sala 1',
      soloMayores18: false,
      generos: [{ id: 2, nombre: 'Familia' }, { id: 8, nombre: 'Musical' }],
      actores: [
        { id: 7, nombre: 'Rachel', apellido: 'Zegler', personaje: 'Blanca Nieves' },
      ],
      valoraciones: [],
      promedio_valoraciones: undefined,
      activo: true,
    },
    {
      titulo: 'Depredador: Sangre Antigua',
      anio: 2026,
      director: 'Dan Trachtenberg',
      duracion_min: 115,
      sinopsis: 'Una guerrera indígena debe enfrentarse a la criatura más peligrosa que ha pisado la Tierra.',
      portada: undefined,
      estado: 'proximo_estreno',
      fechaEstreno: '2026-08-01',
      horarios: ['16:00', '19:30', '22:00'],
      precioEntrada: 40,
      sala: 'Sala 2',
      soloMayores18: true,
      generos: [{ id: 5, nombre: 'Acción' }, { id: 7, nombre: 'Terror' }],
      actores: [
        { id: 13, nombre: 'Amber', apellido: 'Midthunder', personaje: 'Kaya' },
      ],
      valoraciones: [],
      promedio_valoraciones: undefined,
      activo: true,
    },
  ];
  // Genera funciones para 4 días consecutivos a partir de la fecha de estreno,
  // reutilizando los horarios definidos en cada película.
  const generarFunciones = (fechaBase: string, horarios: string[]) => {
    const funciones: { dia: string; horarios: string[] }[] = [];
    const base = new Date(fechaBase + 'T00:00:00');
    for (let i = 0; i < 4; i++) {
      const d = new Date(base);
      d.setDate(base.getDate() + i);
      const dia = d.toISOString().split('T')[0];
      // El último día ofrece menos horarios, para variar la cartelera
      const lista = i === 3 ? horarios.slice(0, Math.max(1, horarios.length - 1)) : horarios;
      funciones.push({ dia, horarios: lista });
    }
    return funciones;
  };

  for (const p of peliculas) {
    p.capacidad = 15;
    p.funciones = generarFunciones(p.fechaEstreno!, p.horarios ?? []);
    await repo.save(repo.create(p));
  }

  console.log('✅ Películas de ejemplo creadas');
}