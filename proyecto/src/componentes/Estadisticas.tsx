import { useState, useEffect } from "react";
import type { Pelicula } from "../types/pelicula";
import { useAuth } from "../context/AuthContext";
import { api } from "../api/api";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

const Estadisticas = ({
  peliculas,
  onClose,
}: {
  peliculas: Pelicula[];
  onClose: () => void;
}) => {
  const { token } = useAuth();
  const [reservas, setReservas] = useState<any[]>([]);

  useEffect(() => {
    if (token) {
      api.getTodasReservas(token).then(setReservas);
    }
  }, [token]);

  const reservasConfirmadas = reservas.filter(r => r.estado === "confirmada");
  const totalIngresos = reservasConfirmadas.reduce((sum, r) => sum + r.total, 0);

  const generarPDF = () => {
    const doc = new jsPDF();
    doc.setFillColor(229, 9, 20);
    doc.rect(0, 0, 210, 28, "F");
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(22);
    doc.setFont("helvetica", "bold");
    doc.text("REPORTE DE RESERVAS", 14, 18);
    doc.setTextColor(0, 0, 0);
    doc.setFontSize(10);
    doc.text(`Generado: ${new Date().toLocaleString("es-BO")}`, 14, 36);
    doc.setFontSize(13);
    doc.setFont("helvetica", "bold");
    doc.text("Resumen General", 14, 48);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    doc.text(`Total películas activas: ${peliculas.filter(p => p.activo).length}`, 14, 56);
    doc.text(`Total reservas confirmadas: ${reservasConfirmadas.length}`, 14, 62);
    doc.text(`Ingresos totales: Bs. ${totalIngresos}`, 14, 68);
    doc.setFontSize(13);
    doc.setFont("helvetica", "bold");
    doc.text("Detalle de Reservas", 14, 82);
    autoTable(doc, {
      startY: 86,
      head: [["Película", "Usuario", "Fecha", "Hora", "Asientos", "Total (Bs.)"]],
      body: reservasConfirmadas.map(r => [
        r.peliculaTitulo,
        r.usuarioNombre,
        new Date(r.fecha).toLocaleDateString("es-BO"),
        r.horario,
        r.asientos,
        r.total,
      ]),
      headStyles: { fillColor: [229, 9, 20] },
      styles: { fontSize: 9 },
    });
    const pdfBlob = doc.output("blob");
    const pdfUrl = URL.createObjectURL(pdfBlob);

    window.open(pdfUrl, "_blank");
      };

  return (
    <div style={{
      position: "fixed", inset: 0, zIndex: 300,
      background: "rgba(0,0,0,0.92)",
      display: "flex", alignItems: "center", justifyContent: "center",
      padding: 16,
    }} onClick={onClose}>
      <div style={{
        background: "#181818",
        border: "1px solid rgba(255,255,255,0.08)",
        borderRadius: 14, padding: "36px 32px",
        width: "100%", maxWidth: 860,
        maxHeight: "92vh", overflowY: "auto",
        boxShadow: "0 24px 80px rgba(0,0,0,0.9)",
      }} onClick={e => e.stopPropagation()}>

        {/* Header */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 28 }}>
          <h2 style={{ fontFamily: "'Bebas Neue',sans-serif", fontSize: 28, letterSpacing: 3, color: "#e50914", margin: 0 }}>
            ESTADÍSTICAS
          </h2>
          <div style={{ display: "flex", gap: 10 }}>
            <button onClick={generarPDF} style={{
              background: "#e50914", border: "none", borderRadius: 6,
              padding: "8px 18px", color: "#fff",
              fontFamily: "'Bebas Neue',sans-serif", fontSize: 15, letterSpacing: 1,
              cursor: "pointer",
            }}>⬇ DESCARGAR PDF</button>
            <button onClick={onClose} style={{ background: "none", border: "none", color: "#666", fontSize: 22, cursor: "pointer" }}>✕</button>
          </div>
        </div>

        {/* KPIs */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 14, marginBottom: 32 }}>
          {[
            { label: "Películas activas", value: peliculas.filter(p => p.activo).length },
            { label: "Reservas totales", value: reservasConfirmadas.length },
            { label: "Ingresos (Bs.)", value: totalIngresos },
          ].map(kpi => (
            <div key={kpi.label} style={{
              background: "rgba(229,9,20,0.07)",
              border: "1px solid rgba(229,9,20,0.2)",
              borderRadius: 10, padding: "16px 20px", textAlign: "center",
            }}>
              <p style={{ fontSize: 30, fontWeight: 900, color: "#e50914", margin: "0 0 4px", fontFamily: "'Bebas Neue',sans-serif" }}>{kpi.value}</p>
              <p style={{ fontSize: 11, color: "#888", margin: 0, letterSpacing: 0.5 }}>{kpi.label}</p>
            </div>
          ))}
        </div>

        {/* Tabla de reservas */}
        <h3 style={{ color: "#ccc", fontSize: 14, fontWeight: 600, marginBottom: 16, letterSpacing: 1 }}>
          DETALLE DE RESERVAS
        </h3>

        {reservasConfirmadas.length === 0 ? (
          <p style={{ color: "#555", fontStyle: "italic", textAlign: "center", padding: "40px 0" }}>
            No hay reservas confirmadas aún.
          </p>
        ) : (
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
            <thead>
              <tr style={{ background: "rgba(229,9,20,0.15)", borderBottom: "1px solid rgba(229,9,20,0.3)" }}>
                {["Película", "Usuario", "Fecha", "Hora", "Asientos", "Total (Bs.)"].map(col => (
                  <th key={col} style={{ padding: "10px 14px", textAlign: "left", color: "#e50914", fontWeight: 700, fontSize: 11, letterSpacing: 0.5 }}>
                    {col}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {reservasConfirmadas.map((r, i) => (
                <tr key={r.id} style={{
                  background: i % 2 === 0 ? "rgba(255,255,255,0.02)" : "transparent",
                  borderBottom: "1px solid rgba(255,255,255,0.04)",
                }}>
                  <td style={{ padding: "10px 14px", color: "#fff", fontWeight: 600 }}>{r.peliculaTitulo}</td>
                  <td style={{ padding: "10px 14px", color: "#aaa" }}>{r.usuarioNombre}</td>
                  <td style={{ padding: "10px 14px", color: "#aaa" }}>{new Date(r.fecha).toLocaleDateString("es-BO")}</td>
                  <td style={{ padding: "10px 14px", color: "#aaa" }}>{r.horario}</td>
                  <td style={{ padding: "10px 14px", color: "#aaa", textAlign: "center" }}>{r.asientos}</td>
                  <td style={{ padding: "10px 14px", color: "#4caf50", fontWeight: 700 }}>Bs. {r.total}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        <h3 style={{ color: "#ccc", fontSize: 14, fontWeight: 600, marginBottom: 16, letterSpacing: 1, marginTop: 32 }}>
          INGRESOS POR PELÍCULA (Bs.)
        </h3>

        {(() => {
          const datos = peliculas.filter(p => p.activo).map(p => {
            const total = reservasConfirmadas
              .filter(r => r.peliculaId === p.id)
              .reduce((sum: number, r: any) => sum + r.total, 0);
            return { nombre: p.titulo.length > 14 ? p.titulo.slice(0, 14) + "…" : p.titulo, total };
          }).filter(d => d.total > 0);

          if (datos.length === 0) return (
            <p style={{ color: "#555", fontStyle: "italic", textAlign: "center", padding: "20px 0" }}>
              Sin datos aún.
            </p>
          );

          const maximo = Math.max(...datos.map(d => d.total));

          return (
            <div style={{ display: "flex", alignItems: "flex-end", gap: 12, height: 180, padding: "0 8px" }}>
              {datos.map((d, i) => (
                <div key={i} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 6 }}>
                  <span style={{ color: "#4caf50", fontSize: 11, fontWeight: 700 }}>Bs.{d.total}</span>
                  <div style={{
                    width: "100%",
                    height: `${(d.total / maximo) * 140}px`,
                    background: "linear-gradient(#e50914)",
                    borderRadius: "4px 4px 0 0",
                    minHeight: 4,
                  }} />
                  <span style={{ color: "#888", fontSize: 10, textAlign: "center", lineHeight: 1.2 }}>{d.nombre}</span>
                </div>
              ))}
            </div>
          );
        })()}
      </div>
    </div>
  );
};

export default Estadisticas;