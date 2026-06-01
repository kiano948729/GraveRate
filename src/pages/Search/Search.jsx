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

const TABS = ["users", "posts", "groups", "cemeteries"];

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

  const renderResults = () => {
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
  };

  return (
    <div className="max-w-3xl mx-auto p-6 text-white">
      <h1 className="text-4xl font-bold mb-6">Zoeken</h1>

      <div className="flex gap-2 mb-4">
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && runSearch()}
          className="flex-1 bg-zinc-900 p-3 rounded-xl"
          placeholder="zoek..."
        />

        <button
          onClick={runSearch}
          className="bg-white text-black px-4 rounded-xl"
        >
          zoek
        </button>
      </div>

      <div className="flex gap-2 mb-4">
        {TABS.map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`px-3 py-1 rounded-lg ${
              tab === t ? "bg-white text-black" : "bg-zinc-800 text-white"
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      {(tab === "posts" || tab === "cemeteries") && (
        <div className="flex gap-2 mb-4">
          {["recent", "popular", "rating"].map((s) => (
            <button
              key={s}
              onClick={() => setSort(s)}
              className={`px-3 py-1 rounded-full border ${
                sort === s ? "border-white" : "border-zinc-700"
              }`}
            >
              {s}
            </button>
          ))}
        </div>
      )}

      {loading ? <p className="text-zinc-500">zoeken...</p> : renderResults()}
    </div>
  );
}
