import { useState, useEffect, useMemo } from "react";
import type { Pelicula } from "../types/pelicula";
import { useAuth, calcularEdad } from "../context/AuthContext";
import { api } from "../api/api";

type Ocupacion = {
  dia: string;
  horario: string;
  ocupados: number;
  disponibles: number;
  llena: boolean;
};

const formatoDia = (iso: string) => {
  const d = new Date(iso + "T00:00:00");
  if (isNaN(d.getTime())) return iso;
  return d.toLocaleDateString("es-BO", { weekday: "short", day: "2-digit", month: "short" });
};

const ReservaModal = ({ pelicula, onClose }: { pelicula: Pelicula; onClose: () => void }) => {
  const { usuario, token, agregarReserva } = useAuth();
  const capacidad = pelicula.capacidad ?? 15;

  const funciones = useMemo(() => {
    if (pelicula.funciones && pelicula.funciones.length > 0) return pelicula.funciones;
    return [{ dia: pelicula.fechaEstreno, horarios: pelicula.horarios }];
  }, [pelicula]);

  const [dia, setDia] = useState(funciones[0]?.dia ?? "");
  const horariosDelDia = useMemo(
    () => funciones.find(f => f.dia === dia)?.horarios ?? [],
    [funciones, dia],
  );
  const [horario, setHorario] = useState(horariosDelDia[0] ?? "");
  const [asientos, setAsientos] = useState(1);
  const [confirmado, setConfirmado] = useState(false);
  const [ocupacion, setOcupacion] = useState<Ocupacion[]>([]);
  const [error, setError] = useState("");
  const [guardando, setGuardando] = useState(false);

  useEffect(() => {
    if (!token) return;
    api.getOcupacion(pelicula.id, token).then((data: Ocupacion[]) => setOcupacion(data || []));
  }, [pelicula.id, token]);

  useEffect(() => {
    setHorario(horariosDelDia[0] ?? "");
    setAsientos(1);
  }, [dia, horariosDelDia]);

  if (!usuario) return null;

  const edad = calcularEdad(usuario.fechaNacimiento);
  const bloqueado = pelicula.soloMayores18 && edad < 18;

  const ocupadosDe = (d: string, h: string) =>
    ocupacion.find(o => o.dia === d && o.horario === h)?.ocupados ?? 0;
  const disponiblesDe = (d: string, h: string) => Math.max(0, capacidad - ocupadosDe(d, h));

  const diaConEspacio = (d: string) => {
    const f = funciones.find(x => x.dia === d);
    if (!f) return false;
    return f.horarios.some(h => disponiblesDe(d, h) > 0);
  };

  const disponibles = disponiblesDe(dia, horario);
  const llena = disponibles <= 0;
  const maxAsientos = Math.min(8, disponibles);
  const total = pelicula.precioEntrada * asientos;

  const handleConfirmar = async () => {
    setError("");
    if (llena) { setError("Sala llena: elige otro día u horario."); return; }
    if (asientos > disponibles) { setError(`Solo quedan ${disponibles} asiento(s).`); return; }
    setGuardando(true);
    try {
      await agregarReserva({
        peliculaId: pelicula.id,
        peliculaTitulo: pelicula.titulo,
        peliculaPortada: pelicula.portada,
        usuarioId: usuario.id,
        dia,
        horario,
        asientos,
        total,
        fecha: new Date().toLocaleDateString("es-BO"),
        sala: pelicula.sala,
      });
      setConfirmado(true);
    } catch (e) {
      setError(e instanceof Error ? e.message : "No se pudo crear la reserva");
      if (token) {
        const data = await api.getOcupacion(pelicula.id, token);
        setOcupacion(data || []);
      }
    } finally {
      setGuardando(false);
    }
  };

  const circleBtn: React.CSSProperties = {
    width: 36, height: 36, borderRadius: "50%",
    background: "rgba(255,255,255,0.08)",
    border: "1px solid rgba(255,255,255,0.15)",
    color: "#fff", fontSize: 20, cursor: "pointer",
    display: "flex", alignItems: "center", justifyContent: "center",
  };

  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 500, background: "rgba(0,0,0,0.92)",
      display: "flex", alignItems: "center", justifyContent: "center", padding: 16 }}
      onClick={onClose}>
      <div style={{ background: "#181818", border: "1px solid rgba(255,255,255,0.08)",
        borderRadius: 14, padding: "36px 32px", width: "100%", maxWidth: 440,
        maxHeight: "92vh", overflowY: "auto", boxShadow: "0 24px 80px rgba(0,0,0,0.9)" }}
        onClick={e => e.stopPropagation()}>

        {bloqueado ? (
          <div style={{ textAlign: "center", padding: "20px 0" }}>
            <h3 style={{ color: "#e50914", fontFamily: "'Bebas Neue',sans-serif", fontSize: 26, letterSpacing: 3, margin: "0 0 12px" }}>
              CONTENIDO RESTRINGIDO
            </h3>
            <p style={{ color: "#aaa", fontSize: 14, lineHeight: 1.6 }}>
              Esta película es solo para mayores de 18 años.<br />
              Tu cuenta indica que tienes <strong style={{ color: "#fff" }}>{edad} años</strong>.
            </p>
            <button onClick={onClose} style={{ marginTop: 24, background: "#333", border: "none",
              borderRadius: 6, padding: "10px 28px", color: "#fff", cursor: "pointer", fontSize: 14 }}>
              Cerrar
            </button>
          </div>

        ) : confirmado ? (
          <div style={{ textAlign: "center", padding: "20px 0" }}>
            <h3 style={{ color: "#4caf50", fontFamily: "'Bebas Neue',sans-serif", fontSize: 28, letterSpacing: 3, margin: "0 0 12px" }}>
              ¡RESERVA CONFIRMADA!
            </h3>
            <p style={{ color: "#ccc", fontSize: 14, margin: "0 0 6px" }}>{pelicula.titulo}</p>
            <p style={{ color: "#aaa", fontSize: 13, margin: "0 0 4px" }}>DIA: {formatoDia(dia)}</p>
            <p style={{ color: "#aaa", fontSize: 13, margin: "0 0 4px" }}>HORA: {horario} — {pelicula.sala}</p>
            <p style={{ color: "#aaa", fontSize: 13, margin: "0 0 20px" }}>
              🎟️ {asientos} entrada{asientos > 1 ? "s" : ""} — Bs. {total}
            </p>
            <button onClick={onClose} style={{ background: "#e50914", border: "none", borderRadius: 6,
              padding: "10px 28px", color: "#fff", fontFamily: "'Bebas Neue',sans-serif",
              fontSize: 17, letterSpacing: 2, cursor: "pointer" }}>
              LISTO
            </button>
          </div>

        ) : (
          <>
            <h2 style={{ fontFamily: "'Bebas Neue',sans-serif", fontSize: 26, letterSpacing: 3,
              color: "#e50914", margin: "0 0 4px" }}>COMPRAR ENTRADAS</h2>
            <p style={{ color: "#aaa", fontSize: 13, margin: "0 0 20px" }}>
              {pelicula.titulo} — {pelicula.sala} ({capacidad} asientos por función)
            </p>

            {error && (
              <div style={{ background: "rgba(229,9,20,0.1)", border: "1px solid rgba(229,9,20,0.3)",
                borderRadius: 6, padding: "10px 14px", color: "#ff6b6b", fontSize: 13, marginBottom: 16 }}>
                {error}
              </div>
            )}

            {/* Paso 1: Día */}
            <div style={{ marginBottom: 20 }}>
              <label style={{ display: "block", color: "#aaa", fontSize: 12, marginBottom: 8 }}>
                1. Selecciona el día
              </label>
              <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                {funciones.map(f => {
                  const conEspacio = diaConEspacio(f.dia);
                  return (
                    <button key={f.dia} onClick={() => setDia(f.dia)} style={{
                      background: dia === f.dia ? "#e50914" : "rgba(255,255,255,0.07)",
                      border: `1px solid ${dia === f.dia ? "#e50914" : "rgba(255,255,255,0.15)"}`,
                      borderRadius: 6, padding: "8px 14px",
                      color: conEspacio ? "#fff" : "#888", cursor: "pointer", fontSize: 13,
                      fontWeight: dia === f.dia ? 700 : 400,
                    }}>
                      {formatoDia(f.dia)}
                      {!conEspacio && (
                        <span style={{ display: "block", fontSize: 9, color: "#e50914", marginTop: 2 }}>
                          LLENO
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Paso 2: Horario según el día */}
            <div style={{ marginBottom: 20 }}>
              <label style={{ display: "block", color: "#aaa", fontSize: 12, marginBottom: 8 }}>
                2. Selecciona el horario
              </label>
              <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                {horariosDelDia.map(h => {
                  const disp = disponiblesDe(dia, h);
                  const full = disp <= 0;
                  const activo = horario === h;
                  return (
                    <button key={h} onClick={() => !full && setHorario(h)} disabled={full} style={{
                      background: activo ? "#e50914" : "rgba(255,255,255,0.07)",
                      border: `1px solid ${activo ? "#e50914" : full ? "rgba(229,9,20,0.3)" : "rgba(255,255,255,0.15)"}`,
                      borderRadius: 6, padding: "8px 14px",
                      color: full ? "#777" : "#fff",
                      cursor: full ? "not-allowed" : "pointer", fontSize: 14,
                      fontWeight: activo ? 700 : 400, textAlign: "center", minWidth: 86,
                    }}>
                      {h}
                      <span style={{ display: "block", fontSize: 9, marginTop: 2,
                        color: full ? "#e50914" : disp <= 3 ? "#f5a623" : "#4caf50" }}>
                        {full ? "SALA LLENA" : `${disp} libres`}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Paso 3: Cantidad */}
            <div style={{ marginBottom: 20 }}>
              <label style={{ display: "block", color: "#aaa", fontSize: 12, marginBottom: 8 }}>
                3. Cantidad de entradas {!llena && <span style={{ color: "#666" }}>(máx. {maxAsientos})</span>}
              </label>
              {llena ? (
                <div style={{ background: "rgba(229,9,20,0.08)", border: "1px solid rgba(229,9,20,0.3)",
                  borderRadius: 8, padding: "12px 14px", color: "#ff6b6b", fontSize: 13 }}>
                  🚫 Esta función está <strong>llena</strong>. Prueba con otro día u horario.
                </div>
              ) : (
                <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
                  <button onClick={() => setAsientos(Math.max(1, asientos - 1))} style={circleBtn}>−</button>
                  <span style={{ fontSize: 22, fontWeight: 700, minWidth: 24, textAlign: "center" }}>{asientos}</span>
                  <button onClick={() => setAsientos(Math.min(maxAsientos, asientos + 1))} style={circleBtn}>+</button>
                </div>
              )}
            </div>

            {/* Resumen */}
            <div style={{ background: "rgba(229,9,20,0.06)", border: "1px solid rgba(229,9,20,0.15)",
              borderRadius: 8, padding: "14px 16px", marginBottom: 24 }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
                <span style={{ color: "#aaa", fontSize: 13 }}>Precio por entrada</span>
                <span style={{ color: "#fff", fontSize: 13 }}>Bs. {pelicula.precioEntrada}</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
                <span style={{ color: "#aaa", fontSize: 13 }}>Sala</span>
                <span style={{ color: "#fff", fontSize: 13 }}>{pelicula.sala}</span>
              </div>
              <div style={{ borderTop: "1px solid rgba(255,255,255,0.06)", paddingTop: 10,
                display: "flex", justifyContent: "space-between" }}>
                <span style={{ color: "#fff", fontWeight: 700 }}>TOTAL</span>
                <span style={{ color: "#e50914", fontWeight: 700, fontSize: 18 }}>Bs. {total}</span>
              </div>
            </div>

            <div style={{ display: "flex", gap: 10 }}>
              <button onClick={handleConfirmar} disabled={llena || guardando} style={{
                flex: 1, background: llena || guardando ? "#5a1115" : "#e50914",
                border: "none", borderRadius: 6, padding: "12px", color: "#fff",
                fontFamily: "'Bebas Neue',sans-serif", fontSize: 18, letterSpacing: 2,
                cursor: llena || guardando ? "not-allowed" : "pointer" }}>
                {guardando ? "PROCESANDO..." : "CONFIRMAR"}
              </button>
              <button onClick={onClose} style={{ flex: 1, background: "rgba(255,255,255,0.07)",
                border: "1px solid rgba(255,255,255,0.1)", borderRadius: 6, padding: "12px",
                color: "#aaa", cursor: "pointer", fontSize: 14 }}>
                Cancelar
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default ReservaModal;