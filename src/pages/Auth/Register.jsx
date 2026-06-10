import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { registerUser, loginWithGoogle } from "../../firebase/auth";

function getAuthError(code) {
  switch (code) {
    case "auth/email-already-in-use":
      return "E-mail al in gebruik";
    case "auth/weak-password":
      return "Wachtwoord minimaal 6 tekens";
    case "auth/invalid-email":
      return "Ongeldig e-mailadres";
    default:
      return "Er is iets misgegaan";
  }
}

export default function Register() {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    if (password !== confirm)
      return setError("Wachtwoorden komen niet overeen");
    setLoading(true);
    setError("");
    try {
      await registerUser(username, email, password);
      navigate("/");
    } catch (err) {
      setError(getAuthError(err.code));
    } finally {
      setLoading(false);
    }
  }

  async function handleGoogle() {
    setError("");
    try {
      await loginWithGoogle();
      navigate("/");
    } catch (err) {
      setError(getAuthError(err.code));
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
        Maak een account aan
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
          type="text"
          placeholder="Gebruikersnaam"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />
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
        <input
          type="password"
          placeholder="Wachtwoord bevestigen"
          value={confirm}
          onChange={(e) => setConfirm(e.target.value)}
          required
        />

        <button
          type="submit"
          className="btn-primary"
          disabled={loading}
          style={{ marginTop: 4 }}
        >
          {loading ? "Laden..." : "Registreren"}
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
          Al een account?{" "}
          <Link to="/login" style={{ color: "var(--text)" }}>
            Inloggen
          </Link>
        </p>
      </form>
    </div>
  );
}
