import { useState, useRef, useEffect } from "react";
import { useAuth } from "../context/AuthContext";

type Mensaje = { rol: "user" | "assistant"; texto: string };

const ChatBot = ({ peliculas }: { peliculas: any[] }) => {
  const { usuario } = useAuth();
  const [abierto, setAbierto] = useState(false);
  const [mensajes, setMensajes] = useState<Mensaje[]>([
    { rol: "assistant", texto: "¡Hola! Soy el asistente de NETFLICK. Puedo ayudarte a encontrar películas, horarios, precios y más. ¿En qué te ayudo?" }
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const endRef = useRef<HTMLDivElement>(null);
  const BASE = 'https://catalogo-netflix-production-51fa.up.railway.app';

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [mensajes]);

  const enviar = async () => {
    if (!input.trim() || loading) return;
    const texto = input.trim();
    setInput("");
    setMensajes(prev => [...prev, { rol: "user", texto }]);
    setLoading(true);

    const infoPeliculas = peliculas.filter(p => p.activo).map(p =>
      `- ${p.titulo} (${p.anio}): ${p.estado === "en_cartelera" ? "En cartelera" : "Próximo estreno"}, Bs.${p.precioEntrada}, horarios: ${p.horarios?.join(", ")}, sala: ${p.sala}, sinopsis: ${p.sinopsis}`
    ).join("\n");

    try {
      const res = await fetch(`${BASE}/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            systemPrompt: `Eres el asistente virtual de NETFLICK, un cine boliviano. Responde en español de forma amable y concisa. 
            Estas son las películas disponibles actualmente:
            ${infoPeliculas}
            Ayuda a los usuarios con recomendaciones, horarios, precios y reservas. Si te preguntan sobre reservas, diles que pueden reservar desde la página principal.`,
            messages: [
            ...mensajes.map(m => ({ role: m.rol, content: m.texto })),
            { role: "user", content: texto }
            ],
        }),
        });
        const data = await res.json();
        const respuesta = data.text ?? "Lo siento, no pude procesar tu consulta.";
      setMensajes(prev => [...prev, { rol: "assistant", texto: respuesta }]);
    } catch {
      setMensajes(prev => [...prev, { rol: "assistant", texto: "Lo siento, hubo un error. Intenta de nuevo." }]);
    }
    setLoading(false);
  };

  if (!usuario) return null;

  return (
    <>
      {/* Botón flotante */}
      <button
        onClick={() => setAbierto(!abierto)}
        style={{
          position: "fixed", bottom: 24, right: 24, zIndex: 500,
          width: 56, height: 56, borderRadius: "50%",
          background: "#e50914", border: "none", cursor: "pointer",
          boxShadow: "0 4px 20px rgba(229,9,20,0.5)",
          fontSize: 24, display: "flex", alignItems: "center", justifyContent: "center",
          transition: "transform 0.2s",
        }}
        onMouseEnter={e => e.currentTarget.style.transform = "scale(1.1)"}
        onMouseLeave={e => e.currentTarget.style.transform = "scale(1)"}
      >
        {abierto ? "✕" : "💬"}
      </button>

      {/* Panel del chat */}
      {abierto && (
        <div style={{
          position: "fixed", bottom: 90, right: 24, zIndex: 500,
          width: 340, height: 480,
          background: "#181818", border: "1px solid rgba(255,255,255,0.08)",
          borderRadius: 14, display: "flex", flexDirection: "column",
          boxShadow: "0 8px 40px rgba(0,0,0,0.8)",
          overflow: "hidden",
        }}>
          {/* Header */}
          <div style={{
            background: "#e50914", padding: "14px 18px",
            display: "flex", alignItems: "center", gap: 10,
          }}>
            <div style={{
              width: 32, height: 32, borderRadius: "50%",
              background: "rgba(255,255,255,0.2)",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: 16,
            }}>🎬</div>
            <div>
              <p style={{ margin: 0, color: "#fff", fontWeight: 700, fontSize: 14 }}>Asistente NETFLICK</p>
              <p style={{ margin: 0, color: "rgba(255,255,255,0.7)", fontSize: 11 }}>Powered by IA</p>
            </div>
          </div>

          {/* Mensajes */}
          <div style={{ flex: 1, overflowY: "auto", padding: 14, display: "flex", flexDirection: "column", gap: 10 }}>
            {mensajes.map((m, i) => (
              <div key={i} style={{
                display: "flex", justifyContent: m.rol === "user" ? "flex-end" : "flex-start",
              }}>
                <div style={{
                  maxWidth: "80%",
                  background: m.rol === "user" ? "#e50914" : "rgba(255,255,255,0.07)",
                  color: "#fff", fontSize: 13, lineHeight: 1.5,
                  padding: "8px 12px", borderRadius: m.rol === "user" ? "12px 12px 0 12px" : "12px 12px 12px 0",
                }}>
                  {m.texto}
                </div>
              </div>
            ))}
            {loading && (
              <div style={{ display: "flex", justifyContent: "flex-start" }}>
                <div style={{
                  background: "rgba(255,255,255,0.07)", color: "#888",
                  fontSize: 13, padding: "8px 12px", borderRadius: "12px 12px 12px 0",
                }}>...</div>
              </div>
            )}
            <div ref={endRef} />
          </div>

          {/* Input */}
          <div style={{
            padding: "10px 14px", borderTop: "1px solid rgba(255,255,255,0.06)",
            display: "flex", gap: 8,
          }}>
            <input
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key === "Enter" && enviar()}
              placeholder="Escribe tu consulta..."
              style={{
                flex: 1, background: "rgba(255,255,255,0.06)",
                border: "1px solid rgba(255,255,255,0.1)",
                borderRadius: 8, padding: "8px 12px",
                color: "#fff", fontSize: 13, outline: "none",
              }}
            />
            <button onClick={enviar} disabled={loading} style={{
              background: "#e50914", border: "none", borderRadius: 8,
              padding: "8px 14px", color: "#fff", cursor: "pointer", fontSize: 16,
            }}>➤</button>
          </div>
        </div>
      )}
    </>
  );
};

export default ChatBot;