import { useState } from "react";
import type { Pelicula } from "../types/pelicula";
import { TODOS_GENEROS } from "../data/peliculas";

type Funcion = { dia: string; horarios: string[] };

const PELICULA_VACIA: Pelicula = {
  id: 0, titulo: "", anio: new Date().getFullYear(),
  director: "", duracion_min: 0,
  generos: [], actores: [], valoraciones: [],
  portada: null, promedio_valoraciones: null, activo: true,
  estado: "en_cartelera",
  fechaEstreno: new Date().toISOString().split("T")[0],
  horarios: [], funciones: [], capacidad: 15,
  precioEntrada: 35, sala: "Sala 1",
  soloMayores18: false, sinopsis: "",
};

const AdminModal = ({ pelicula, onGuardar, onClose }: {
  pelicula: Pelicula | null;
  onGuardar: (p: Pelicula, archivo: File | null) => void;
  onClose: () => void;
  token: string | null;
}) => {
  const [form, setForm] = useState<Pelicula>(pelicula ?? PELICULA_VACIA);
  const [error, setError] = useState("");
  const [archivoPortada, setArchivoPortada] = useState<File | null>(null);

  const inicial: Funcion[] =
    pelicula?.funciones && pelicula.funciones.length > 0
      ? pelicula.funciones.map(f => ({ dia: f.dia, horarios: [...f.horarios] }))
      : pelicula?.horarios?.length
        ? [{ dia: pelicula.fechaEstreno, horarios: [...pelicula.horarios] }]
        : [];

  const [funciones, setFunciones] = useState<Funcion[]>(inicial);
  const [nuevoDia, setNuevoDia] = useState(form.fechaEstreno);
  const [nuevoHorario, setNuevoHorario] = useState<Record<number, string>>({});

  const set = (campo: string, valor: unknown) =>
    setForm(prev => ({ ...prev, [campo]: valor }));

  const toggleGenero = (id: number, nombre: string) => {
    const existe = form.generos.some(g => g.id === id);
    set("generos", existe ? form.generos.filter(g => g.id !== id) : [...form.generos, { id, nombre }]);
  };

  const agregarDia = () => {
    if (!nuevoDia) { setError("Selecciona una fecha"); return; }
    if (funciones.some(f => f.dia === nuevoDia)) { setError("Ese día ya está agregado"); return; }
    setError("");
    setFunciones(prev =>
      [...prev, { dia: nuevoDia, horarios: [] }].sort((a, b) => a.dia.localeCompare(b.dia))
    );
  };

  const eliminarDia = (dia: string) =>
    setFunciones(prev => prev.filter(f => f.dia !== dia));

  const agregarHorario = (idx: number) => {
    const valor = (nuevoHorario[idx] ?? "").trim();
    if (!/^\d{1,2}:\d{2}$/.test(valor)) { setError("Formato inválido (ej: 14:30)"); return; }
    setError("");
    setFunciones(prev => prev.map((f, i) => {
      if (i !== idx || f.horarios.includes(valor)) return f;
      return { ...f, horarios: [...f.horarios, valor].sort() };
    }));
    setNuevoHorario(prev => ({ ...prev, [idx]: "" }));
  };

  const eliminarHorario = (idx: number, h: string) =>
    setFunciones(prev => prev.map((f, i) =>
      i === idx ? { ...f, horarios: f.horarios.filter(x => x !== h) } : f));

  const handleGuardar = () => {
    if (!form.titulo.trim()) { setError("El título es obligatorio"); return; }
    if (!form.director.trim()) { setError("El director es obligatorio"); return; }
    if (form.anio < 1900 || form.anio > 2030) { setError("Año inválido"); return; }
    if (form.duracion_min <= 0) { setError("La duración debe ser mayor a 0"); return; }
    if (!form.sinopsis.trim()) { setError("La sinopsis es obligatoria"); return; }
    if (form.precioEntrada <= 0) { setError("El precio debe ser mayor a 0"); return; }

    const validas = funciones.filter(f => f.horarios.length > 0);
    if (validas.length === 0) { setError("Agrega al menos un día con un horario"); return; }

    const horariosUnion = Array.from(new Set(validas.flatMap(f => f.horarios))).sort();
    onGuardar({ ...form, funciones: validas, horarios: horariosUnion }, archivoPortada);
  };

  const input: React.CSSProperties = {
    width: "100%", background: "rgba(255,255,255,0.07)",
    border: "1px solid rgba(255,255,255,0.1)", borderRadius: 6,
    padding: "8px 12px", color: "#fff", fontSize: 14, outline: "none", boxSizing: "border-box",
  };
  const lbl: React.CSSProperties = { display: "block", color: "#aaa", fontSize: 12, marginBottom: 4 };

  const formatoDia = (iso: string) => {
    const d = new Date(iso + "T00:00:00");
    if (isNaN(d.getTime())) return iso;
    return d.toLocaleDateString("es-BO", { weekday: "short", day: "2-digit", month: "short" });
  };

  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 400, background: "rgba(0,0,0,0.9)",
      display: "flex", alignItems: "center", justifyContent: "center", padding: 24 }}
      onClick={onClose}>
      <div style={{ background: "#181818", border: "1px solid rgba(255,255,255,0.08)",
        borderRadius: 12, padding: 36, width: "100%", maxWidth: 520,
        maxHeight: "92vh", overflow: "auto" }}
        onClick={e => e.stopPropagation()}>

        <h2 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 28, letterSpacing: 3,
          color: "#e50914", margin: "0 0 24px" }}>
          {pelicula ? "Editar Película" : "Agregar Película"}
        </h2>

        {error && (
          <div style={{ background: "rgba(229,9,20,0.1)", border: "1px solid rgba(229,9,20,0.3)",
            borderRadius: 6, padding: "10px 14px", color: "#ff6b6b", fontSize: 13, marginBottom: 16 }}>
            {error}
          </div>
        )}

        {([
          { label: "Título *", campo: "titulo", tipo: "text" },
          { label: "Director *", campo: "director", tipo: "text" },
          { label: "Año *", campo: "anio", tipo: "number" },
          { label: "Duración (min) *", campo: "duracion_min", tipo: "number" },
          { label: "Precio entrada (Bs.) *", campo: "precioEntrada", tipo: "number" },
          { label: "Sala *", campo: "sala", tipo: "text" },
          { label: "Fecha estreno *", campo: "fechaEstreno", tipo: "date" },
        ] as const).map(f => (
          <div key={f.campo} style={{ marginBottom: 14 }}>
            <label style={lbl}>{f.label}</label>
            <input type={f.tipo}
              value={(form as any)[f.campo] ?? ""}
              onChange={e => set(f.campo, f.tipo === "number" ? Number(e.target.value) : e.target.value)}
              style={{ ...input, colorScheme: f.tipo === "date" ? "dark" : undefined }} />
          </div>
        ))}

        {/* Portada */}
        <div style={{ marginBottom: 14 }}>
          <label style={lbl}>Portada</label>
          <input type="file" accept="image/*"
            onChange={e => setArchivoPortada(e.target.files?.[0] ?? null)}
            style={{ ...input, padding: "6px 12px", cursor: "pointer" }} />
          {(archivoPortada || form.portada) && (
            <img src={archivoPortada ? URL.createObjectURL(archivoPortada) : form.portada!}
              alt="preview"
              style={{ marginTop: 8, width: "100%", maxHeight: 120, objectFit: "cover", borderRadius: 6 }} />
          )}
        </div>

        {/* Sinopsis */}
        <div style={{ marginBottom: 14 }}>
          <label style={lbl}>Sinopsis *</label>
          <textarea value={form.sinopsis} onChange={e => set("sinopsis", e.target.value)}
            rows={3} style={{ ...input, resize: "none" }} placeholder="Descripción..." />
        </div>

        {/* Actores */}
        <div style={{ marginBottom: 14 }}>
          <label style={lbl}>Actores</label>
          <textarea
            value={form.actores.join("\n")}
            onChange={e =>
              set(
                "actores",
                e.target.value
                  .split("\n")
                  .map(a => a.trim())
                  .filter(Boolean)
              )
            }
            rows={5}
            style={{ ...input, resize: "vertical" }}
            placeholder={`Anna Faris (Cindy Campbell)
        Regina Hall (Brenda Meeks)
        Marlon Wayans (Shorty Meeks)`}
          />
        </div>

        {/* Funciones: día → horarios */}
        <div style={{ marginBottom: 20 }}>
          <label style={{ ...lbl, marginBottom: 8 }}>Funciones — primero el día, luego sus horarios *</label>

          <div style={{ display: "flex", gap: 8, marginBottom: 12 }}>
            <input type="date" value={nuevoDia} onChange={e => setNuevoDia(e.target.value)}
              style={{ ...input, colorScheme: "dark", flex: 1 }} />
            <button onClick={agregarDia} style={{ background: "rgba(229,9,20,0.15)",
              border: "1px solid rgba(229,9,20,0.4)", borderRadius: 6, padding: "0 16px",
              color: "#e50914", fontSize: 13, fontWeight: 600, cursor: "pointer", whiteSpace: "nowrap" }}>
              + Día
            </button>
          </div>

          {funciones.length === 0 && (
            <p style={{ color: "#666", fontSize: 12, fontStyle: "italic" }}>
              Agrega un día y luego sus horarios.
            </p>
          )}

          {funciones.map((f, idx) => (
            <div key={f.dia} style={{ background: "rgba(255,255,255,0.04)",
              border: "1px solid rgba(255,255,255,0.08)", borderRadius: 8, padding: 12, marginBottom: 10 }}>

              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
                <span style={{ color: "#fff", fontSize: 13, fontWeight: 600 }}>
                 {formatoDia(f.dia)} <span style={{ color: "#666", fontWeight: 400 }}>({f.dia})</span>
                </span>
                <button onClick={() => eliminarDia(f.dia)}
                  style={{ background: "none", border: "none", color: "#e50914", fontSize: 12, cursor: "pointer" }}>
                  Eliminar día
                </button>
              </div>

              <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 8 }}>
                {f.horarios.length === 0 && (
                  <span style={{ color: "#666", fontSize: 12, fontStyle: "italic" }}>Sin horarios</span>
                )}
                {f.horarios.map(h => (
                  <span key={h} style={{ background: "rgba(229,9,20,0.15)",
                    border: "1px solid rgba(229,9,20,0.3)", borderRadius: 20,
                    padding: "3px 10px", color: "#fff", fontSize: 12,
                    display: "flex", alignItems: "center", gap: 6 }}>
                    {h}
                    <button onClick={() => eliminarHorario(idx, h)}
                      style={{ background: "none", border: "none", color: "#ff9b9b",
                        fontSize: 13, cursor: "pointer", padding: 0, lineHeight: 1 }}>✕</button>
                  </span>
                ))}
              </div>

              <div style={{ display: "flex", gap: 8 }}>
                <input type="time" value={nuevoHorario[idx] ?? ""}
                  onChange={e => setNuevoHorario(prev => ({ ...prev, [idx]: e.target.value }))}
                  style={{ ...input, colorScheme: "dark", flex: 1 }} />
                <button onClick={() => agregarHorario(idx)}
                  style={{ background: "rgba(255,255,255,0.07)", border: "1px solid rgba(255,255,255,0.15)",
                    borderRadius: 6, padding: "0 14px", color: "#ccc", fontSize: 12,
                    cursor: "pointer", whiteSpace: "nowrap" }}>
                  + Horario
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Estado */}
        <div style={{ marginBottom: 14 }}>
          <label style={lbl}>Estado</label>
          <select value={form.estado} onChange={e => set("estado", e.target.value)}
            style={{ ...input, cursor: "pointer" }}>
            <option value="en_cartelera">En Cartelera</option>
            <option value="proximo_estreno">Próximo Estreno</option>
          </select>
        </div>

        <div style={{ marginBottom: 20, display: "flex", alignItems: "center", gap: 10 }}>
          <input type="checkbox" id="mayor18" checked={form.soloMayores18}
            onChange={e => set("soloMayores18", e.target.checked)}
            style={{ width: 16, height: 16, cursor: "pointer", accentColor: "#e50914" }} />
          <label htmlFor="mayor18" style={{ color: "#ccc", fontSize: 13, cursor: "pointer" }}>
            Solo para mayores de 18 años (+18)
          </label>
        </div>

        {/* Géneros */}
        <div style={{ marginBottom: 24 }}>
          <label style={{ ...lbl, marginBottom: 8 }}>Géneros</label>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
            {TODOS_GENEROS.map(g => {
              const activo = form.generos.some(x => x.id === g.id);
              return (
                <button key={g.id} onClick={() => toggleGenero(g.id, g.nombre)} style={{
                  background: activo ? "#e50914" : "rgba(255,255,255,0.07)",
                  border: "1px solid " + (activo ? "#e50914" : "rgba(255,255,255,0.15)"),
                  borderRadius: 20, padding: "4px 12px", color: activo ? "#fff" : "#ccc",
                  fontSize: 12, cursor: "pointer" }}>
                  {g.nombre}
                </button>
              );
            })}
          </div>
        </div>

        <div style={{ display: "flex", gap: 12 }}>
          <button onClick={handleGuardar} style={{ flex: 1, background: "#e50914", border: "none",
            borderRadius: 6, padding: "11px", color: "#fff", fontFamily: "'Bebas Neue', sans-serif",
            fontSize: 17, letterSpacing: 2, cursor: "pointer" }}>GUARDAR</button>
          <button onClick={onClose} style={{ flex: 1, background: "rgba(255,255,255,0.07)",
            border: "1px solid rgba(255,255,255,0.1)", borderRadius: 6, padding: "11px",
            color: "#aaa", fontSize: 14, cursor: "pointer" }}>Cancelar</button>
        </div>
      </div>
    </div>
  );
};

export default AdminModal;