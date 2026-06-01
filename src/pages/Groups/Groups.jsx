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
  const [error, setError] = useState("");

  const [modal, setModal] = useState(false);
  const [form, setForm] = useState({ name: "", desc: "", isPrivate: false });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    load();
  }, []);

  async function load() {
    setLoading(true);
    setError("");
    try {
      const data = await getAllGroups();
      setItems(data);
    } catch (err) {
      setError("Groepen laden mislukt");
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  async function submit() {
    if (!form.name.trim()) return;

    setSubmitting(true);
    try {
      await createGroup(currentUser.uid, form.name, form.desc, form.isPrivate);
      setModal(false);
      setForm({ name: "", desc: "", isPrivate: false });
      load();
    } catch (err) {
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="max-w-3xl mx-auto p-6 text-white">
      <div className="flex justify-between mb-6">
        <h1 className="text-4xl font-bold">Groepen</h1>

        {currentUser && (
          <button
            onClick={() => setModal(true)}
            className="bg-white text-black px-4 py-2 rounded-xl font-semibold"
          >
            + Nieuw
          </button>
        )}
      </div>

      {loading && <p className="text-zinc-500">Laden...</p>}
      {error && <p className="text-red-500">{error}</p>}

      {!loading && !error && items.length === 0 && (
        <p className="text-zinc-500">Nog geen groepen.</p>
      )}

      <div className="space-y-3">
        {items.map((g) => (
          <Link
            key={g.id}
            to={`/group/${g.id}`}
            className="block bg-zinc-900 p-4 rounded-xl hover:bg-zinc-800 transition"
          >
            <div className="flex justify-between items-center">
              <div>
                <p className="font-semibold">{g.name}</p>
                {g.description && (
                  <p className="text-zinc-400 text-sm mt-1">{g.description}</p>
                )}
              </div>
              <span className="text-zinc-500 text-sm">
                {g.members?.length ?? 0} leden
              </span>
            </div>
          </Link>
        ))}
      </div>

      {modal && (
        <div
          className="fixed inset-0 bg-black/80 flex items-center justify-center z-50"
          onClick={() => setModal(false)}
        >
          <div
            className="bg-zinc-900 p-6 rounded-xl w-full max-w-sm flex flex-col gap-3"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="text-xl font-bold">Nieuwe groep</h2>

            <input
              className="w-full p-2 bg-zinc-800 rounded"
              placeholder="Naam"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
            />

            <textarea
              className="w-full p-2 bg-zinc-800 rounded resize-none"
              placeholder="Beschrijving"
              rows={3}
              value={form.desc}
              onChange={(e) => setForm({ ...form, desc: e.target.value })}
            />

            <label className="flex items-center gap-2 text-sm text-zinc-300 cursor-pointer">
              <input
                type="checkbox"
                checked={form.isPrivate}
                onChange={(e) =>
                  setForm({ ...form, isPrivate: e.target.checked })
                }
              />
              Privé groep
            </label>

            <div className="flex gap-3 mt-1">
              <button
                onClick={submit}
                disabled={submitting || !form.name.trim()}
                className="flex-1 bg-white text-black py-2 rounded font-semibold disabled:opacity-50"
              >
                {submitting ? "Maken..." : "Maken"}
              </button>
              <button
                onClick={() => setModal(false)}
                className="flex-1 bg-zinc-700 text-white py-2 rounded"
              >
                Annuleren
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
