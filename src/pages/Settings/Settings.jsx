import { useState } from "react";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "../../firebase/config";
import { useAuth } from "../../context/authContext";

const BLOCK_REASONS = [
  "Spam",
  "Ongepaste inhoud",
  "Intimidatie",
  "Nep account",
  "Anders",
];

export default function Settings({ userData, onUpdate }) {
  const { currentUser } = useAuth();

  const [isPrivate, setIsPrivate] = useState(userData?.private ?? false);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  async function savePrivacy(value) {
    setIsPrivate(value);
    setSaving(true);
    setSaved(false);
    await updateDoc(doc(db, "users", currentUser.uid), { private: value });
    setSaving(false);
    setSaved(true);
    onUpdate?.({ private: value });
    setTimeout(() => setSaved(false), 2000);
  }

  return (
    <div className="max-w-2xl mx-auto p-6 text-white">
      <h1 className="text-3xl font-bold mb-8">Instellingen</h1>

      <section className="bg-zinc-900 rounded-2xl p-6 mb-6">
        <h2 className="text-xl font-semibold mb-4">Privacy</h2>

        <div className="flex items-center justify-between">
          <div>
            <p className="font-medium">Privé profiel</p>
            <p className="text-zinc-400 text-sm mt-1">
              Alleen vrienden kunnen je posts zien
            </p>
          </div>

          <button
            onClick={() => savePrivacy(!isPrivate)}
            disabled={saving}
            className={`relative w-12 h-6 rounded-full transition-colors duration-200 focus:outline-none
              ${isPrivate ? "bg-white" : "bg-zinc-600"}`}
          >
            <span
              className={`absolute top-1 w-4 h-4 rounded-full transition-transform duration-200
                ${isPrivate ? "translate-x-7 bg-black" : "translate-x-1 bg-white"}`}
            />
          </button>
        </div>

        {saved && <p className="text-green-400 text-sm mt-3">Opgeslagen</p>}
      </section>

      <section className="bg-zinc-900 rounded-2xl p-6">
        <h2 className="text-xl font-semibold mb-2">Geblokkeerde gebruikers</h2>
        <p className="text-zinc-400 text-sm mb-4">
          Je kunt gebruikers deblokkeren via hun profielpagina.
        </p>

        {!userData?.blockedUsers?.length ? (
          <p className="text-zinc-500 text-sm">Geen geblokkeerde gebruikers.</p>
        ) : (
          <ul className="space-y-2">
            {userData.blockedUsers.map((uid) => (
              <li
                key={uid}
                className="text-zinc-400 text-sm bg-zinc-800 px-3 py-2 rounded-lg"
              >
                {uid}
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
