import { useState, useEffect } from "react";
import type { Pelicula } from "./types/pelicula";
import { TODOS_GENEROS } from "./data/peliculas";
import { AuthProvider, useAuth } from "./context/AuthContext";
import Navbar from "./componentes/Navbar";
import HeroCarousel from "./componentes/HeroCarousel";
import MovieCard from "./componentes/MovieCard";
import DetalleModal from "./componentes/DetalleModal";
import AdminModal from "./componentes/AdminModal";
import LoginModal from "./componentes/LoginModal";
import MisReservas from "./componentes/MisReservas";
import Estadisticas from "./componentes/Estadisticas";
import LogPanel from "./componentes/LogPanel";
import Filtros from "./componentes/Filtros";
import ReservaModal from "./componentes/ReservaModal";
import ComentariosCine from "./componentes/ComentariosCine";
import { api } from "./api/api";

const InnerApp = () => {
  const { usuario, token } = useAuth();

  const [peliculas, setPeliculas] = useState<Pelicula[]>([]);
  const [busqueda, setBusqueda] = useState("");
  const [generosSeleccionados, setGenerosSeleccionados] = useState<number[]>([]);
  const [anioFiltro, setAnioFiltro] = useState("");
  const [modoAdmin, setModoAdmin] = useState(false);
  const [peliculaReserva, setPeliculaReserva] = useState<Pelicula | null>(null);
  const [peliculaDetalle, setPeliculaDetalle] = useState<Pelicula | null>(null);
  const [peliculaEditar, setPeliculaEditar] = useState<Pelicula | null | "nueva">(null);
  const [showLogin, setShowLogin] = useState(false);
  const [showReservas, setShowReservas] = useState(false);
  const [showEstadisticas, setShowEstadisticas] = useState(false);
  const [showLog, setShowLog] = useState(false);

  useEffect(() => {
    api.getPeliculas().then(data => setPeliculas(data));
  }, []);

  useEffect(() => {
    if (!usuario) setShowLogin(true);
    else setShowLogin(false);
  }, [usuario]);

  const esAdmin = usuario?.rol === "admin";
  const peliculasActivas = peliculas.filter(p => p.activo);

  const filtrar = (lista: Pelicula[]) => lista.filter(p => {
    const matchBusqueda = p.titulo.toLowerCase().includes(busqueda.toLowerCase());
    const matchGenero = generosSeleccionados.length === 0 ||
      p.generos.some(g => generosSeleccionados.includes(g.id));
    const matchAnio = !anioFiltro || p.anio === Number(anioFiltro);
    return matchBusqueda && matchGenero && matchAnio;
  });

  const enCartelera = filtrar(peliculasActivas.filter(p => p.estado === "en_cartelera"));
  const proximosEstrenos = filtrar(peliculasActivas.filter(p => p.estado === "proximo_estreno"));
  const anios = [...new Set(peliculasActivas.map(p => p.anio))].sort((a, b) => b - a);

  const handleGuardarPelicula = async (p: Pelicula, archivo: File | null) => {
    if (!token) return;
    if (p.id === 0) {
      const nuevo = await api.crearPelicula(p, token);
      if (archivo) {
        const conPortada = await api.subirPortada(nuevo.id, archivo, token);
        setPeliculas(prev => [conPortada, ...prev]);
      } else {
        setPeliculas(prev => [nuevo, ...prev]);
      }
    } else {
      await api.actualizarPelicula(p.id, p, token);
      if (archivo) {
        const conPortada = await api.subirPortada(p.id, archivo, token);
        setPeliculas(prev => prev.map(x => x.id === p.id ? conPortada : x));
      } else {
        setPeliculas(prev => prev.map(x => x.id === p.id ? p : x));
      }
    }
    setPeliculaEditar(null);
  };

  const handleEliminar = async (id: number) => {
    if (!token) return;
    await api.eliminarPelicula(id, token);
    setPeliculas(prev => prev.map(p => p.id === id ? { ...p, activo: false } : p));
  };

  const SeccionPeliculas = ({
    titulo, icono, lista, color,
  }: { titulo: string; icono?: string; lista: Pelicula[]; color: string }) => (
    <section style={{ marginBottom: 52 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 20 }}>
        <span style={{ fontSize: 22 }}>{icono}</span>
        <h2 style={{
          fontFamily: "'Bebas Neue', sans-serif",
          fontSize: 26, letterSpacing: 3, color, margin: 0,
        }}>{titulo}</h2>
        <span style={{
          background: "rgba(255,255,255,0.07)",
          color: "#888", fontSize: 12,
          padding: "2px 10px", borderRadius: 20,
        }}>{lista.length}</span>
      </div>
      {lista.length === 0 ? (
        <p style={{ color: "#555" }}>No hay películas en esta sección.</p>
      ) : (
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(170px, 1fr))",
          gap: 16,
        }}>
          {lista.map(p => (
            <MovieCard
              key={p.id}
              pelicula={p}
              onClick={() => setPeliculaDetalle(p)}
              modoAdmin={modoAdmin && esAdmin}
              onEditar={() => setPeliculaEditar(p)}
              onEliminar={() => handleEliminar(p.id)}
            />
          ))}
        </div>
      )}
    </section>
  );

  return (
    <div style={{ minHeight: "100vh", background: "#0a0a0a", color: "#fff" }}>
      <Navbar
        busqueda={busqueda}
        setBusqueda={setBusqueda}
        modoAdmin={modoAdmin}
        setModoAdmin={setModoAdmin}
        onVerCatalogo={() => setBusqueda("")}
        onAgregarPelicula={() => setPeliculaEditar("nueva")}
        onMisReservas={() => setShowReservas(true)}
        onEstadisticas={() => setShowEstadisticas(true)}
        onLog={() => setShowLog(true)}
      />

      {!usuario ? (
        <div style={{
          minHeight: "calc(100vh - 64px)",
          background: "linear-gradient(135deg, #0a0a0a 0%, #1a0000 50%, #0a0a0a 100%)",
          display: "flex", flexDirection: "column",
          alignItems: "center", justifyContent: "center",
          position: "relative", overflow: "hidden",
        }}>
          <div style={{
            position: "absolute", inset: 0,
            backgroundImage: `radial-gradient(circle at 20% 50%, rgba(229,9,20,0.08) 0%, transparent 50%),
                              radial-gradient(circle at 80% 50%, rgba(229,9,20,0.05) 0%, transparent 50%)`,
          }} />
          <div style={{ position: "relative", textAlign: "center", padding: "0 24px" }}>
            <p style={{
              fontFamily: "'Bebas Neue', sans-serif",
              fontSize: 90, color: "#e50914",
              margin: "0 0 0px", letterSpacing: 8,
              textShadow: "0 0 60px rgba(229,9,20,0.4)", lineHeight: 1,
            }}>NETFLICK</p>
            <p style={{ color: "#888", fontSize: 15, margin: "0 0 12px", letterSpacing: 3, textTransform: "uppercase" }}>
              Tu cine, cuando quieras
            </p>
            <div style={{ width: 60, height: 2, background: "#e50914", margin: "0 auto 32px" }} />
            <p style={{ color: "#555", fontSize: 14, maxWidth: 380, margin: "0 auto 40px", lineHeight: 1.8 }}>
              Consulta la cartelera, reserva tus entradas y disfruta de los mejores estrenos.
              Inicia sesión para acceder.
            </p>
            <div style={{ display: "flex", gap: 32, justifyContent: "center", marginBottom: 40 }}>
              {[
                { num: 1, label: "En cartelera" },
                { num: 0, label: "Próximos estrenos" },
                { num: 3, label: "Funciones diarias" },
              ].map(stat => (
                <div key={stat.label} style={{ textAlign: "center" }}>
                  <p style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 42, color: "#e50914", margin: 0, lineHeight: 1 }}>
                    {stat.num}
                  </p>
                  <p style={{ color: "#555", fontSize: 11, margin: "4px 0 0", letterSpacing: 1, textTransform: "uppercase" }}>
                    {stat.label}
                  </p>
                </div>
              ))}
            </div>
            <button
              onClick={() => setShowLogin(true)}
              style={{
                background: "#e50914", border: "none", borderRadius: 6,
                padding: "16px 56px", color: "#fff",
                fontFamily: "'Bebas Neue', sans-serif",
                fontSize: 22, letterSpacing: 4, cursor: "pointer",
                boxShadow: "0 8px 32px rgba(229,9,20,0.4)", transition: "all 0.2s",
              }}
              onMouseEnter={e => { e.currentTarget.style.transform = "scale(1.05)"; }}
              onMouseLeave={e => { e.currentTarget.style.transform = "scale(1)"; }}
            >INICIAR SESIÓN</button>
          </div>
        </div>
      ) : (
        <>
          <HeroCarousel
            peliculas={peliculasActivas.filter(p => p.estado === "en_cartelera")}
            onSelect={setPeliculaDetalle}
            onReservar={setPeliculaReserva}
          />
          <div style={{ maxWidth: 1280, margin: "0 auto", padding: "40px 32px" }}>
            <Filtros
              generos={TODOS_GENEROS}
              seleccionados={generosSeleccionados}
              setSeleccionados={setGenerosSeleccionados}
              anioFiltro={anioFiltro}
              setAnioFiltro={setAnioFiltro}
              anios={anios}
            />
            <SeccionPeliculas titulo="EN CARTELERA" lista={enCartelera} color="#fff" />
            <SeccionPeliculas titulo="PRÓXIMOS ESTRENOS" lista={proximosEstrenos} color="#f5a623" />
            <ComentariosCine />
          </div>
        </>
      )}

      {showLogin && <LoginModal onClose={() => setShowLogin(false)} />}

      {peliculaDetalle && (
        <DetalleModal
          pelicula={peliculaDetalle}
          onClose={() => setPeliculaDetalle(null)}
          onLogin={() => setShowLogin(true)}
        />
      )}

      {peliculaEditar !== null && (
        <AdminModal
          pelicula={peliculaEditar === "nueva" ? null : peliculaEditar}
          onGuardar={handleGuardarPelicula}
          onClose={() => setPeliculaEditar(null)}
        />
      )}

      {showReservas && <MisReservas onClose={() => setShowReservas(false)} />}
      {showEstadisticas && (
        <Estadisticas peliculas={peliculasActivas} onClose={() => setShowEstadisticas(false)} />
      )}
      {showLog && esAdmin && <LogPanel onClose={() => setShowLog(false)} />}
      {peliculaReserva && (
        <ReservaModal pelicula={peliculaReserva} onClose={() => setPeliculaReserva(null)} />
      )}
    </div>
  );
};

const App = () => (
  <AuthProvider>
    <InnerApp />
  </AuthProvider>
);

export default App;