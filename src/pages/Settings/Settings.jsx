import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "../../firebase/config";
import { useAuth } from "../../context/authContext";

export default function Settings() {
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();
  const [userData, setUserData] = useState(null);
  const [isPrivate, setIsPrivate] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (!currentUser) return;
    getDoc(doc(db, "users", currentUser.uid)).then((snap) => {
      if (snap.exists()) {
        const data = snap.data();
        setUserData(data);
        setIsPrivate(data.private ?? false);
      }
    });
  }, [currentUser]);

  async function handlePrivacyToggle() {
    const newVal = !isPrivate;
    setIsPrivate(newVal);
    setSaved(false);
    await updateDoc(doc(db, "users", currentUser.uid), { private: newVal });
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }

  async function handleLogout() {
    await logout();
    navigate("/login");
  }

  return (
    <div
      style={{ padding: 16, display: "flex", flexDirection: "column", gap: 12 }}
    >
      <div className="card">
        <div
          style={{
            padding: "14px 16px",
            borderBottom: "1px solid var(--border)",
          }}
        >
          <p
            style={{
              fontSize: 11,
              letterSpacing: "0.1em",
              textTransform: "uppercase",
              color: "var(--muted)",
              marginBottom: 8,
            }}
          >
            Account
          </p>
          <p style={{ fontWeight: 600 }}>{userData?.username}</p>
          <p style={{ fontSize: 12, color: "var(--muted)" }}>
            {userData?.email}
          </p>
        </div>
      </div>

      <div className="card">
        <div
          style={{
            padding: "14px 16px",
            borderBottom: "1px solid var(--border)",
          }}
        >
          <p
            style={{
              fontSize: 11,
              letterSpacing: "0.1em",
              textTransform: "uppercase",
              color: "var(--muted)",
              marginBottom: 12,
            }}
          >
            Privacy
          </p>

          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <div>
              <p style={{ fontSize: 14, fontWeight: 500 }}>Privé profiel</p>
              <p style={{ fontSize: 12, color: "var(--muted)", marginTop: 2 }}>
                Alleen vrienden zien je posts
              </p>
            </div>
            <button
              onClick={handlePrivacyToggle}
              style={{
                width: 44,
                height: 24,
                borderRadius: 12,
                border: "none",
                cursor: "pointer",
                background: isPrivate ? "var(--text)" : "var(--surface2)",
                outline: "1px solid var(--border)",
                position: "relative",
                transition: "background 0.2s",
              }}
            >
              <span
                style={{
                  position: "absolute",
                  top: 3,
                  width: 18,
                  height: 18,
                  borderRadius: "50%",
                  background: isPrivate ? "var(--bg)" : "var(--muted)",
                  transition: "left 0.2s",
                  left: isPrivate ? 23 : 3,
                }}
              />
            </button>
          </div>
          {saved && (
            <p style={{ fontSize: 12, color: "var(--accent)", marginTop: 8 }}>
              Opgeslagen
            </p>
          )}
        </div>
      </div>

      <div className="card">
        <button
          onClick={handleLogout}
          style={{
            width: "100%",
            padding: "14px 16px",
            textAlign: "left",
            color: "var(--danger)",
            background: "none",
            border: "none",
            cursor: "pointer",
            fontSize: 14,
          }}
        >
          Uitloggen
        </button>
      </div>
    </div>
  );
}
