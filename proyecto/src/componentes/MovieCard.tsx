import { useState } from "react";
import type { Pelicula } from "../types/pelicula";

const MovieCard = ({
  pelicula, onClick, modoAdmin, onEditar, onEliminar,
}: {
  pelicula: Pelicula;
  onClick: () => void;
  modoAdmin?: boolean;
  onEditar?: () => void;
  onEliminar?: () => void;
}) => {
  const [hovered, setHovered] = useState(false);
  const esProximo = pelicula.estado === "proximo_estreno";

  return (
    <div
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        cursor: "pointer", borderRadius: 8, overflow: "hidden",
        background: "#1a1a1a",
        transform: hovered ? "scale(1.05)" : "scale(1)",
        transition: "transform 0.25s ease, box-shadow 0.25s ease",
        boxShadow: hovered ? "0 12px 40px rgba(229,9,20,0.25)" : "0 2px 12px rgba(0,0,0,0.4)",
        position: "relative",
      }}
    >
      <div style={{ aspectRatio: "2/3", overflow: "hidden", background: "#111", position: "relative" }}>
        {/* Badges admin */}
        {modoAdmin && (
          <div style={{
            position: "absolute", top: 8, right: 8,
            display: "flex", gap: 4, zIndex: 10,
          }}>
            <button onClick={e => { e.stopPropagation(); onEditar?.(); }} style={{
              background: "rgba(0,0,0,0.75)", border: "none", borderRadius: 4,
              color: "#fff", fontSize: 14, cursor: "pointer", width: 28, height: 28,
            }}>✏️</button>
            <button onClick={e => { e.stopPropagation(); onEliminar?.(); }} style={{
              background: "rgba(229,9,20,0.8)", border: "none", borderRadius: 4,
              color: "#fff", fontSize: 14, cursor: "pointer", width: 28, height: 28,
            }}>🗑️</button>
          </div>
        )}

        {/* Badge estado */}
        <div style={{
          position: "absolute", top: 8, left: 8, zIndex: 5,
          background: esProximo ? "rgba(245,166,35,0.9)" : "rgba(229,9,20,0.85)",
          color: "#fff", fontSize: 9, fontWeight: 700,
          padding: "3px 7px", borderRadius: 3, letterSpacing: 0.5,
        }}>
          {esProximo ? "PRÓXIMO" : "CARTELERA"}
        </div>

        {/* Badge +18 */}
        {pelicula.soloMayores18 && (
          <div style={{
            position: "absolute", bottom: 8, right: 8, zIndex: 5,
            background: "rgba(0,0,0,0.8)",
            border: "1px solid rgba(229,9,20,0.6)",
            color: "#e50914", fontSize: 9, fontWeight: 700,
            padding: "2px 6px", borderRadius: 3,
          }}>+18</div>
        )}

        {pelicula.portada ? (
          <img
            src={pelicula.portada}
            alt={pelicula.titulo}
            style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
          />
        ) : (
          <div style={{
            width: "100%", height: "100%",
            display: "flex", alignItems: "center", justifyContent: "center",
            background: "linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)",
            fontSize: 40,
          }}>🎬</div>
        )}

        <div style={{
          position: "absolute", inset: 0,
          background: "linear-gradient(to top, rgba(0,0,0,0.9) 0%, transparent 60%)",
          opacity: hovered ? 1 : 0,
          transition: "opacity 0.25s",
        }} />
      </div>

      <div style={{ padding: "10px 12px" }}>
        <h3 style={{
          margin: "0 0 4px", fontSize: 13, fontWeight: 600,
          color: "#fff", overflow: "hidden",
          textOverflow: "ellipsis", whiteSpace: "nowrap",
        }}>{pelicula.titulo}</h3>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <span style={{ color: "#888", fontSize: 11 }}>{pelicula.anio}</span>
          <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
            {pelicula.promedio_valoraciones ? (
              <span style={{ color: "#e50914", fontSize: 11, fontWeight: 700 }}>
                ★ {pelicula.promedio_valoraciones.toFixed(1)}
              </span>
            ) : (
              <span style={{ color: "#555", fontSize: 11 }}>Sin rating</span>
            )}
            <span style={{ color: "#555", fontSize: 10 }}>Bs.{pelicula.precioEntrada}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MovieCard;
