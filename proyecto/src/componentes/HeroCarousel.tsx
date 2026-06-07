import { useState, useEffect } from "react";
import type { Pelicula } from "../types/pelicula";
import Badge from "./Badge";

const HeroCarousel = ({ peliculas, onSelect, onReservar }: {
  peliculas: Pelicula[];
  onSelect: (p: Pelicula) => void;
  onReservar: (p: Pelicula) => void;
}) => {
  const [idx, setIdx] = useState(0);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 640);
  const featured = peliculas.slice(0, 5);
  const current = featured[idx];

  useEffect(() => {
    const t = setInterval(() => setIdx(i => (i + 1) % featured.length), 5000);
    return () => clearInterval(t);
  }, [featured.length]);

  useEffect(() => {
    const handle = () => setIsMobile(window.innerWidth < 640);
    window.addEventListener("resize", handle);
    return () => window.removeEventListener("resize", handle);
  }, []);

  if (!current) return null;

  return (
    <div style={{
      position: "relative",
      height: isMobile ? 320 : 500,
      overflow: "hidden", background: "#000",
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
        padding: isMobile ? "0 20px" : "0 64px",
      }}>
        <div style={{ maxWidth: isMobile ? "100%" : 520 }}>
          <div style={{ display: "flex", gap: 6, marginBottom: 8, flexWrap: "wrap" }}>
            {current.generos.slice(0, 2).map(g => <Badge key={g.id} label={g.nombre} />)}
          </div>
          <h1 style={{
            fontFamily: "'Bebas Neue', sans-serif",
            fontSize: isMobile ? 36 : 64,
            letterSpacing: isMobile ? 2 : 4,
            margin: "0 0 6px", lineHeight: 1, color: "#fff",
            textShadow: "0 2px 20px rgba(0,0,0,0.8)",
          }}>{current.titulo}</h1>
          <p style={{ color: "#ccc", fontSize: isMobile ? 12 : 14, marginBottom: 6 }}>
            {current.director} • {current.anio} • {current.duracion_min} min
          </p>
          {!isMobile && (
            <p style={{ color: "#aaa", fontSize: 13, marginBottom: 16, lineHeight: 1.6 }}>
              {current.sinopsis}
            </p>
          )}
          <div style={{ display: "flex", gap: 8, marginTop: 12, flexWrap: "wrap" }}>
            <button onClick={() => onSelect(current)} style={{
              background: "#e50914", border: "none", borderRadius: 4,
              padding: isMobile ? "8px 18px" : "12px 32px", color: "#fff",
              fontFamily: "'Bebas Neue', sans-serif",
              fontSize: isMobile ? 14 : 18, letterSpacing: 2, cursor: "pointer",
            }}>Ver más</button>
            <button onClick={() => onReservar(current)} style={{
              background: "transparent",
              border: "2px solid #fff", borderRadius: 4,
              padding: isMobile ? "8px 18px" : "12px 32px", color: "#fff",
              fontFamily: "'Bebas Neue', sans-serif",
              fontSize: isMobile ? 14 : 18, letterSpacing: 2, cursor: "pointer",
            }}>Bs. {current.precioEntrada}</button>
          </div>
        </div>
      </div>

      {/* Dots */}
      <div style={{
        position: "absolute", bottom: 16, left: "50%", transform: "translateX(-50%)",
        display: "flex", gap: 6,
      }}>
        {featured.map((_, i) => (
          <button key={i} onClick={() => setIdx(i)} style={{
            width: i === idx ? 24 : 7, height: 7,
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