import { useState } from "react";
import type { Pelicula } from "../types/pelicula";
import { TODOS_GENEROS } from "../data/peliculas";

const EDITOR_PASSWORD = "editor";

const PELICULA_VACIA: Pelicula = {
  id: 0, titulo: "", anio: new Date().getFullYear(),
  director: "", duracion_min: 0,
  generos: [], actores: [], valoraciones: [],
  portada: null, promedio_valoraciones: null, activo: true,
  estado: "en_cartelera",
  fechaEstreno: new Date().toISOString().split("T")[0],
  horarios: ["14:00", "17:00", "20:00"],
  precioEntrada: 35,
  sala: "Sala 1",
  soloMayores18: false,
  sinopsis: "",
};

const AdminModal = ({
  pelicula, onGuardar, onClose, token,
}: {
  pelicula: Pelicula | null;
  onGuardar: (p: Pelicula, archivo: File | null) => void;
  onClose: () => void;
  token: string | null;
}) => {
  const [verificado, setVerificado] = useState(false);
  const [claveInput, setClaveInput] = useState("");
  const [claveError, setClaveError] = useState("");

  const [form, setForm] = useState<Pelicula>(pelicula ?? PELICULA_VACIA);
  const [error, setError] = useState("");
  const [horariosStr, setHorariosStr] = useState((pelicula?.horarios ?? ["14:00", "17:00", "20:00"]).join(", "));
  const [archivoPortada, setArchivoPortada] = useState<File | null>(null);

  const [actoresStr, setActoresStr] = useState(
    (pelicula?.actores ?? [])
      .map(a => `${a.nombre} ${a.apellido}${a.personaje ? ` (${a.personaje})` : ""}`)
      .join("\n")
  );

  const set = (campo: string, valor: unknown) =>
    setForm(prev => ({ ...prev, [campo]: valor }));

  const toggleGenero = (id: number, nombre: string) => {
    const existe = form.generos.some(g => g.id === id);
    set("generos", existe
      ? form.generos.filter(g => g.id !== id)
      : [...form.generos, { id, nombre }]
    );
  };

  const handleVerificarClave = () => {
    if (claveInput === EDITOR_PASSWORD) {
      setVerificado(true);
      setClaveError("");
    } else {
      setClaveError("Contraseña incorrecta. Inténtalo de nuevo.");
      setClaveInput("");
    }
  };

  const handleGuardar = () => {
    if (!form.titulo.trim()) { setError("El título es obligatorio"); return; }
    if (!form.director.trim()) { setError("El director es obligatorio"); return; }
    if (form.anio < 1900 || form.anio > 2030) { setError("Año inválido"); return; }
    if (form.duracion_min <= 0) { setError("La duración debe ser mayor a 0"); return; }
    if (!form.sinopsis.trim()) { setError("La sinopsis es obligatoria"); return; }
    if (form.precioEntrada <= 0) { setError("El precio debe ser mayor a 0"); return; }

    const horariosParsed = horariosStr.split(",").map(h => h.trim()).filter(Boolean);
    if (horariosParsed.length === 0) { setError("Ingresa al menos un horario"); return; }

    const actoresParsed = actoresStr.split("\n").map((linea, index) => {
      const texto = linea.trim();
      if (!texto) return null;

      const match = texto.match(/^(.*?)\s*\((.*?)\)$/);
      let nombreCompleto = texto;
      let personaje = "";

      if (match) {
        nombreCompleto = match[1].trim();
        personaje = match[2].trim();
      }

      const partesNombre = nombreCompleto.split(" ");
      const nombre = partesNombre[0] || "Desconocido";
      const apellido = partesNombre.slice(1).join(" ") || "...";

      return {
        id: pelicula?.actores[index]?.id ?? 0, 
        nombre,
        apellido,
        personaje,
      };
    }).filter(Boolean);

    onGuardar({ ...form, horarios: horariosParsed, actores: actoresParsed as any }, archivoPortada);
  };

  const inputStyle: React.CSSProperties = {
    width: "100%", background: "rgba(255,255,255,0.07)",
    border: "1px solid rgba(255,255,255,0.1)",
    borderRadius: 6, padding: "8px 12px",
    color: "#fff", fontSize: 14, outline: "none",
    boxSizing: "border-box",
  };

  const labelStyle: React.CSSProperties = {
    display: "block", color: "#aaa", fontSize: 12, marginBottom: 4,
  };

  // ─── PANTALLA DE VERIFICACIÓN DE CONTRASEÑA ───────────────────────────────
  if (!verificado) {
    return (
      <div style={{
        position: "fixed", inset: 0, zIndex: 400,
        background: "rgba(0,0,0,0.92)",
        display: "flex", alignItems: "center", justifyContent: "center",
        padding: 24,
      }} onClick={onClose}>
        <div style={{
          background: "#181818",
          border: "1px solid rgba(255,255,255,0.08)",
          borderRadius: 12, padding: 40,
          width: "100%", maxWidth: 380,
          textAlign: "center",
        }} onClick={e => e.stopPropagation()}>
          <h2 style={{
            fontFamily: "'Bebas Neue', sans-serif",
            fontSize: 26, letterSpacing: 3,
            color: "#e50914", margin: "0 0 8px",
          }}>ACCESO DE EDITOR</h2>

          <p style={{
            color: "#777", fontSize: 13, margin: "0 0 24px", lineHeight: 1.5,
          }}>
            Para editar una película necesitas la contraseña de editor.
          </p>

          <input
            type="password"
            placeholder="Contraseña de editor..."
            value={claveInput}
            onChange={e => { setClaveInput(e.target.value); setClaveError(""); }}
            onKeyDown={e => e.key === "Enter" && handleVerificarClave()}
            autoFocus
            style={{
              ...inputStyle,
              textAlign: "center",
              fontSize: 16,
              letterSpacing: 4,
              marginBottom: claveError ? 8 : 20,
            }}
          />

          {claveError && (
            <div style={{
              background: "rgba(229,9,20,0.1)",
              border: "1px solid rgba(229,9,20,0.3)",
              borderRadius: 6, padding: "8px 12px",
              color: "#ff6b6b", fontSize: 13,
              marginBottom: 16,
            }}>
              {claveError}
            </div>
          )}

          <div style={{ display: "flex", gap: 10 }}>
            <button onClick={handleVerificarClave} style={{
              flex: 1, background: "#e50914", border: "none",
              borderRadius: 6, padding: "11px", color: "#fff",
              fontFamily: "'Bebas Neue', sans-serif",
              fontSize: 17, letterSpacing: 2, cursor: "pointer",
            }}>CONFIRMAR</button>
            <button onClick={onClose} style={{
              flex: 1, background: "rgba(255,255,255,0.07)",
              border: "1px solid rgba(255,255,255,0.1)",
              borderRadius: 6, padding: "11px",
              color: "#aaa", fontSize: 14, cursor: "pointer",
            }}>Cancelar</button>
          </div>
        </div>
      </div>
    );
  }

  // ─── FORMULARIO DE EDICIÓN ──────────────────────────────
  return (
    <div style={{
      position: "fixed", inset: 0, zIndex: 400,
      background: "rgba(0,0,0,0.9)",
      display: "flex", alignItems: "center", justifyContent: "center",
      padding: 24,
    }} onClick={onClose}>
      <div style={{
        background: "#181818",
        border: "1px solid rgba(255,255,255,0.08)",
        borderRadius: 12, padding: 36,
        width: "100%", maxWidth: 520,
        maxHeight: "92vh", overflow: "auto",
      }} onClick={e => e.stopPropagation()}>

        <h2 style={{
          fontFamily: "'Bebas Neue', sans-serif",
          fontSize: 28, letterSpacing: 3,
          color: "#e50914", margin: "0 0 24px",
        }}>{pelicula ? "Editar Película" : "Agregar Película"}</h2>

        {error && (
          <div style={{
            background: "rgba(229,9,20,0.1)", border: "1px solid rgba(229,9,20,0.3)",
            borderRadius: 6, padding: "10px 14px",
            color: "#ff6b6b", fontSize: 13, marginBottom: 16,
          }}>{error}</div>
        )}

        {[
          { label: "Título *", campo: "titulo", tipo: "text" },
          { label: "Director *", campo: "director", tipo: "text" },
          { label: "Año *", campo: "anio", tipo: "number" },
          { label: "Duración (min) *", campo: "duracion_min", tipo: "number" },
          { label: "Precio entrada (Bs.) *", campo: "precioEntrada", tipo: "number" },
          { label: "Sala *", campo: "sala", tipo: "text" },
          { label: "Fecha estreno *", campo: "fechaEstreno", tipo: "date" },
        ].map(f => (
          <div key={f.campo} style={{ marginBottom: 14 }}>
            <label style={labelStyle}>{f.label}</label>
            <input
              type={f.tipo}
              value={(form as unknown as Record<string, unknown>)[f.campo] as string ?? ""}
              onChange={e => set(f.campo, f.tipo === "number" ? Number(e.target.value) : e.target.value)}
              style={{ ...inputStyle, colorScheme: f.tipo === "date" ? "dark" : undefined }}
            />
          </div>
        ))}

        {/* Portada */}
        <div style={{ marginBottom: 14 }}>
          <label style={labelStyle}>Portada</label>
          <input
            type="file"
            accept="image/jpg,image/jpeg,image/png,image/webp"
            onChange={e => setArchivoPortada(e.target.files?.[0] ?? null)}
            style={{ ...inputStyle, padding: "6px 12px", cursor: "pointer" }}
          />
          {(archivoPortada || form.portada) && (
            <img
              src={archivoPortada ? URL.createObjectURL(archivoPortada) : form.portada!}
              alt="preview"
              style={{ marginTop: 8, width: "100%", maxHeight: 120, objectFit: "cover", borderRadius: 6 }}
            />
          )}
        </div>

        {/* Sinopsis */}
        <div style={{ marginBottom: 14 }}>
          <label style={labelStyle}>Sinopsis *</label>
          <textarea
            value={form.sinopsis}
            onChange={e => set("sinopsis", e.target.value)}
            rows={3}
            style={{ ...inputStyle, resize: "none" }}
            placeholder="Descripción de la película..."
          />
        </div>

        {/* Apartado para Actores */}
        <div style={{ marginBottom: 14 }}>
          <label style={labelStyle}>Actores * (Uno por línea en formato: Nombre Apellido (Personaje))</label>
          <textarea
            value={actoresStr}
            onChange={e => setActoresStr(e.target.value)}
            rows={4}
            style={{ ...inputStyle, resize: "vertical" }}
            placeholder={`Ejemplo:\nRobert Downey Jr. (Iron Man)\nChris Evans (Capitán América)`}
          />
        </div>

        <div style={{ marginBottom: 14 }}>
          <label style={labelStyle}>Horarios * (separados por coma, ej: 14:00, 17:30, 20:00)</label>
          <input
            type="text"
            value={horariosStr}
            onChange={e => setHorariosStr(e.target.value)}
            style={inputStyle}
            placeholder="14:00, 17:30, 20:00"
          />
        </div>

        <div style={{ marginBottom: 14 }}>
          <label style={labelStyle}>Estado</label>
          <select
            value={form.estado}
            onChange={e => set("estado", e.target.value)}
            style={{ ...inputStyle, cursor: "pointer" }}
          >
            <option value="en_cartelera">En Cartelera</option>
            <option value="proximo_estreno">Próximo Estreno</option>
          </select>
        </div>

        <div style={{ marginBottom: 20, display: "flex", alignItems: "center", gap: 10 }}>
          <input
            type="checkbox"
            id="mayor18"
            checked={form.soloMayores18}
            onChange={e => set("soloMayores18", e.target.checked)}
            style={{ width: 16, height: 16, cursor: "pointer", accentColor: "#e50914" }}
          />
          <label htmlFor="mayor18" style={{ color: "#ccc", fontSize: 13, cursor: "pointer" }}>
            Solo para mayores de 18 años (+18)
          </label>
        </div>

        <div style={{ marginBottom: 24 }}>
          <label style={{ ...labelStyle, marginBottom: 8 }}>Géneros</label>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
            {TODOS_GENEROS.map(g => {
              const activo = form.generos.some(x => x.id === g.id);
              return (
                <button type="button" key={g.id} onClick={() => toggleGenero(g.id, g.nombre)} style={{
                  background: activo ? "#e50914" : "rgba(255,255,255,0.07)",
                  border: "1px solid " + (activo ? "#e50914" : "rgba(255,255,255,0.15)"),
                  borderRadius: 20, padding: "4px 12px",
                  color: activo ? "#fff" : "#ccc",
                  fontSize: 12, cursor: "pointer", transition: "all 0.2s",
                }}>{g.nombre}</button>
              );
            })}
          </div>
        </div>

        <div style={{ display: "flex", gap: 12 }}>
          <button onClick={handleGuardar} style={{
            flex: 1, background: "#e50914", border: "none",
            borderRadius: 6, padding: "11px", color: "#fff",
            fontFamily: "'Bebas Neue', sans-serif",
            fontSize: 17, letterSpacing: 2, cursor: "pointer",
          }}>GUARDAR</button>
          <button onClick={onClose} style={{
            flex: 1, background: "rgba(255,255,255,0.07)",
            border: "1px solid rgba(255,255,255,0.1)",
            borderRadius: 6, padding: "11px",
            color: "#aaa", fontSize: 14, cursor: "pointer",
          }}>Cancelar</button>
        </div>
      </div>
    </div>
  );
};

export default AdminModal;