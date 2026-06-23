import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { collection, query, where, onSnapshot } from "firebase/firestore";
import { db } from "../../firebase/config";
import { useAuth } from "../../context/authContext";
import { IconHome, IconSearch, IconGroups, IconBell, IconUser } from "./Icons";

export default function BottomNav() {
  const { currentUser } = useAuth();
  const { pathname: p } = useLocation();
  const [unread, setUnread] = useState(0);

  useEffect(() => {
    if (!currentUser) return;
    const q = query(
      collection(db, "notifications"),
      where("uid", "==", currentUser.uid),
      where("read", "==", false),
    );
    return onSnapshot(q, (snap) => setUnread(snap.size));
  }, [currentUser]);

  if (p === "/login" || p === "/register") return null;

  return (
    <nav className="bottom-nav">
      <Link to="/" className={p === "/" ? "active" : ""}>
        <IconHome filled={p === "/"} />
        Home
      </Link>

      <Link to="/search" className={p.startsWith("/search") ? "active" : ""}>
        <IconSearch />
        Zoeken
      </Link>
      
      <Link to="/postsAdd" className={p.startsWith("/postsAdd") ? "active" : ""}>
        <IconSearch />
        nieuwe post maken
      </Link>

      <Link to="/groups" className={p.startsWith("/group") ? "active" : ""}>
        <IconGroups filled={p.startsWith("/group")} />
        Groepen
      </Link>

      {currentUser ? (
        <>
          <Link
            to="/notifications"
            className={p === "/notifications" ? "active" : ""}
            style={{ position: "relative" }}
          >
            <span style={{ position: "relative" }}>
              <IconBell filled={p === "/notifications"} />
              {unread > 0 && (
                <span
                  className="badge"
                  style={{
                    position: "absolute",
                    top: -4,
                    right: -6,
                    fontSize: 9,
                    width: 14,
                    height: 14,
                  }}
                >
                  {unread}
                </span>
              )}
            </span>
            Meldingen
          </Link>

          <Link to="/profile" className={p === "/profile" ? "active" : ""}>
            <IconUser filled={p === "/profile"} />
            Profiel
          </Link>
        </>
      ) : (
        <Link to="/login" className={p === "/login" ? "active" : ""}>
          <IconUser />
          Login
        </Link>
      )}
    </nav>
  );
}
