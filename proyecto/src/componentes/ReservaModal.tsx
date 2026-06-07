import { useState } from "react";
import type { Pelicula } from "../types/pelicula";
import { useAuth, calcularEdad } from "../context/AuthContext";

const ReservaModal = ({
  pelicula,
  onClose,
}: {
  pelicula: Pelicula;
  onClose: () => void;
}) => {
  const { usuario, agregarReserva } = useAuth();
  const [horario, setHorario] = useState(pelicula.horarios[0]);
  const [asientos, setAsientos] = useState(1);
  const [confirmado, setConfirmado] = useState(false);

  if (!usuario) return null;

  const edad = calcularEdad(usuario.fechaNacimiento);
  const bloqueado = pelicula.soloMayores18 && edad < 18;
  const total = pelicula.precioEntrada * asientos;

  const handleConfirmar = () => {
    agregarReserva({
      peliculaId: pelicula.id,
      peliculaTitulo: pelicula.titulo,
      peliculaPortada: pelicula.portada,
      usuarioId: usuario.id,
      horario,
      asientos,
      total,
      fecha: new Date().toLocaleDateString("es-BO"),
      sala: pelicula.sala,
    });
    setConfirmado(true);
  };

  return (
    <div
      style={{
        position: "fixed", inset: 0, zIndex: 500,
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
          width: "100%", maxWidth: 420,
          boxShadow: "0 24px 80px rgba(0,0,0,0.9)",
        }}
        onClick={e => e.stopPropagation()}
      >
        {bloqueado ? (
          <>
            <div style={{ textAlign: "center", padding: "20px 0" }}>
              <div style={{ fontSize: 48, marginBottom: 16 }}>🔞</div>
              <h3 style={{ color: "#e50914", fontFamily: "'Bebas Neue',sans-serif", fontSize: 26, letterSpacing: 3, margin: "0 0 12px" }}>
                CONTENIDO RESTRINGIDO
              </h3>
              <p style={{ color: "#aaa", fontSize: 14, lineHeight: 1.6 }}>
                Esta película es solo para mayores de 18 años.<br />
                Tu cuenta indica que tienes <strong style={{ color: "#fff" }}>{edad} años</strong>.
              </p>
              <button onClick={onClose} style={{
                marginTop: 24, background: "#333", border: "none",
                borderRadius: 6, padding: "10px 28px",
                color: "#fff", cursor: "pointer", fontSize: 14,
              }}>Cerrar</button>
            </div>
          </>
        ) : confirmado ? (
          <div style={{ textAlign: "center", padding: "20px 0" }}>
            <div style={{ fontSize: 52, marginBottom: 16 }}>🎟️</div>
            <h3 style={{ color: "#4caf50", fontFamily: "'Bebas Neue',sans-serif", fontSize: 28, letterSpacing: 3, margin: "0 0 12px" }}>
              ¡RESERVA CONFIRMADA!
            </h3>
            <p style={{ color: "#ccc", fontSize: 14, margin: "0 0 6px" }}>{pelicula.titulo}</p>
            <p style={{ color: "#aaa", fontSize: 13, margin: "0 0 4px" }}> {horario} — {pelicula.sala}</p>
            <p style={{ color: "#aaa", fontSize: 13, margin: "0 0 20px" }}> {asientos} entrada{asientos > 1 ? "s" : ""} — Bs. {total}</p>
            <button onClick={onClose} style={{
              background: "#e50914", border: "none", borderRadius: 6,
              padding: "10px 28px", color: "#fff",
              fontFamily: "'Bebas Neue',sans-serif", fontSize: 17, letterSpacing: 2, cursor: "pointer",
            }}>LISTO</button>
          </div>
        ) : (
          <>
            <h2 style={{
              fontFamily: "'Bebas Neue',sans-serif", fontSize: 26, letterSpacing: 3,
              color: "#e50914", margin: "0 0 4px",
            }}>COMPRAR ENTRADAS</h2>
            <p style={{ color: "#aaa", fontSize: 13, margin: "0 0 24px" }}>{pelicula.titulo}</p>

            {/* Horario */}
            <div style={{ marginBottom: 20 }}>
              <label style={{ display: "block", color: "#aaa", fontSize: 12, marginBottom: 8 }}>
                Selecciona horario
              </label>
              <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                {pelicula.horarios.map(h => (
                  <button
                    key={h}
                    onClick={() => setHorario(h)}
                    style={{
                      background: horario === h ? "#e50914" : "rgba(255,255,255,0.07)",
                      border: `1px solid ${horario === h ? "#e50914" : "rgba(255,255,255,0.15)"}`,
                      borderRadius: 6, padding: "8px 16px",
                      color: "#fff", cursor: "pointer", fontSize: 14,
                      fontWeight: horario === h ? 700 : 400,
                      transition: "all 0.2s",
                    }}
                  >{h}</button>
                ))}
              </div>
            </div>

            {/* Asientos */}
            <div style={{ marginBottom: 20 }}>
              <label style={{ display: "block", color: "#aaa", fontSize: 12, marginBottom: 8 }}>
                Cantidad de entradas
              </label>
              <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
                <button
                  onClick={() => setAsientos(Math.max(1, asientos - 1))}
                  style={{
                    width: 36, height: 36, borderRadius: "50%",
                    background: "rgba(255,255,255,0.08)",
                    border: "1px solid rgba(255,255,255,0.15)",
                    color: "#fff", fontSize: 20, cursor: "pointer",
                    display: "flex", alignItems: "center", justifyContent: "center",
                  }}
                >−</button>
                <span style={{ fontSize: 22, fontWeight: 700, minWidth: 24, textAlign: "center" }}>{asientos}</span>
                <button
                  onClick={() => setAsientos(Math.min(8, asientos + 1))}
                  style={{
                    width: 36, height: 36, borderRadius: "50%",
                    background: "rgba(255,255,255,0.08)",
                    border: "1px solid rgba(255,255,255,0.15)",
                    color: "#fff", fontSize: 20, cursor: "pointer",
                    display: "flex", alignItems: "center", justifyContent: "center",
                  }}
                >+</button>
              </div>
            </div>

            {/* Resumen */}
            <div style={{
              background: "rgba(229,9,20,0.06)",
              border: "1px solid rgba(229,9,20,0.15)",
              borderRadius: 8, padding: "14px 16px", marginBottom: 24,
            }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
                <span style={{ color: "#aaa", fontSize: 13 }}>Precio por entrada</span>
                <span style={{ color: "#fff", fontSize: 13 }}>Bs. {pelicula.precioEntrada}</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
                <span style={{ color: "#aaa", fontSize: 13 }}>Sala</span>
                <span style={{ color: "#fff", fontSize: 13 }}>{pelicula.sala}</span>
              </div>
              <div style={{ borderTop: "1px solid rgba(255,255,255,0.06)", paddingTop: 10, display: "flex", justifyContent: "space-between" }}>
                <span style={{ color: "#fff", fontWeight: 700 }}>TOTAL</span>
                <span style={{ color: "#e50914", fontWeight: 700, fontSize: 18 }}>Bs. {total}</span>
              </div>
            </div>

            <div style={{ display: "flex", gap: 10 }}>
              <button
                onClick={handleConfirmar}
                style={{
                  flex: 1, background: "#e50914", border: "none", borderRadius: 6,
                  padding: "12px", color: "#fff",
                  fontFamily: "'Bebas Neue',sans-serif", fontSize: 18, letterSpacing: 2, cursor: "pointer",
                }}
              >CONFIRMAR</button>
              <button
                onClick={onClose}
                style={{
                  flex: 1, background: "rgba(255,255,255,0.07)",
                  border: "1px solid rgba(255,255,255,0.1)",
                  borderRadius: 6, padding: "12px", color: "#aaa", cursor: "pointer", fontSize: 14,
                }}
              >Cancelar</button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default ReservaModal;
