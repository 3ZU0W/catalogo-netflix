import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";

const Navbar = ({
  busqueda, setBusqueda,
  modoAdmin, setModoAdmin,
  onVerCatalogo, onAgregarPelicula,
  onMisReservas, onEstadisticas, onLog, onGestionReservas,
}: {
  busqueda: string;
  setBusqueda: (v: string) => void;
  modoAdmin: boolean;
  setModoAdmin: (v: boolean) => void;
  onVerCatalogo: () => void;
  onAgregarPelicula: () => void;
  onMisReservas: () => void;
  onEstadisticas: () => void;
  onLog: () => void;
  onGestionReservas: () => void;
}) => {
  const { usuario, logout } = useAuth();
  const esAdmin = usuario?.rol === "admin";
  const [searchOpen, setSearchOpen] = useState(false);
  const [hamburguesaOpen, setHamburguesaOpen] = useState(false);
  const [avatarOpen, setAvatarOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  useEffect(() => {
    const handle = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener("resize", handle);
    return () => window.removeEventListener("resize", handle);
  }, []);

  return (
    <nav style={{
      position: "sticky", top: 0, zIndex: 100,
      background: "linear-gradient(180deg, rgba(0,0,0,0.98) 0%, rgba(0,0,0,0.88) 100%)",
      backdropFilter: "blur(14px)",
      borderBottom: "1px solid rgba(255,255,255,0.06)",
      padding: "0 16px",
    }}>
      <div style={{
        maxWidth: 1280, margin: "0 auto",
        display: "flex", alignItems: "center",
        justifyContent: "space-between", height: 64,
      }}>
        <button
          onClick={onVerCatalogo}
          style={{
            background: "none",
            border: "none",
            cursor: "pointer",
            fontFamily: "'Bebas Neue', sans-serif",
            fontSize: isMobile ? 24 : 28,
            color: "#e50914",
            letterSpacing: isMobile ? 2 : 3,
            padding: 0,
            flexShrink: 0,
          }}
        >
          {isMobile ? "MINUIT" : "MINUIT CINEMA"}
        </button>
        {!isMobile && (
          <div style={{ display: "flex", gap: 20, flexGrow: 1, alignItems: "center", marginLeft: 32 }}>
            <NavBtn onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}>Inicio</NavBtn>
            <NavBtn onClick={() => document.getElementById("cartelera")?.scrollIntoView({ behavior: "smooth" })}>Cartelera</NavBtn>
            {usuario && (
              <NavBtn onClick={onMisReservas}>Reservas</NavBtn>
            )}
            {esAdmin && (
              <>
                <button onClick={() => setModoAdmin(!modoAdmin)} style={{
                  background: modoAdmin ? "#e50914" : "none",
                  border: modoAdmin ? "none" : "1px solid rgba(229,9,20,0.4)",
                  borderRadius: 4, cursor: "pointer",
                  color: modoAdmin ? "#fff" : "#e50914",
                  fontSize: 13, fontWeight: 600, fontFamily: "inherit",
                  padding: "2px 12px", transition: "all 0.2s",
                }}>{modoAdmin ? "✓ Admin ON" : "Admin"}</button>
                {modoAdmin && (
                  <button onClick={onAgregarPelicula} style={{
                    background: "#e50914", border: "none", borderRadius: 4,
                    cursor: "pointer", color: "#fff",
                    fontSize: 13, fontWeight: 600, fontFamily: "inherit",
                    padding: "3px 14px",
                  }}>+ Película</button>
                )}
                <NavBtn onClick={onEstadisticas}>Estadísticas</NavBtn>
                <NavBtn onClick={onLog}>Registros</NavBtn>
                <NavBtn onClick={onGestionReservas}>Gestión Reservas</NavBtn>
              </>
            )}
          </div>
        )}

        {/* Derecha */}
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>

          {isMobile && usuario && (
            <div style={{ position: "relative" }}>
              <button onClick={() => { setHamburguesaOpen(!hamburguesaOpen); setAvatarOpen(false); }} style={{
                background: "none", border: "1px solid rgba(255,255,255,0.2)",
                borderRadius: 6, cursor: "pointer",
                color: "#fff", fontSize: 18,
                padding: "4px 10px",
              }}>☰</button>

              {hamburguesaOpen && (
                <div style={{
                  position: "absolute", top: 44, right: 0,
                  background: "#222", border: "1px solid rgba(255,255,255,0.1)",
                  borderRadius: 8, overflow: "hidden",
                  minWidth: 190, zIndex: 200,
                  boxShadow: "0 8px 32px rgba(0,0,0,0.8)",
                }}>
                  <button onClick={() => { window.scrollTo({ top: 0, behavior: "smooth" }); setHamburguesaOpen(false); }} style={menuItemStyle}>Inicio</button>
                  <button onClick={() => { document.getElementById("cartelera")?.scrollIntoView({ behavior: "smooth" }); setHamburguesaOpen(false); }} style={menuItemStyle}>Cartelera</button>
                  <button onClick={() => { onMisReservas(); setHamburguesaOpen(false); }} style={menuItemStyle}>Mis Reservas</button>
                  {esAdmin && (
                    <>
                      <button onClick={() => { setModoAdmin(!modoAdmin); setHamburguesaOpen(false); }} style={menuItemStyle}>
                        {modoAdmin ? "Admin ON" : "Modo Admin"}
                      </button>
                      {modoAdmin && (
                        <button onClick={() => { onAgregarPelicula(); setHamburguesaOpen(false); }} style={menuItemStyle}>
                          + Agregar Película
                        </button>
                      )}
                      <button onClick={() => { onEstadisticas(); setHamburguesaOpen(false); }} style={menuItemStyle}>Estadísticas</button>
                      <button onClick={() => { onLog(); setHamburguesaOpen(false); }} style={menuItemStyle}>Registros</button>
                      <button onClick={() => { onGestionReservas(); setHamburguesaOpen(false); }} style={menuItemStyle}>
                        Gestión Reservas
                      </button>
                    </>
                  )}
                </div>
              )}
            </div>
          )}

          {searchOpen ? (
            <input
              autoFocus
              value={busqueda}
              onChange={e => setBusqueda(e.target.value)}
              placeholder="Buscar película..."
              style={{
                background: "rgba(255,255,255,0.08)",
                border: "1px solid rgba(255,255,255,0.2)",
                borderRadius: 4, padding: "6px 10px",
                color: "#fff", fontSize: 13, outline: "none",
                width: isMobile ? 120 : 200,
              }}
              onBlur={() => { if (!busqueda) setSearchOpen(false); }}
            />
          ) : (
            <button onClick={() => setSearchOpen(true)} style={{
              background: "none", border: "none", cursor: "pointer",
              color: "#e5e5e5", fontSize: 16,
            }}>buscar</button>
          )}

          {/* Avatar */}
          {usuario && (
            <div style={{ position: "relative" }}>
              <button onClick={() => { setAvatarOpen(!avatarOpen); setHamburguesaOpen(false); }} style={{
                display: "flex", alignItems: "center", gap: 6,
                background: "none", border: "none", cursor: "pointer",
              }}>
                <div style={{
                  width: 34, height: 34, borderRadius: "50%",
                  background: usuario.rol === "admin" ? "#e50914" : "#333",
                  border: "2px solid rgba(255,255,255,0.15)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontWeight: 700, fontSize: 13, color: "#fff",
                }}>{usuario.username[0].toUpperCase()}</div>
                {!isMobile && (
                  <>
                    <span style={{ color: "#ccc", fontSize: 13 }}>{usuario.username}</span>
                    {esAdmin && (
                      <span style={{
                        background: "#e50914", color: "#fff",
                        fontSize: 9, padding: "1px 5px", borderRadius: 3,
                        fontWeight: 700, letterSpacing: 0.5,
                      }}>ADMIN</span>
                    )}
                  </>
                )}
              </button>

              {avatarOpen && (
                <div style={{
                  position: "absolute", top: 44, right: 0,
                  background: "#222", border: "1px solid rgba(255,255,255,0.1)",
                  borderRadius: 8, overflow: "hidden",
                  minWidth: 190, zIndex: 200,
                  boxShadow: "0 8px 32px rgba(0,0,0,0.8)",
                }}>
                  <div style={{ padding: "12px 16px", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
                    <p style={{ margin: 0, fontSize: 13, color: "#fff", fontWeight: 600 }}>{usuario.username}</p>
                    <p style={{ margin: 0, fontSize: 11, color: "#666" }}>{usuario.email}</p>
                    {esAdmin && <span style={{ background: "#e50914", color: "#fff", fontSize: 9, padding: "1px 5px", borderRadius: 3, fontWeight: 700 }}>ADMIN</span>}
                  </div>
                  <button onClick={() => { logout(); setAvatarOpen(false); }} style={{ ...menuItemStyle, color: "#e50914" }}>
                    Cerrar sesión
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

const NavBtn = ({ onClick, children }: { onClick: () => void; children: React.ReactNode }) => (
  <button onClick={onClick} style={{
    background: "none", border: "none", cursor: "pointer",
    color: "#e5e5e5", fontSize: 14, fontWeight: 500,
    fontFamily: "inherit", padding: 0, transition: "color 0.2s",
  }}
    onMouseEnter={e => (e.currentTarget.style.color = "#fff")}
    onMouseLeave={e => (e.currentTarget.style.color = "#e5e5e5")}
  >{children}</button>
);

const menuItemStyle: React.CSSProperties = {
  display: "block", width: "100%",
  background: "none", border: "none",
  textAlign: "left", padding: "10px 16px",
  color: "#ccc", fontSize: 13, cursor: "pointer",
  fontFamily: "inherit",
};

export default Navbar;