import { useState, useRef } from "react";
import ReCAPTCHA from "react-google-recaptcha";
import { useAuth, evaluarContrasena } from "../context/AuthContext";

type Modo = "login" | "registro";

const LoginModal = ({ onClose }: { onClose: () => void }) => {
  const { login, registrar } = useAuth();
  const [modo, setModo] = useState<Modo>("login");

  const [loginUser, setLoginUser] = useState("");
  const [loginPass, setLoginPass] = useState("");

  const [regUser, setRegUser] = useState("");
  const [regEmail, setRegEmail] = useState("");
  const [regPass, setRegPass] = useState("");
  const [regPassConf, setRegPassConf] = useState("");
  const [regFecha, setRegFecha] = useState("");

  const captchaRef = useRef<ReCAPTCHA>(null);
  const [captchaToken, setCaptchaToken] = useState<string | null>(null);

  const [error, setError] = useState("");
  const [exito, setExito] = useState("");
  const [loading, setLoading] = useState(false);

  const fortaleza = evaluarContrasena(regPass);

  const resetCaptcha = () => {
    captchaRef.current?.reset();
    setCaptchaToken(null);
  };

  const handleLogin = async () => {
    setError("");
    if (!loginUser.trim() || !loginPass.trim()) {
      setError("Completa todos los campos");
      return;
    }
    if (!captchaToken) {
      setError("Por favor completa el CAPTCHA");
      return;
    }
    setLoading(true);
    const resultado = await login(loginUser.trim(), loginPass);
    setLoading(false);
    if (resultado === "ok") {
      onClose();
    } else if (resultado === "credenciales") {
      setError("Usuario o contraseña incorrectos");
      resetCaptcha();
    } else {
      setError("Tu cuenta está desactivada. Contacta al administrador.");
      resetCaptcha();
    }
  };

  const handleRegistro = async () => {
    setError("");
    if (!regUser.trim() || !regEmail.trim() || !regPass || !regPassConf || !regFecha) {
      setError("Completa todos los campos");
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(regEmail)) {
      setError("Email inválido");
      return;
    }
    if (fortaleza.nivel === "debil") {
      setError("La contraseña es muy débil. Usa al menos 8 caracteres, una mayúscula y un número.");
      return;
    }
    if (regPass !== regPassConf) {
      setError("Las contraseñas no coinciden");
      return;
    }
    if (!captchaToken) {
      setError("Por favor completa el CAPTCHA");
      return;
    }
    setLoading(true);
    const resultado = await registrar({
      username: regUser.trim(),
      email: regEmail.trim(),
      password: regPass,
      fechaNacimiento: regFecha,
      rol: "cliente",
    });
    setLoading(false);
    if (resultado === "ok") {
      setExito("¡Cuenta creada! Ya puedes iniciar sesión.");
      setTimeout(() => { setModo("login"); setExito(""); }, 2000);
    } else {
      setError("El usuario o email ya está registrado");
      resetCaptcha();
    }
  };

  const inputStyle: React.CSSProperties = {
    width: "100%",
    background: "rgba(255,255,255,0.07)",
    border: "1px solid rgba(255,255,255,0.1)",
    borderRadius: 6,
    padding: "10px 14px",
    color: "#fff",
    fontSize: 14,
    outline: "none",
    boxSizing: "border-box",
  };

  const labelStyle: React.CSSProperties = {
    display: "block",
    color: "#aaa",
    fontSize: 12,
    marginBottom: 6,
    letterSpacing: 0.5,
  };

  return (
    <div
      style={{
        position: "fixed", inset: 0, zIndex: 300,
        background: "rgba(0,0,0,0.92)",
        display: "flex", alignItems: "center", justifyContent: "center",
        padding: 16,
      }}
      onClick={onClose}
    >
      <div
        style={{
          background: "rgba(18,18,18,0.98)",
          border: "1px solid rgba(255,255,255,0.08)",
          borderRadius: 14,
          padding: "40px 36px",
          width: "100%",
          maxWidth: 400,
          maxHeight: "92vh",
          overflowY: "auto",
          boxShadow: "0 32px 80px rgba(0,0,0,0.95)",
        }}
        onClick={e => e.stopPropagation()}
      >
        <h2 style={{
          fontFamily: "'Bebas Neue', sans-serif",
          fontSize: 34, letterSpacing: 4,
          color: "#e50914", margin: "0 0 4px",
        }}>NETFLICK</h2>

        {/* Tabs */}
        <div style={{ display: "flex", gap: 0, marginBottom: 28, borderBottom: "1px solid rgba(255,255,255,0.08)" }}>
          {(["login", "registro"] as Modo[]).map(m => (
            <button
              key={m}
              onClick={() => { setModo(m); setError(""); resetCaptcha(); }}
              style={{
                flex: 1, background: "none", border: "none",
                borderBottom: `2px solid ${modo === m ? "#e50914" : "transparent"}`,
                padding: "10px 0",
                color: modo === m ? "#fff" : "#666",
                fontSize: 14, fontWeight: 600,
                cursor: "pointer", letterSpacing: 1,
                textTransform: "uppercase",
                transition: "all 0.2s",
              }}
            >
              {m === "login" ? "Iniciar Sesión" : "Crear Cuenta"}
            </button>
          ))}
        </div>

        {/* Mensajes */}
        {error && (
          <div style={{
            background: "rgba(229,9,20,0.1)",
            border: "1px solid rgba(229,9,20,0.3)",
            borderRadius: 6, padding: "10px 14px",
            marginBottom: 16, color: "#ff6b6b", fontSize: 13,
          }}>{error}</div>
        )}
        {exito && (
          <div style={{
            background: "rgba(76,175,80,0.1)",
            border: "1px solid rgba(76,175,80,0.3)",
            borderRadius: 6, padding: "10px 14px",
            marginBottom: 16, color: "#4caf50", fontSize: 13,
          }}>✓ {exito}</div>
        )}

        {/* LOGIN */}
        {modo === "login" && (
          <>
            <div style={{ marginBottom: 16 }}>
              <label style={labelStyle}>Usuario</label>
              <input
                type="text"
                value={loginUser}
                onChange={e => setLoginUser(e.target.value)}
                onKeyDown={e => e.key === "Enter" && handleLogin()}
                style={inputStyle}
                placeholder="Tu nombre de usuario"
                autoFocus
              />
            </div>
            <div style={{ marginBottom: 20 }}>
              <label style={labelStyle}>Contraseña</label>
              <input
                type="password"
                value={loginPass}
                onChange={e => setLoginPass(e.target.value)}
                onKeyDown={e => e.key === "Enter" && handleLogin()}
                style={inputStyle}
                placeholder="••••••••"
              />
            </div>
          </>
        )}

        {/* REGISTRO */}
        {modo === "registro" && (
          <>
            {[
              { label: "Nombre de usuario", value: regUser, set: setRegUser, type: "text", placeholder: "ej: juanperez" },
              { label: "Correo electrónico", value: regEmail, set: setRegEmail, type: "email", placeholder: "correo@ejemplo.com" },
            ].map(f => (
              <div key={f.label} style={{ marginBottom: 14 }}>
                <label style={labelStyle}>{f.label}</label>
                <input
                  type={f.type}
                  value={f.value}
                  onChange={e => f.set(e.target.value)}
                  style={inputStyle}
                  placeholder={f.placeholder}
                />
              </div>
            ))}

            <div style={{ marginBottom: 6 }}>
              <label style={labelStyle}>Contraseña</label>
              <input
                type="password"
                value={regPass}
                onChange={e => setRegPass(e.target.value)}
                style={inputStyle}
                placeholder="Mínimo 8 caracteres"
              />
            </div>

            {regPass && (
              <div style={{ marginBottom: 14 }}>
                <div style={{ display: "flex", gap: 4, marginBottom: 4 }}>
                  {(["debil", "media", "fuerte"] as const).map((nivel, i) => (
                    <div key={nivel} style={{
                      flex: 1, height: 4, borderRadius: 2,
                      background: (
                        fortaleza.nivel === "debil" ? (i === 0 ? "#e50914" : "#333") :
                        fortaleza.nivel === "media" ? (i <= 1 ? "#f5a623" : "#333") :
                        "#4caf50"
                      ),
                      transition: "background 0.3s",
                    }} />
                  ))}
                </div>
                <span style={{ fontSize: 11, color: fortaleza.color }}>{fortaleza.texto}</span>
              </div>
            )}

            <div style={{ marginBottom: 14 }}>
              <label style={labelStyle}>Confirmar contraseña</label>
              <input
                type="password"
                value={regPassConf}
                onChange={e => setRegPassConf(e.target.value)}
                style={{
                  ...inputStyle,
                  borderColor: regPassConf && regPass !== regPassConf
                    ? "rgba(229,9,20,0.5)"
                    : "rgba(255,255,255,0.1)",
                }}
                placeholder="Repite la contraseña"
              />
              {regPassConf && regPass !== regPassConf && (
                <span style={{ fontSize: 11, color: "#e50914" }}>Las contraseñas no coinciden</span>
              )}
            </div>

            <div style={{ marginBottom: 20 }}>
              <label style={labelStyle}>
                Fecha de nacimiento{" "}
                <span style={{ color: "#555", fontSize: 10 }}>(requerida para contenido +18)</span>
              </label>
              <input
                type="date"
                value={regFecha}
                onChange={e => setRegFecha(e.target.value)}
                max={new Date().toISOString().split("T")[0]}
                style={{ ...inputStyle, colorScheme: "dark" }}
              />
            </div>
          </>
        )}

        {/* RECAPTCHA V2 */}
        <div style={{ marginBottom: 20 }}>
          <ReCAPTCHA
            ref={captchaRef}
            sitekey="6LejZhItAAAAAE84EoQhqyrHzr9erD6fLTmtbIWn"
            onChange={(token) => setCaptchaToken(token)}
            onExpired={() => setCaptchaToken(null)}
            theme="dark"
          />
        </div>

        <button
          onClick={modo === "login" ? handleLogin : handleRegistro}
          disabled={loading}
          style={{
            width: "100%",
            background: loading ? "#555" : "#e50914",
            border: "none", borderRadius: 6,
            padding: "13px",
            color: "#fff",
            fontFamily: "'Bebas Neue', sans-serif",
            fontSize: 19, letterSpacing: 2,
            cursor: loading ? "not-allowed" : "pointer",
            transition: "background 0.2s",
          }}
        >
          {loading ? "CARGANDO..." : modo === "login" ? "ENTRAR" : "CREAR CUENTA"}
        </button>
      </div>
    </div>
  );
};

export default LoginModal;