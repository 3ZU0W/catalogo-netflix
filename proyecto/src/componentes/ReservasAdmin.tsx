import { useState, useEffect, useCallback } from "react";
import type { Reserva } from "../types/pelicula";
import { useAuth } from "../context/AuthContext";

const formatoDia = (iso?: string) => {
  if (!iso) return "—";
  const d = new Date(iso + "T00:00:00");
  if (isNaN(d.getTime())) return iso;
  return d.toLocaleDateString("es-BO", { weekday: "short", day: "2-digit", month: "short" });
};

const ReservasAdmin = ({ onClose }: { onClose: () => void }) => {
  const { cargarTodasReservas, eliminarReservaAdmin } = useAuth();
  const [reservas, setReservas] = useState<Reserva[]>([]);
  const [cargando, setCargando] = useState(true);
  const [confirmarId, setConfirmarId] = useState<number | null>(null);
  const [filtro, setFiltro] = useState<"todas" | "confirmada" | "cancelada">("todas");

  const recargar = useCallback(async () => {
    setCargando(true);
    const data = await cargarTodasReservas();
    setReservas(data);
    setCargando(false);
  }, [cargarTodasReservas]);

  useEffect(() => { recargar(); }, [recargar]);

  const handleEliminar = async (id: number) => {
    await eliminarReservaAdmin(id);
    setReservas(prev => prev.filter(r => r.id !== id));
    setConfirmarId(null);
  };

  const visibles = reservas.filter(r => filtro === "todas" || r.estado === filtro);

  return (
    <div
      style={{
        position: "fixed", inset: 0, zIndex: 320,
        background: "rgba(0,0,0,0.9)",
        display: "flex", alignItems: "center", justifyContent: "center",
        padding: 16,
      }}
      onClick={onClose}
    >
      <div
        style={{
          background: "#181818",
          border: "1px solid rgba(255,255,255,0.08)",
          borderRadius: 14, padding: "32px",
          width: "100%", maxWidth: 720,
          maxHeight: "88vh", overflowY: "auto",
          boxShadow: "0 24px 80px rgba(0,0,0,0.9)",
        }}
        onClick={e => e.stopPropagation()}
      >
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
          <h2 style={{
            fontFamily: "'Bebas Neue',sans-serif", fontSize: 28, letterSpacing: 3,
            color: "#e50914", margin: 0,
          }}>GESTIÓN DE RESERVAS</h2>
          <button onClick={onClose} style={{
            background: "none", border: "none", color: "#666", fontSize: 22, cursor: "pointer",
          }}>✕</button>
        </div>

        {/* Filtros */}
        <div style={{ display: "flex", gap: 8, marginBottom: 20 }}>
          {([
            { k: "todas", t: "Todas" },
            { k: "confirmada", t: "Confirmadas" },
            { k: "cancelada", t: "Canceladas" },
          ] as const).map(o => (
            <button key={o.k} onClick={() => setFiltro(o.k)} style={{
              background: filtro === o.k ? "#e50914" : "rgba(255,255,255,0.07)",
              border: `1px solid ${filtro === o.k ? "#e50914" : "rgba(255,255,255,0.15)"}`,
              borderRadius: 20, padding: "4px 14px", color: "#fff",
              fontSize: 12, cursor: "pointer",
            }}>{o.t}</button>
          ))}
          <span style={{ marginLeft: "auto", color: "#666", fontSize: 12, alignSelf: "center" }}>
            {visibles.length} reserva(s)
          </span>
        </div>

        {cargando ? (
          <p style={{ color: "#666", textAlign: "center", padding: "40px 0" }}>Cargando…</p>
        ) : visibles.length === 0 ? (
          <div style={{ textAlign: "center", padding: "40px 0" }}>
            <p style={{ color: "#555", fontSize: 14 }}>No hay reservas para mostrar.</p>
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {visibles.map(r => (
              <div
                key={r.id}
                style={{
                  background: "rgba(255,255,255,0.04)",
                  border: `1px solid ${r.estado === "cancelada" ? "rgba(255,255,255,0.06)" : "rgba(229,9,20,0.18)"}`,
                  borderRadius: 10, padding: 14,
                  display: "flex", gap: 14, alignItems: "center",
                  opacity: r.estado === "cancelada" ? 0.6 : 1,
                }}
              >
                <div style={{ width: 44, height: 62, borderRadius: 6, overflow: "hidden", background: "#111", flexShrink: 0 }}>
                  {r.peliculaPortada ? (
                    <img src={r.peliculaPortada} alt={r.peliculaTitulo}
                      style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                  ) : (
                    <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18 }}>🎬</div>
                  )}
                </div>

                <div style={{ flex: 1, minWidth: 0 }}>
                  <p style={{ margin: "0 0 3px", fontWeight: 700, fontSize: 14, color: "#fff" }}>
                    {r.peliculaTitulo}
                    {r.estado === "cancelada" && (
                      <span style={{ marginLeft: 8, fontSize: 10, color: "#888", fontWeight: 400 }}>CANCELADA</span>
                    )}
                  </p>
                  <p style={{ margin: "0 0 2px", fontSize: 12, color: "#999" }}>
                     USUARIO: {r.usuarioNombre ?? `Usuario ${r.usuarioId}`} · FECHA: {formatoDia(r.dia)} · HORA: {r.horario} — {r.sala}
                  </p>
                  <p style={{ margin: 0, fontSize: 12, color: "#777" }}>
                    🎫 {r.asientos} entrada{r.asientos > 1 ? "s" : ""} · Bs. {r.total} · reservada el {r.fecha}
                  </p>
                </div>

                <div style={{ flexShrink: 0 }}>
                  {confirmarId === r.id ? (
                    <div style={{ display: "flex", gap: 6 }}>
                      <button onClick={() => handleEliminar(r.id)} style={{
                        background: "#e50914", border: "none", borderRadius: 4,
                        padding: "5px 12px", color: "#fff", fontSize: 11, cursor: "pointer", fontWeight: 600,
                      }}>Sí, eliminar</button>
                      <button onClick={() => setConfirmarId(null)} style={{
                        background: "rgba(255,255,255,0.07)", border: "1px solid rgba(255,255,255,0.15)",
                        borderRadius: 4, padding: "5px 10px", color: "#aaa", fontSize: 11, cursor: "pointer",
                      }}>No</button>
                    </div>
                  ) : (
                    <button onClick={() => setConfirmarId(r.id)} style={{
                      background: "none", border: "1px solid rgba(229,9,20,0.4)",
                      borderRadius: 4, padding: "5px 12px", color: "#e50914",
                      fontSize: 11, cursor: "pointer",
                    }}>🗑 Eliminar</button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ReservasAdmin;
