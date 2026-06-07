import { useState, useEffect } from "react";
import type { Pelicula } from "../types/pelicula";
import Badge from "./Badge";
import StarRating from "./StarRating";

const HeroCarousel = ({ peliculas, onSelect, onReservar }: { 
  peliculas: Pelicula[]; 
  onSelect: (p: Pelicula) => void;
  onReservar: (p: Pelicula) => void;
}) => {
  const [idx, setIdx] = useState(0);
  const featured = peliculas.slice(0, 5);
  const current = featured[idx];

  useEffect(() => {
    const t = setInterval(() => setIdx(i => (i + 1) % featured.length), 5000);
    return () => clearInterval(t);
  }, [featured.length]);

  if (!current) return null;

  return (
    <div style={{
      position: "relative", height: 500, overflow: "hidden",
      background: "#000",
    }}>
      {featured.map((p, i) => (
        <div key={p.id} style={{
          position: "absolute", inset: 0,
          opacity: i === idx ? 1 : 0,
          transition: "opacity 1s ease",
          backgroundImage: `linear-gradient(to right, rgba(0,0,0,0.9) 35%, rgba(0,0,0,0.2) 70%, rgba(0,0,0,0.6) 100%), url(${p.portada || ""})`,
          backgroundSize: "cover",
          backgroundPosition: "center top",
        }} />
      ))}
      <div style={{
        position: "absolute", inset: 0,
        display: "flex", alignItems: "center",
        padding: "0 64px",
      }}>
        <div style={{ maxWidth: 520 }}>
          <div style={{ display: "flex", gap: 8, marginBottom: 12 }}>
            {current.generos.map(g => <Badge key={g.id} label={g.nombre} />)}
          </div>
          <h1 style={{
            fontFamily: "'Bebas Neue', sans-serif",
            fontSize: 64, letterSpacing: 4, margin: "0 0 8px",
            lineHeight: 1, color: "#fff",
            textShadow: "0 2px 20px rgba(0,0,0,0.8)",
          }}>{current.titulo}</h1>
          <p style={{ color: "#ccc", fontSize: 14, marginBottom: 8 }}>
            {current.director} • {current.anio} • {current.duracion_min} min
          </p>
          <p style={{ color: "#aaa", fontSize: 13, marginBottom: 16, lineHeight: 1.6 }}>
            {current.sinopsis}
          </p>
          {current.promedio_valoraciones && (
            <div style={{ marginBottom: 20 }}>
              <StarRating value={current.promedio_valoraciones} size={20} />
              <span style={{ color: "#aaa", fontSize: 13, marginLeft: 8 }}>
                ({current.valoraciones.length} valoraciones)
              </span>
            </div>
          )}
          <div style={{ display: "flex", gap: 12 }}>
            <button onClick={() => onSelect(current)} style={{
              background: "#e50914", border: "none", borderRadius: 4,
              padding: "12px 32px", color: "#fff",
              fontFamily: "'Bebas Neue', sans-serif",
              fontSize: 18, letterSpacing: 2, cursor: "pointer",
              transition: "background 0.2s",
            }}
              onMouseEnter={e => (e.currentTarget.style.background = "#c40812")}
              onMouseLeave={e => (e.currentTarget.style.background = "#e50914")}
            >▶ Ver más</button>

            <button onClick={() => onReservar(current)} style={{
              background: "transparent",
              border: "2px solid #fff", borderRadius: 4,
              padding: "12px 32px", color: "#fff",
              fontFamily: "'Bebas Neue', sans-serif",
              fontSize: 18, letterSpacing: 2, cursor: "pointer",
              transition: "all 0.2s",
            }}
              onMouseEnter={e => { e.currentTarget.style.background = "#fff"; e.currentTarget.style.color = "#000"; }}
              onMouseLeave={e => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = "#fff"; }}
            > ENTRADAS — Bs. {current.precioEntrada}</button>
          </div>
        </div>
      </div>

      {/* Dots */}
      <div style={{
        position: "absolute", bottom: 24, left: "50%", transform: "translateX(-50%)",
        display: "flex", gap: 8,
      }}>
        {featured.map((_, i) => (
          <button key={i} onClick={() => setIdx(i)} style={{
            width: i === idx ? 28 : 8, height: 8,
            borderRadius: 4, border: "none", cursor: "pointer",
            background: i === idx ? "#e50914" : "rgba(255,255,255,0.3)",
            transition: "all 0.3s",
          }} />
        ))}
      </div>
    </div>
  );
};

export default HeroCarousel;