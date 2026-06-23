import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { loginUser, loginWithGoogle } from "../../firebase/auth";

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      await loginUser(email, password);
      navigate("/");
    } catch {
      setError("Ongeldig e-mailadres of wachtwoord");
    } finally {
      setLoading(false);
    }
  }

  async function handleGoogle() {
    setError("");
    try {
      await loginWithGoogle();
      navigate("/");
    } catch {
      setError("Google login mislukt");
    }
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: 24,
      }}
    >
      <p
        className="font-display"
        style={{
          fontSize: 28,
          letterSpacing: "0.06em",
          color: "var(--accent)",
          marginBottom: 8,
        }}
      >
        GraveRate
      </p>
      <p style={{ color: "var(--muted)", fontSize: 13, marginBottom: 32 }}>
        Welkom terug
      </p>

      <form
        onSubmit={handleSubmit}
        style={{
          width: "100%",
          maxWidth: 360,
          display: "flex",
          flexDirection: "column",
          gap: 12,
        }}
      >
        {error && (
          <p
            style={{
              color: "var(--danger)",
              fontSize: 13,
              textAlign: "center",
            }}
          >
            {error}
          </p>
        )}

        <input
          type="email"
          placeholder="E-mailadres"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Wachtwoord"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <button
          type="submit"
          className="btn-primary"
          disabled={loading}
          style={{ marginTop: 4 }}
        >
          {loading ? "Laden..." : "Inloggen"}
        </button>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 8,
            margin: "4px 0",
          }}
        >
          <div style={{ flex: 1, height: 1, background: "var(--border)" }} />
          <span style={{ color: "var(--muted)", fontSize: 11 }}>of</span>
          <div style={{ flex: 1, height: 1, background: "var(--border)" }} />
        </div>

        <button type="button" className="btn-ghost" onClick={handleGoogle}>
          Doorgaan met Google
        </button>

        <p
          style={{
            textAlign: "center",
            color: "var(--muted)",
            fontSize: 13,
            marginTop: 8,
          }}
        >
          Nog geen account?{" "}
          <Link to="/register" style={{ color: "var(--text)" }}>
            Registreren
          </Link>
        </p>
      </form>
    </div>
  );
}
