import type { Genero } from "../types/pelicula.ts";

const Filtros = ({
  generos, seleccionados, setSeleccionados, anioFiltro, setAnioFiltro, anios
}: {
  generos: Genero[];
  seleccionados: number[];
  setSeleccionados: (v: number[]) => void;
  anioFiltro: string;
  setAnioFiltro: (v: string) => void;
  anios: number[];
}) => {
  const toggle = (id: number) =>
    setSeleccionados(seleccionados.includes(id)
      ? seleccionados.filter(x => x !== id)
      : [...seleccionados, id]);

  return (
    <div style={{
      display: "flex", gap: 12, flexWrap: "wrap" as const,
      alignItems: "center", padding: "16px 0",
    }}>
      <span style={{ color: "#aaa", fontSize: 13, marginRight: 4 }}>Géneros:</span>
      {generos.map(g => (
        <button key={g.id} onClick={() => toggle(g.id)} style={{
          background: seleccionados.includes(g.id) ? "#e50914" : "rgba(255,255,255,0.07)",
          border: "1px solid " + (seleccionados.includes(g.id) ? "#e50914" : "rgba(255,255,255,0.15)"),
          borderRadius: 20, padding: "4px 14px",
          color: seleccionados.includes(g.id) ? "#fff" : "#ccc",
          fontSize: 12, fontWeight: 500, cursor: "pointer",
          transition: "all 0.2s", letterSpacing: 0.5,
        }}>{g.nombre}</button>
      ))}
      <select
        value={anioFiltro}
        onChange={e => setAnioFiltro(e.target.value)}
        style={{
          background: "rgba(255,255,255,0.07)",
          border: "1px solid rgba(255,255,255,0.15)",
          borderRadius: 4, padding: "4px 12px",
          color: "#ccc", fontSize: 12, cursor: "pointer",
          outline: "none",
        }}
      >
        <option value="">Todos los años</option>
        {anios.map(a => <option key={a} value={a}>{a}</option>)}
      </select>
    </div>
  );
};

export default Filtros;