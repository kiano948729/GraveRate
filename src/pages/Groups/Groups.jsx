import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  getAllGroups,
  createGroup,
} from "../../firebase/groups/groups.service";
import { useAuth } from "../../context/authContext";

export default function Groups() {
  const { currentUser } = useAuth();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState(false);
  const [form, setForm] = useState({ name: "", desc: "", isPrivate: false });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    load();
  }, []);

  async function load() {
    setLoading(true);
    const data = await getAllGroups();
    setItems(data);
    setLoading(false);
  }

  async function submit() {
    if (!form.name.trim()) return;
    setSubmitting(true);
    await createGroup(currentUser.uid, form.name, form.desc, form.isPrivate);
    setModal(false);
    setForm({ name: "", desc: "", isPrivate: false });
    load();
    setSubmitting(false);
  }

  return (
    <div>
      <div
        style={{
          padding: "12px 16px",
          display: "flex",
          justifyContent: "flex-end",
          borderBottom: "1px solid var(--border)",
        }}
      >
        {currentUser && (
          <button
            className="btn-primary"
            onClick={() => setModal(true)}
            style={{ padding: "8px 16px", fontSize: 13 }}
          >
            + Nieuwe groep
          </button>
        )}
      </div>

      <div>
        {loading && (
          <p
            style={{
              textAlign: "center",
              color: "var(--muted)",
              padding: 40,
              fontSize: 13,
            }}
          >
            Laden...
          </p>
        )}

        {!loading && items.length === 0 && (
          <p
            style={{
              textAlign: "center",
              color: "var(--muted)",
              padding: 40,
              fontSize: 13,
            }}
          >
            Nog geen groepen. Maak de eerste aan!
          </p>
        )}

        {items.map((g) => (
          <Link
            key={g.id}
            to={`/group/${g.id}`}
            style={{ textDecoration: "none" }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 12,
                padding: "14px 16px",
                borderBottom: "1px solid var(--border)",
                transition: "background 0.12s",
              }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.background = "var(--surface)")
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.background = "transparent")
              }
            >
              {/* Groep avatar */}
              <div
                className="avatar"
                style={{
                  width: 44,
                  height: 44,
                  fontSize: 18,
                  flexShrink: 0,
                  background: "var(--surface2)",
                  border: "1px solid var(--border)",
                  color: "var(--accent)",
                  fontFamily: "Cinzel, serif",
                }}
              >
                {g.name.charAt(0).toUpperCase()}
              </div>

              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                  <p
                    style={{
                      fontWeight: 600,
                      fontSize: 14,
                      color: "var(--text)",
                    }}
                  >
                    {g.name}
                  </p>
                  {g.private && (
                    <span
                      style={{
                        fontSize: 10,
                        color: "var(--muted)",
                        background: "var(--surface2)",
                        padding: "1px 6px",
                        borderRadius: 10,
                        border: "1px solid var(--border)",
                      }}
                    >
                      privé
                    </span>
                  )}
                </div>
                {g.description && (
                  <p
                    style={{
                      fontSize: 12,
                      color: "var(--muted)",
                      marginTop: 2,
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {g.description}
                  </p>
                )}
              </div>

              <span
                style={{ fontSize: 12, color: "var(--muted)", flexShrink: 0 }}
              >
                {g.members?.length ?? 0} leden
              </span>
            </div>
          </Link>
        ))}
      </div>

      {/* Modal */}
      {modal && (
        <div
          onClick={() => setModal(false)}
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.85)",
            display: "flex",
            alignItems: "flex-end",
            justifyContent: "center",
            zIndex: 200,
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              background: "var(--surface)",
              borderRadius: "16px 16px 0 0",
              borderTop: "1px solid var(--border)",
              padding: 24,
              width: "100%",
              maxWidth: 600,
              display: "flex",
              flexDirection: "column",
              gap: 12,
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: 4,
              }}
            >
              <p className="font-display" style={{ fontSize: 16 }}>
                Nieuwe groep
              </p>
              <button
                onClick={() => setModal(false)}
                style={{
                  background: "none",
                  border: "none",
                  color: "var(--muted)",
                  cursor: "pointer",
                  fontSize: 18,
                }}
              >
                ✕
              </button>
            </div>

            <input
              placeholder="Naam"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
            />
            <textarea
              placeholder="Beschrijving (optioneel)"
              rows={3}
              value={form.desc}
              onChange={(e) => setForm({ ...form, desc: e.target.value })}
              style={{ resize: "none" }}
            />

            <label
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                padding: "12px",
                background: "var(--surface2)",
                borderRadius: 8,
                cursor: "pointer",
              }}
            >
              <span style={{ fontSize: 14 }}>Privé groep</span>
              <button
                type="button"
                onClick={() =>
                  setForm((f) => ({ ...f, isPrivate: !f.isPrivate }))
                }
                style={{
                  width: 44,
                  height: 24,
                  borderRadius: 12,
                  border: "none",
                  cursor: "pointer",
                  background: form.isPrivate
                    ? "var(--text)"
                    : "var(--surface2)",
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
                    background: form.isPrivate ? "var(--bg)" : "var(--muted)",
                    transition: "left 0.2s",
                    left: form.isPrivate ? 23 : 3,
                  }}
                />
              </button>
            </label>

            <button
              className="btn-primary"
              onClick={submit}
              disabled={submitting || !form.name.trim()}
            >
              {submitting ? "Aanmaken..." : "Aanmaken"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
