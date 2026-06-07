import { useState } from "react";
import type { Pelicula } from "../types/pelicula";
import Badge from "./Badge";
import { useAuth, calcularEdad } from "../context/AuthContext";
import ReservaModal from "./ReservaModal";

const DetalleModal = ({
  pelicula, onClose, onLogin,
}: {
  pelicula: Pelicula;
  onClose: () => void;
  onLogin: () => void;
}) => {
  const { usuario } = useAuth();
  const [tab, setTab] = useState<"info" | "actores">("info");
  const [showReserva, setShowReserva] = useState(false);

  const edad = usuario ? calcularEdad(usuario.fechaNacimiento) : null;
  const puedeReservar = usuario !== null;
  const esProximo = pelicula.estado === "proximo_estreno";

  return (
    <>
      <div style={{
        position: "fixed", inset: 0, zIndex: 200,
        background: "rgba(0,0,0,0.85)",
        display: "flex", alignItems: "center", justifyContent: "center",
        padding: 24,
      }} onClick={onClose}>
        <div style={{
          background: "#181818", borderRadius: 12,
          maxWidth: 860, width: "100%",
          maxHeight: "90vh", overflow: "auto",
          boxShadow: "0 24px 80px rgba(0,0,0,0.8)",
          border: "1px solid rgba(255,255,255,0.06)",
        }} onClick={e => e.stopPropagation()}>

          <div style={{
            position: "relative", height: 280, overflow: "hidden",
            borderRadius: "12px 12px 0 0",
            backgroundImage: pelicula.portada
              ? `linear-gradient(to bottom, transparent 40%, #181818 100%), url(${pelicula.portada})`
              : undefined,
            backgroundSize: "cover", backgroundPosition: "center top",
            background: pelicula.portada ? undefined : "linear-gradient(135deg, #1a1a2e, #16213e)",
          }}>
            <div style={{ position: "absolute", top: 16, left: 16 }}>
              <span style={{
                background: esProximo ? "rgba(245,166,35,0.9)" : "rgba(229,9,20,0.9)",
                color: "#fff", fontSize: 11, fontWeight: 700,
                padding: "4px 10px", borderRadius: 4, letterSpacing: 1,
              }}>
                {esProximo ? `🗓 ESTRENO ${pelicula.fechaEstreno}` : "▶ EN CARTELERA"}
              </span>
            </div>
            {pelicula.soloMayores18 && (
              <div style={{ position: "absolute", top: 16, right: 52 }}>
                <span style={{
                  background: "rgba(0,0,0,0.8)",
                  border: "1px solid rgba(229,9,20,0.5)",
                  color: "#e50914", fontSize: 11, fontWeight: 700,
                  padding: "4px 10px", borderRadius: 4,
                }}>+18</span>
              </div>
            )}
            <button onClick={onClose} style={{
              position: "absolute", top: 16, right: 16,
              background: "rgba(0,0,0,0.6)", border: "none",
              borderRadius: "50%", width: 36, height: 36,
              color: "#fff", fontSize: 18, cursor: "pointer",
              display: "flex", alignItems: "center", justifyContent: "center",
            }}>✕</button>
            <div style={{ position: "absolute", bottom: 24, left: 32 }}>
              <div style={{ display: "flex", gap: 8, marginBottom: 8 }}>
                {pelicula.generos.map(g => <Badge key={g.id} label={g.nombre} />)}
              </div>
              <h2 style={{
                fontFamily: "'Bebas Neue', sans-serif",
                fontSize: 44, letterSpacing: 3, margin: 0, color: "#fff",
              }}>{pelicula.titulo}</h2>
            </div>
          </div>

          <div style={{
            display: "flex", gap: 16, padding: "16px 32px",
            borderBottom: "1px solid rgba(255,255,255,0.06)",
            alignItems: "center", flexWrap: "wrap",
          }}>
            <span style={{ color: "#aaa", fontSize: 13 }}> {pelicula.anio}</span>
            <span style={{ color: "#aaa", fontSize: 13 }}>🎬 {pelicula.director}</span>
            <span style={{ color: "#aaa", fontSize: 13 }}>⏱ {pelicula.duracion_min} min</span>
            <span style={{ color: "#aaa", fontSize: 13 }}>🏛 {pelicula.sala}</span>
            <div style={{ marginLeft: "auto" }}>
              {puedeReservar ? (
                pelicula.soloMayores18 && edad !== null && edad < 18 ? (
                  <span style={{ color: "#e50914", fontSize: 12, background: "rgba(229,9,20,0.1)", padding: "6px 14px", borderRadius: 6 }}>
                    Solo mayores de 18
                  </span>
                ) : (
                  <button onClick={() => setShowReserva(true)} style={{
                    background: "#e50914", border: "none", borderRadius: 6,
                    padding: "9px 22px", color: "#fff",
                    fontFamily: "'Bebas Neue',sans-serif",
                    fontSize: 16, letterSpacing: 2, cursor: "pointer",
                  }}>
                   {esProximo ? "RESERVAR ANTICIPADO" : "COMPRAR ENTRADA"} — Bs. {pelicula.precioEntrada}
                  </button>
                )
              ) : (
                <button onClick={onLogin} style={{
                  background: "rgba(229,9,20,0.12)", border: "1px solid rgba(229,9,20,0.3)",
                  borderRadius: 6, padding: "9px 22px", color: "#e50914",
                  fontSize: 13, cursor: "pointer",
                }}>Inicia sesión para reservar</button>
              )}
            </div>
          </div>

          <div style={{ display: "flex", padding: "0 32px", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
            {(["info", "actores"] as const).map(t => (
              <button key={t} onClick={() => setTab(t)} style={{
                background: "none", border: "none",
                borderBottom: `2px solid ${tab === t ? "#e50914" : "transparent"}`,
                padding: "14px 20px", cursor: "pointer",
                color: tab === t ? "#fff" : "#888",
                fontSize: 13, fontWeight: 600, letterSpacing: 1,
                transition: "all 0.2s",
              }}>
                {t === "info" ? "Información" : "Actores"}
              </button>
            ))}
          </div>

          <div style={{ padding: "24px 32px 32px" }}>
            {tab === "info" && (
              <div>
                <p style={{ color: "#ccc", lineHeight: 1.7, marginBottom: 16 }}>{pelicula.sinopsis}</p>
                {!esProximo && (
                  <div style={{ display: "flex", gap: 20, flexWrap: "wrap" }}>
                    <div style={{ background: "rgba(255,255,255,0.04)", borderRadius: 8, padding: "12px 18px" }}>
                      <p style={{ margin: "0 0 4px", fontSize: 11, color: "#666", letterSpacing: 1 }}>HORARIOS</p>
                      <p style={{ margin: 0, color: "#fff", fontSize: 14 }}>{pelicula.horarios.join("  ·  ")}</p>
                    </div>
                    <div style={{ background: "rgba(255,255,255,0.04)", borderRadius: 8, padding: "12px 18px" }}>
                      <p style={{ margin: "0 0 4px", fontSize: 11, color: "#666", letterSpacing: 1 }}>PRECIO</p>
                      <p style={{ margin: 0, color: "#e50914", fontSize: 18, fontWeight: 700 }}>Bs. {pelicula.precioEntrada}</p>
                    </div>
                  </div>
                )}
              </div>
            )}

            {tab === "actores" && (
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(160px, 1fr))", gap: 16 }}>
                {pelicula.actores.length === 0
                  ? <p style={{ color: "#555" }}>Sin información de actores.</p>
                  : pelicula.actores.map(a => (
                    <div key={a.id} style={{
                      background: "rgba(255,255,255,0.04)", borderRadius: 8,
                      padding: 16, textAlign: "center",
                    }}>
                      <div style={{
                        width: 48, height: 48, borderRadius: "50%",
                        background: "#e50914", margin: "0 auto 10px",
                        display: "flex", alignItems: "center", justifyContent: "center",
                        fontWeight: 700, fontSize: 18,
                      }}>{a.apellido[0]}</div>
                      <p style={{ margin: 0, fontWeight: 600, fontSize: 13 }}>{a.nombre} {a.apellido}</p>
                      {a.personaje && <p style={{ margin: "4px 0 0", fontSize: 11, color: "#888" }}>como {a.personaje}</p>}
                    </div>
                  ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {showReserva && (
        <ReservaModal pelicula={pelicula} onClose={() => setShowReserva(false)} />
      )}
    </>
  );
};

export default DetalleModal;