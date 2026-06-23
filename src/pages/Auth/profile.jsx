import { useEffect, useState, useRef } from "react";
import { Link } from "react-router-dom";
import { doc, getDoc, getDocs, updateDoc, query, where, collection } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { db, storage } from "../../firebase/config";
import { useAuth } from "../../context/authContext";
import  PostStemp  from "../posts/postStemp";

function Profile() {
  const { currentUser } = useAuth();

  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);

  const [editing, setEditing] = useState(false);
  const [editUsername, setEditUsername] = useState("");
  const [editBio, setEditBio] = useState("");
  const [photoFile, setPhotoFile] = useState(null);
  const [photoPreview, setPhotoPreview] = useState(null);
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState("");
  const [editPrivate, setEditPrivate] = useState(false);

  const [posts, setPosts] = useState([]);

  const fileInputRef = useRef();

  useEffect(() => {
    async function fetchUser() {
      try {
        const userRef = doc(db, "users", currentUser.uid);
        const userSnap = await getDoc(userRef);
        if (userSnap.exists()) {
          setUserData(userSnap.data());
        }

        const postsQuery = query(
          collection(db, "posts"),
          where("userId", "==", currentUser.uid)
        );

        const postsSnap = await getDocs(postsQuery);

        const postsData = postsSnap.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));

    setPosts(postsData);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    }
    if (currentUser) fetchUser();
  }, [currentUser]);

  function openEdit() {
    setEditUsername(userData?.username ?? "");
    setEditBio(userData?.bio ?? "");
    // gebruik "private" als veldnaam — consistent met auth.js en Settings
    setEditPrivate(userData?.private ?? false);
    setPhotoFile(null);
    setPhotoPreview(null);
    setSaveError("");
    setEditing(true);
  }

  function handlePhotoChange(e) {
    const file = e.target.files[0];
    if (!file) return;
    setPhotoFile(file);
    setPhotoPreview(URL.createObjectURL(file));
  }

  async function handleSave() {
    if (!editUsername.trim()) {
      setSaveError("Gebruikersnaam mag niet leeg zijn");
      return;
    }

    setSaving(true);
    setSaveError("");

    try {
      const updates = {
        username: editUsername.trim(),
        bio: editBio.trim(),
        private: editPrivate,
      };

      if (photoFile) {
        const storageRef = ref(storage, `profilePictures/${currentUser.uid}`);
        await uploadBytes(storageRef, photoFile);
        updates.profilePicture = await getDownloadURL(storageRef);
      }

      await updateDoc(doc(db, "users", currentUser.uid), updates);
      setUserData((prev) => ({ ...prev, ...updates }));
      setEditing(false);
    } catch (err) {
      setSaveError("Opslaan mislukt, probeer opnieuw");
      console.error(err);
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        Profiel laden...
      </div>
    );
  }

  const avatarSrc = photoPreview ?? userData?.profilePicture;

  return (
    <div className="min-h-screen bg-black text-white p-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-zinc-900 rounded-2xl p-8 mb-8 flex flex-col md:flex-row gap-6 items-center md:items-start">
          {/* AVATAR */}
          <div className="relative w-32 h-32 rounded-full bg-zinc-800 overflow-hidden shrink-0">
            {avatarSrc ? (
              <img
                src={avatarSrc}
                alt="Profiel"
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-4xl">
                {userData?.username?.charAt(0).toUpperCase()}
              </div>
            )}
            {editing && (
              <button
                onClick={() => fileInputRef.current.click()}
                className="absolute inset-0 bg-black/60 flex items-center justify-center text-xs text-white"
              >
                Wijzigen
              </button>
            )}
          </div>

          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handlePhotoChange}
          />

          <div className="flex-1 w-full">
            {editing ? (
              <div className="flex flex-col gap-3">
                <input
                  type="text"
                  value={editUsername}
                  onChange={(e) => setEditUsername(e.target.value)}
                  placeholder="Gebruikersnaam"
                  className="bg-zinc-800 p-2 rounded-lg text-white w-full max-w-sm"
                />
                <textarea
                  value={editBio}
                  onChange={(e) => setEditBio(e.target.value)}
                  placeholder="Bio"
                  rows={3}
                  className="bg-zinc-800 p-2 rounded-lg text-white w-full max-w-sm resize-none"
                />

                <label className="flex items-center justify-between bg-zinc-800 p-3 rounded-lg max-w-sm cursor-pointer">
                  <span>Privé account</span>
                  <button
                    type="button"
                    onClick={() => setEditPrivate((v) => !v)}
                    className={`relative w-12 h-6 rounded-full transition-colors duration-200
                      ${editPrivate ? "bg-white" : "bg-zinc-600"}`}
                  >
                    <span
                      className={`absolute top-1 w-4 h-4 rounded-full transition-transform duration-200
                        ${editPrivate ? "translate-x-7 bg-black" : "translate-x-1 bg-white"}`}
                    />
                  </button>
                </label>

                {saveError && (
                  <p className="text-red-500 text-sm">{saveError}</p>
                )}

                <div className="flex gap-3">
                  <button
                    onClick={handleSave}
                    disabled={saving}
                    className="bg-white text-black px-4 py-2 rounded-lg font-semibold disabled:opacity-50"
                  >
                    {saving ? "Opslaan..." : "Opslaan"}
                  </button>
                  <button
                    onClick={() => setEditing(false)}
                    className="bg-zinc-700 text-white px-4 py-2 rounded-lg"
                  >
                    Annuleren
                  </button>
                </div>
              </div>
            ) : (
              <>
                <div className="flex items-center gap-3 flex-wrap mb-4">
                  <h1 className="text-4xl font-bold">{userData?.username}</h1>
                  {userData?.private && (
                    <span className="text-xs bg-zinc-800 px-2 py-1 rounded-full text-zinc-400">
                      Privé
                    </span>
                  )}
                  <button
                    onClick={openEdit}
                    className="bg-white text-black px-4 py-2 rounded-lg font-semibold"
                  >
                    Profiel bewerken
                  </button>
                  <Link
                    to="/settings"
                    className="bg-zinc-700 px-4 py-2 rounded-lg text-sm"
                  >
                    Instellingen
                  </Link>
                </div>

                <p className="text-zinc-400 mb-4">
                  {userData?.bio || "Nog geen biografie."}
                </p>

                <div className="flex gap-8">
                  <div>
                    <p className="text-2xl font-bold">
                      {userData?.upvotes || 0}
                    </p>
                    <p className="text-zinc-400 text-sm">Upvotes</p>
                  </div>
                  <div>
                    <p className="text-2xl font-bold">
                      {userData?.friends?.length || 0}
                    </p>
                    <p className="text-zinc-400 text-sm">Vrienden</p>
                  </div>
                  <div>
                    <p className="text-2xl font-bold">
                      {userData?.graveRobberyPoints || 0}
                    </p>
                    <p className="text-zinc-400 text-sm">
                      Grave Robbery Points
                    </p>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>

        <div>
          <PostStemp userId={currentUser.uid} />
        </div>
      </div>
    </div>
  );
}

export default Profile;
