import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getAllGroups, createGroup } from "../../firebase/groups/groups.service";
import { useAuth } from "../../context/AuthContext";

export default function Groups() {
  const { currentUser } = useAuth();

  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  const [modal, setModal] = useState(false);
  const [form, setForm] = useState({
    name: "",
    desc: "",
    isPrivate: false,
  });

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

    await createGroup(currentUser.uid, form.name, form.desc, form.isPrivate);

    setModal(false);
    setForm({ name: "", desc: "", isPrivate: false });
    load();
  }

  return (
    <div className="max-w-3xl mx-auto p-6 text-white">
      <div className="flex justify-between mb-6">
        <h1 className="text-4xl font-bold">Groepen</h1>

        {currentUser && (
          <button
            onClick={() => setModal(true)}
            className="bg-white text-black px-4 py-2 rounded-xl"
          >
            + nieuw
          </button>
        )}
      </div>

      {loading ? (
        <p className="text-zinc-500">laden...</p>
      ) : (
        <div className="space-y-3">
          {items.map((g) => (
            <Link
              key={g.id}
              to={`/group/${g.id}`}
              className="block bg-zinc-900 p-4 rounded-xl"
            >
              <div className="flex justify-between">
                <div>
                  <p className="font-semibold">{g.name}</p>
                  <p className="text-zinc-400 text-sm">{g.description}</p>
                </div>
                <span className="text-zinc-500 text-sm">
                  {g.members?.length ?? 0}
                </span>
              </div>
            </Link>
          ))}
        </div>
      )}

      {modal && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center">
          <div className="bg-zinc-900 p-6 rounded-xl w-96">
            <input
              className="w-full p-2 bg-zinc-800 mb-2"
              placeholder="naam"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
            />

            <textarea
              className="w-full p-2 bg-zinc-800 mb-2"
              placeholder="desc"
              value={form.desc}
              onChange={(e) => setForm({ ...form, desc: e.target.value })}
            />

            <button
              onClick={submit}
              className="w-full bg-white text-black py-2 rounded"
            >
              maken
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
