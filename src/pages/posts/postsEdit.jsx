import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  doc,
  getDoc,
  updateDoc
} from "firebase/firestore";
import { db } from "../../firebase/config";
import { useAuth } from "../../context/authContext";

export default function PostsEdit() {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const { postId } = useParams();

  const [cemeteryId, setcemeteryId] = useState("");
  const [description, setDescription] = useState("");
  const [environment, setEnvironment] = useState(1);
  const [peace, setPeace] = useState(1);
  const [architecture, setArchitecture] = useState(1);
  const [uniqueness, setUniqueness] = useState(1);

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  // 🔒 check login
  useEffect(() => {
    if (!currentUser) {
      navigate("/login");
    }
  }, [currentUser, navigate]);

  // 📥 fetch bestaande post
  useEffect(() => {
    const fetchPost = async () => {
      try {
        const ref = doc(db, "posts", postId);
        const snap = await getDoc(ref);

        if (!snap.exists()) {
          navigate("/");
          return;
        }

        const data = snap.data();

        // 🔒 ownership check
        if (data.userId !== currentUser.uid) {
          navigate("/");
          return;
        }

        setcemeteryId(data.cemeteryId);
        setDescription(data.description);
        setEnvironment(data.ratings.environment);
        setPeace(data.ratings.peace);
        setArchitecture(data.ratings.architecture);
        setUniqueness(data.ratings.uniqueness);

      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (currentUser) fetchPost();
  }, [postId, currentUser]);

  // 💾 update post
  const updatePost = async (e) => {
    e.preventDefault();

    try {
      const ref = doc(db, "posts", postId);

      await updateDoc(ref, {
        cemeteryId,
        description,
        ratings: {
          environment,
          peace,
          architecture,
          uniqueness,
        },
      });

      navigate("/posts");
    } catch (err) {
      setError(err.message);
    }
  };

  if (loading) return <p>laden...</p>;

  return (
    <form
      onSubmit={updatePost}
      className="bg-zinc-900 p-8 rounded-xl w-full max-w-md flex flex-col gap-4"
    >
      <h1 className="text-3xl font-bold">Post bewerken</h1>

      {error && <p className="text-red-500">{error}</p>}

      <input
        type="text"
        value={cemeteryId}
        onChange={(e) => setcemeteryId(e.target.value)}
        className="p-3 rounded bg-zinc-800"
      />

      <input
        type="text"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        className="p-3 rounded bg-zinc-800"
      />

      <p>environment</p>
      <input
        type="number"
        min="1"
        max="5"
        value={environment}
        onChange={(e) => setEnvironment(Number(e.target.value))}
      />

      <p>peace</p>
      <input
        type="number"
        min="1"
        max="5"
        value={peace}
        onChange={(e) => setPeace(Number(e.target.value))}
      />

      <p>architecture</p>
      <input
        type="number"
        min="1"
        max="5"
        value={architecture}
        onChange={(e) => setArchitecture(Number(e.target.value))}
      />

      <p>uniqueness</p>
      <input
        type="number"
        min="1"
        max="5"
        value={uniqueness}
        onChange={(e) => setUniqueness(Number(e.target.value))}
      />

      <button
        type="submit"
        className="bg-white text-black p-3 rounded font-semibold"
      >
        opslaan
      </button>
    </form>
  );
}