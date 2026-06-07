import { useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { api } from "../api/api";

const LogPanel = ({ onClose }: { onClose: () => void }) => {
  const { logs, cargarLogs, token } = useAuth();

  useEffect(() => {
    cargarLogs();
  }, []);

  return (
    <div
      style={{
        position: "fixed", inset: 0, zIndex: 300,
        background: "rgba(0,0,0,0.92)",
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
          width: "100%", maxWidth: 720,
          maxHeight: "88vh", overflowY: "auto",
          boxShadow: "0 24px 80px rgba(0,0,0,0.9)",
        }}
        onClick={e => e.stopPropagation()}
      >
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
          <h2 style={{ fontFamily: "'Bebas Neue',sans-serif", fontSize: 28, letterSpacing: 3, color: "#e50914", margin: 0 }}>
            LOG DE ACCESO
          </h2>
          <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
            <button
              onClick={async () => {
                if (confirm("¿Seguro que quieres borrar todos los registros?")) {
                  await api.limpiarLogs(token!);
                  cargarLogs();
                }
              }}
              style={{
                background: "none",
                border: "1px solid rgba(229,9,20,0.4)",
                borderRadius: 4, padding: "6px 14px",
                color: "#e50914", fontSize: 12, cursor: "pointer",
                fontFamily: "inherit",
              }}
            >🗑 LIMPIAR</button>
            <button onClick={onClose} style={{ background: "none", border: "none", color: "#666", fontSize: 22, cursor: "pointer" }}>✕</button>
          </div>
        </div>

        {logs.length === 0 ? (
          <p style={{ color: "#555", textAlign: "center", padding: "40px 0" }}>No hay registros de acceso aún.</p>
        ) : (
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
              <thead>
                <tr>
                  {["#", "Usuario", "Evento", "Fecha", "Hora", "Browser", "IP"].map(h => (
                    <th key={h} style={{
                      textAlign: "left", padding: "8px 12px",
                      color: "#aaa", fontSize: 11, letterSpacing: 1,
                      borderBottom: "1px solid rgba(255,255,255,0.08)",
                      fontWeight: 600,
                    }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {[...logs].reverse().map(log => (
                  <tr key={log.id} style={{ borderBottom: "1px solid rgba(255,255,255,0.04)" }}>
                    <td style={{ padding: "8px 12px", color: "#555" }}>{log.id}</td>
                    <td style={{ padding: "8px 12px", color: "#fff", fontWeight: 600 }}>{log.usuario}</td>
                    <td style={{ padding: "8px 12px" }}>
                      <span style={{
                        background: log.evento === "ingreso" ? "rgba(76,175,80,0.15)" : "rgba(229,9,20,0.15)",
                        color: log.evento === "ingreso" ? "#4caf50" : "#e50914",
                        border: `1px solid ${log.evento === "ingreso" ? "rgba(76,175,80,0.3)" : "rgba(229,9,20,0.3)"}`,
                        borderRadius: 4, padding: "2px 8px", fontSize: 11, fontWeight: 600,
                      }}>
                        {log.evento === "ingreso" ? "▶ INGRESO" : "◀ SALIDA"}
                      </span>
                    </td>
                    <td style={{ padding: "8px 12px", color: "#888" }}>{log.fecha}</td>
                    <td style={{ padding: "8px 12px", color: "#888" }}>{log.hora}</td>
                    <td style={{ padding: "8px 12px", color: "#555", fontSize: 11, maxWidth: 200, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                      {log.browser}
                    </td>
                    <td style={{ padding: "8px 12px", color: "#888", fontFamily: "monospace" }}>{log.ip}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default LogPanel;