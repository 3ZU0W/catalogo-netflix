import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { api } from "../api/api";

type Comentario = {
  id: number;
  usuarioNombre: string;
  texto: string;
  estrellas: number;
  fecha: string;
};

const ComentariosCine = () => {
  const { usuario, token } = useAuth();
  const esAdmin = usuario?.rol === "admin";

  const [comentarios, setComentarios] = useState<Comentario[]>([]);
  const [texto, setTexto] = useState("");
  const [estrellas, setEstrellas] = useState(5);
  const [enviado, setEnviado] = useState(false);

  useEffect(() => {
    api.getComentarios().then(setComentarios);
  }, []);

  const handleEnviar = async () => {
    if (!texto.trim() || !usuario || !token) return;
    const nuevo = await api.crearComentario({
      usuarioNombre: usuario.username,
      texto: texto.trim(),
      estrellas,
    }, token);
    setComentarios(prev => [nuevo, ...prev]);
    setTexto("");
    setEstrellas(5);
    setEnviado(true);
    setTimeout(() => setEnviado(false), 3000);
  };

  const handleEliminar = async (id: number) => {
    if (!token) return;
    await api.eliminarComentario(id, token);
    setComentarios(prev => prev.filter(c => c.id !== id));
  };

  return (
    <div style={{ maxWidth: 1280, margin: "0 auto", padding: "0 32px 52px" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 24 }}>
        <h2 style={{
          fontFamily: "'Bebas Neue', sans-serif",
          fontSize: 26, letterSpacing: 3, color: "#fff", margin: 0,
        }}>OPINIONES DEL CINE</h2>
        <span style={{
          background: "rgba(255,255,255,0.07)",
          color: "#888", fontSize: 12,
          padding: "2px 10px", borderRadius: 20,
        }}>{comentarios.length}</span>
      </div>

      {/* Formulario */}
      {usuario && !esAdmin && (
        <div style={{
          background: "rgba(229,9,20,0.05)",
          border: "1px solid rgba(229,9,20,0.15)",
          borderRadius: 10, padding: 20, marginBottom: 28,
        }}>
          <p style={{ color: "#aaa", fontSize: 12, margin: "0 0 10px" }}>Tu opinión sobre el cine:</p>

          {/* Estrellas */}
          <div style={{ display: "flex", gap: 6, marginBottom: 12 }}>
            {[1, 2, 3, 4, 5].map(n => (
              <button key={n} onClick={() => setEstrellas(n)} style={{
                background: n <= estrellas ? "#e50914" : "rgba(255,255,255,0.07)",
                border: "none", borderRadius: 4,
                width: 34, height: 34, cursor: "pointer",
                color: "#fff", fontSize: 16, transition: "all 0.2s",
              }}>★</button>
            ))}
          </div>

          <textarea
            value={texto}
            onChange={e => setTexto(e.target.value)}
            placeholder="¿Qué te parece nuestro cine? ¿Qué mejorarías?"
            rows={3}
            style={{
              width: "100%", background: "rgba(255,255,255,0.06)",
              border: "1px solid rgba(255,255,255,0.1)",
              borderRadius: 6, padding: "10px 14px",
              color: "#fff", fontSize: 13, resize: "none",
              outline: "none", boxSizing: "border-box",
            }}
          />
          {enviado && <p style={{ color: "#4caf50", fontSize: 12, margin: "4px 0" }}>✓ Comentario enviado</p>}
          <button
            onClick={handleEnviar}
            disabled={!texto.trim()}
            style={{
              marginTop: 10, background: texto.trim() ? "#e50914" : "#333",
              border: "none", borderRadius: 4, padding: "8px 24px",
              color: "#fff", fontWeight: 600, fontSize: 13,
              cursor: texto.trim() ? "pointer" : "not-allowed",
            }}
          >ENVIAR</button>
        </div>
      )}

      {/* Lista de comentarios */}
      {comentarios.length === 0 ? (
        <p style={{ color: "#555"}}>Sé el primero en opinar sobre el cine.</p>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {comentarios.map(c => (
            <div key={c.id} style={{
              background: "rgba(255,255,255,0.03)",
              border: "1px solid rgba(255,255,255,0.06)",
              borderRadius: 10, padding: "14px 18px",
              display: "flex", justifyContent: "space-between", alignItems: "flex-start",
            }}>
              <div style={{ flex: 1 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 6 }}>
                  <div style={{
                    width: 30, height: 30, borderRadius: "50%",
                    background: "#e50914",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontWeight: 700, fontSize: 13, color: "#fff", flexShrink: 0,
                  }}>{c.usuarioNombre[0].toUpperCase()}</div>
                  <span style={{ color: "#fff", fontWeight: 600, fontSize: 13 }}>{c.usuarioNombre}</span>
                  <span style={{ color: "#e50914", fontSize: 12 }}>{"★".repeat(c.estrellas)}{"☆".repeat(5 - c.estrellas)}</span>
                  <span style={{ color: "#555", fontSize: 11 }}>{new Date(c.fecha).toLocaleDateString("es-BO")}</span>
                </div>
                <p style={{ margin: 0, color: "#ccc", fontSize: 13, lineHeight: 1.6 }}>{c.texto}</p>
              </div>
              {esAdmin && (
                <button
                  onClick={() => handleEliminar(c.id)}
                  style={{
                    background: "none", border: "1px solid rgba(229,9,20,0.3)",
                    borderRadius: 4, padding: "4px 10px",
                    color: "#e50914", fontSize: 11, cursor: "pointer",
                    marginLeft: 12, flexShrink: 0,
                  }}
                >🗑</button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ComentariosCine;