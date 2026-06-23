import { Link } from "react-router-dom";
import { useAuth } from "../../context/authContext";

export default function Home() {
  const { currentUser } = useAuth();

  return (
    <div>
      <div
        style={{
          padding: "40px 16px 24px",
          textAlign: "center",
          borderBottom: "1px solid var(--border)",
        }}
      >
        <p
          className="font-display"
          style={{
            fontSize: 11,
            letterSpacing: "0.2em",
            color: "var(--accent)",
            textTransform: "uppercase",
            marginBottom: 12,
          }}
        >
          Est. MMXXVI
        </p>
        <h1
          className="font-display"
          style={{ fontSize: 32, lineHeight: 1.15, marginBottom: 12 }}
        >
          Ontdek het
          <br />
          stille erfgoed
        </h1>
        <p
          style={{
            color: "var(--muted)",
            fontSize: 13,
            maxWidth: 280,
            margin: "0 auto 20px",
          }}
        >
          Beoordeel, deel en ontdek historische begraafplaatsen wereldwijd
        </p>
        {!currentUser && (
          <div style={{ display: "flex", gap: 8, justifyContent: "center" }}>
            <Link to="/register">
              <button className="btn-primary">Registreren</button>
            </Link>
            <Link to="/login">
              <button className="btn-ghost">Inloggen</button>
            </Link>
          </div>
        )}
      </div>

      {/* Feed - posts komen hier zodra de posts feature gebouwd is */}
    </div>
  );
}
