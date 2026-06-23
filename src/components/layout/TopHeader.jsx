import { Link, useLocation } from "react-router-dom";

const TITLES = {
  "/search": "Zoeken",
  "/groups": "Groepen",
  "/notifications": "Meldingen",
  "/profile": "Profiel",
  "/settings": "Instellingen",
};

export default function TopHeader() {
  const { pathname: p } = useLocation();

  if (p === "/login" || p === "/register") return null;

  const title =
    TITLES[p] ??
    (p.startsWith("/group/")
      ? "Groep"
      : p.startsWith("/user/")
        ? "Profiel"
        : "GraveRate");

  const isHome = p === "/";

  return (
    <header className="top-header">
      {isHome ? (
        <span
          className="font-display"
          style={{
            fontSize: 20,
            letterSpacing: "0.08em",
            color: "var(--accent)",
          }}
        >
          GraveRate
        </span>
      ) : (
        <span
          className="font-display"
          style={{ fontSize: 16, letterSpacing: "0.06em" }}
        >
          {title}
        </span>
      )}

      {p === "/profile" && (
        <Link to="/settings" style={{ color: "var(--muted)", fontSize: 18 }}>
          {/* tandwiel icon hier komen */}
        </Link>
      )}
    </header>
  );
}
