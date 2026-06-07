import { useAuth } from "../context/AuthContext";

const MisReservas = ({ onClose }: { onClose: () => void }) => {
  const { reservas, cancelarReserva, usuario } = useAuth();
  const misReservas = reservas.filter(r => r.usuarioId === usuario?.id && r.estado !== "cancelada");

  return (
    <div
      style={{
        position: "fixed", inset: 0, zIndex: 300,
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
          borderRadius: 14, padding: "36px 32px",
          width: "100%", maxWidth: 560,
          maxHeight: "88vh", overflowY: "auto",
          boxShadow: "0 24px 80px rgba(0,0,0,0.9)",
        }}
        onClick={e => e.stopPropagation()}
      >
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
          <h2 style={{
            fontFamily: "'Bebas Neue',sans-serif", fontSize: 28, letterSpacing: 3,
            color: "#e50914", margin: 0,
          }}>MIS RESERVAS</h2>
          <button onClick={onClose} style={{
            background: "none", border: "none", color: "#666", fontSize: 22, cursor: "pointer",
          }}>✕</button>
        </div>

        {misReservas.length === 0 ? (
          <div style={{ textAlign: "center", padding: "40px 0" }}>
            <div style={{ fontSize: 48, marginBottom: 16 }}>🎟️</div>
            <p style={{ color: "#555", fontSize: 14 }}>No tienes reservas aún.</p>
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {misReservas.map(r => (
              <div
                key={r.id}
                style={{
                  background: "rgba(255,255,255,0.04)",
                  border: `1px solid ${r.estado === "cancelada" ? "rgba(255,255,255,0.05)" : "rgba(229,9,20,0.15)"}`,
                  borderRadius: 10, padding: 16,
                  display: "flex", gap: 14, alignItems: "flex-start",
                  opacity: r.estado === "cancelada" ? 0.5 : 1,
                }}
              >
                {/* Portada */}
                <div style={{
                  width: 52, height: 72, borderRadius: 6, overflow: "hidden",
                  background: "#111", flexShrink: 0,
                }}>
                  {r.peliculaPortada ? (
                    <img src={r.peliculaPortada} alt={r.peliculaTitulo}
                      style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                  ) : (
                    <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20 }}>🎬</div>
                  )}
                </div>

                {/* Info */}
                <div style={{ flex: 1 }}>
                  <p style={{ margin: "0 0 4px", fontWeight: 700, fontSize: 14, color: "#fff" }}>
                    {r.peliculaTitulo}
                    {r.estado === "cancelada" && (
                      <span style={{ marginLeft: 8, fontSize: 11, color: "#666", fontWeight: 400 }}>CANCELADA</span>
                    )}
                  </p>
                  <p style={{ margin: "0 0 2px", fontSize: 12, color: "#888" }}>
                     {r.horario} — {r.sala}
                  </p>
                  <p style={{ margin: "0 0 2px", fontSize: 12, color: "#888" }}>
                     {r.asientos} entrada{r.asientos > 1 ? "s" : ""}
                  </p>
                  <p style={{ margin: 0, fontSize: 12, color: "#666" }}>📅 {r.fecha}</p>
                </div>

                {/* Total y cancelar */}
                <div style={{ textAlign: "right", flexShrink: 0 }}>
                  <p style={{ margin: "0 0 10px", fontSize: 16, fontWeight: 700, color: "#e50914" }}>
                    Bs. {r.total}
                  </p>
                  {r.estado === "confirmada" && (
                    <button
                      onClick={() => cancelarReserva(r.id)}
                      style={{
                        background: "none",
                        border: "1px solid rgba(229,9,20,0.3)",
                        borderRadius: 4, padding: "4px 12px",
                        color: "#e50914", fontSize: 11, cursor: "pointer",
                        transition: "all 0.2s",
                      }}
                    >Cancelar</button>
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

export default MisReservas;
