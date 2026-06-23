import { useState, useCallback } from "react";
import {
  searchUsers,
  searchPosts,
  searchGroups,
  searchCemeteries,
} from "../../firebase/search/search.service";
import ResultUsers from "../../components/ResultUsers";
import ResultPosts from "../../components/ResultPosts";
import ResultGroups from "../../components/ResultGroups";
import ResultCemeteries from "../../components/ResultCemeteries";
import { sortPosts, sortCemeteries } from "../../utils/searchUtils";

const TABS = [
  { key: "users", label: "Mensen" },
  { key: "posts", label: "Posts" },
  { key: "groups", label: "Groepen" },
  { key: "cemeteries", label: "Begraafplaatsen" },
];

export default function Search() {
  const [q, setQ] = useState("");
  const [tab, setTab] = useState("users");
  const [sort, setSort] = useState("recent");
  const [data, setData] = useState({
    users: [],
    posts: [],
    groups: [],
    cemeteries: [],
  });
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);

  const runSearch = useCallback(async () => {
    if (!q.trim()) return;
    setLoading(true);
    setDone(true);
    const [users, posts, groups, cemeteries] = await Promise.all([
      searchUsers(q),
      searchPosts(q),
      searchGroups(q),
      searchCemeteries(q),
    ]);
    setData({
      users,
      posts: sortPosts(posts, sort),
      groups,
      cemeteries: sortCemeteries(cemeteries, sort),
    });
    setLoading(false);
  }, [q, sort]);

  const counts = {
    users: data.users.length,
    posts: data.posts.length,
    groups: data.groups.length,
    cemeteries: data.cemeteries.length,
  };

  function renderResults() {
    switch (tab) {
      case "users":
        return <ResultUsers users={data.users} />;
      case "posts":
        return <ResultPosts posts={data.posts} />;
      case "groups":
        return <ResultGroups groups={data.groups} />;
      case "cemeteries":
        return <ResultCemeteries cemeteries={data.cemeteries} />;
      default:
        return null;
    }
  }

  return (
    <div>
      <div
        style={{
          padding: "12px 16px",
          borderBottom: "1px solid var(--border)",
          position: "sticky",
          top: 52,
          background: "rgba(10,10,10,0.95)",
          backdropFilter: "blur(12px)",
          zIndex: 10,
        }}
      >
        <div style={{ display: "flex", gap: 8 }}>
          <div style={{ flex: 1, position: "relative" }}>
            <span
              style={{
                position: "absolute",
                left: 12,
                top: "50%",
                transform: "translateY(-50%)",
                color: "var(--muted)",
                pointerEvents: "none",
              }}
            >
              {/* hier moet nog icon komen */}
            </span>
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && runSearch()}
              placeholder="Zoek mensen, posts, groepen..."
              style={{ paddingLeft: 36 }}
            />
          </div>
          <button
            className="btn-primary"
            onClick={runSearch}
            style={{ whiteSpace: "nowrap", padding: "10px 16px" }}
          >
            Zoek
          </button>
        </div>
      </div>

      <div
        className="tabs"
        style={{
          position: "sticky",
          top: 104,
          background: "var(--bg)",
          zIndex: 9,
        }}
      >
        {TABS.map((t) => (
          <button
            key={t.key}
            className={`tab ${tab === t.key ? "active" : ""}`}
            onClick={() => setTab(t.key)}
          >
            {t.label}
            {done && counts[t.key] > 0 && (
              <span
                style={{ marginLeft: 4, fontSize: 10, color: "var(--accent)" }}
              >
                {counts[t.key]}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Sorteer (posts & begraafplaatsen) */}
      {(tab === "posts" || tab === "cemeteries") && done && (
        <div
          style={{
            display: "flex",
            gap: 8,
            padding: "10px 16px",
            borderBottom: "1px solid var(--border)",
          }}
        >
          {["recent", "popular", "rating"].map((s) => (
            <button
              key={s}
              onClick={() => setSort(s)}
              style={{
                padding: "4px 12px",
                borderRadius: 20,
                fontSize: 12,
                cursor: "pointer",
                background: sort === s ? "var(--text)" : "var(--surface2)",
                color: sort === s ? "var(--bg)" : "var(--muted)",
                border: "1px solid var(--border)",
                transition: "all 0.15s",
              }}
            >
              {s}
            </button>
          ))}
        </div>
      )}

      <div style={{ padding: "8px 0" }}>
        {loading && (
          <p
            style={{
              textAlign: "center",
              color: "var(--muted)",
              padding: 32,
              fontSize: 13,
            }}
          >
            Zoeken...
          </p>
        )}
        {!loading && done && counts[tab] === 0 && (
          <p
            style={{
              textAlign: "center",
              color: "var(--muted)",
              padding: 32,
              fontSize: 13,
            }}
          >
            Geen resultaten voor "{q}"
          </p>
        )}
        {!loading && renderResults()}
      </div>
    </div>
  );
}
