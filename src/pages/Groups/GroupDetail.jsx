import { useEffect, useState, useMemo } from "react";
import { useParams, Link } from "react-router-dom";
import {
  getGroup,
  joinGroup,
  leaveGroup,
} from "../../firebase/groups/groups.service";
import { getGroupPosts } from "../../firebase/posts/posts.service";
import { useAuth } from "../../context/authContext";
import StarRating from "../../components/StarRating";
import { calculateAverageRating } from "../../utils/rating";
import { ArrowLeft, Lock, Heart, MessageCircle } from "lucide-react";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { db } from "../../firebase/config";

function PostCard({ post }) {
  const avg = useMemo(
    () => calculateAverageRating(post.ratings),
    [post.ratings],
  );

  return (
    <div className="bg-zinc-900 rounded-2xl p-5">
      {post.mediaType === "image" && post.mediaUrl && (
        <img
          src={post.mediaUrl}
          alt=""
          className="w-full max-h-64 object-cover rounded-xl mb-4"
        />
      )}

      <p className="mb-3">{post.description}</p>

      <div className="flex gap-4 text-sm text-zinc-400 items-center flex-wrap">
        <span className="flex items-center gap-1">
          <Heart size={14} /> {post.likes?.length ?? 0}
        </span>
        <span className="flex items-center gap-1">
          <MessageCircle size={14} /> {post.commentsCount ?? 0}
        </span>

        {post.ratings && (
          <div className="flex items-center gap-2">
            <StarRating value={avg} />
            <span>{avg.toFixed(1)}</span>
          </div>
        )}
      </div>
    </div>
  );
}

function NewPostForm({ groupId, currentUser, onPosted }) {
  const [description, setDescription] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();
    if (!description.trim()) return;

    setSubmitting(true);
    setError("");
    try {
      await addDoc(collection(db, "posts"), {
        groupId,
        authorId: currentUser.uid,
        description: description.trim(),
        likes: [],
        commentsCount: 0,
        ratings: {},
        createdAt: serverTimestamp(),
      });
      setDescription("");
      onPosted();
    } catch (err) {
      setError("Post plaatsen mislukt");
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-zinc-900 rounded-2xl p-5 flex flex-col gap-3"
    >
      <h3 className="font-semibold">Nieuwe post</h3>
      <textarea
        className="bg-zinc-800 rounded-lg p-3 resize-none text-white w-full"
        placeholder="Schrijf iets..."
        rows={3}
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      />
      {error && <p className="text-red-500 text-sm">{error}</p>}
      <button
        type="submit"
        disabled={submitting || !description.trim()}
        className="bg-white text-black px-4 py-2 rounded-lg font-semibold self-end disabled:opacity-50"
      >
        {submitting ? "Plaatsen..." : "Plaatsen"}
      </button>
    </form>
  );
}

export default function GroupDetail() {
  const { id } = useParams();
  const { currentUser } = useAuth();

  const [group, setGroup] = useState(null);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);

  const isMember = group?.members?.includes(currentUser?.uid);
  const isOwner = group?.ownerId === currentUser?.uid;

  async function loadData() {
    setLoading(true);
    const [g, p] = await Promise.all([getGroup(id), getGroupPosts(id)]);
    setGroup(g);
    setPosts(p);
    setLoading(false);
  }

  useEffect(() => {
    loadData();
  }, [id]);

  async function toggleMembership() {
    if (!currentUser) return;
    setBusy(true);
    try {
      if (isMember) {
        await leaveGroup(id, currentUser.uid);
      } else {
        await joinGroup(id, currentUser.uid);
      }
      const updated = await getGroup(id);
      setGroup(updated);
    } finally {
      setBusy(false);
    }
  }

  async function refreshPosts() {
    const p = await getGroupPosts(id);
    setPosts(p);
  }

  const canSeePosts = !group?.private || isMember;

  if (loading) {
    return <div className="text-white p-6">Laden...</div>;
  }

  if (!group) {
    return (
      <div className="text-white p-6">
        Groep niet gevonden.{" "}
        <Link to="/groups" className="underline">
          Terug
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto p-6 text-white">
      <Link
        to="/groups"
        className="text-zinc-500 text-sm flex items-center gap-1 mb-4"
      >
        <ArrowLeft size={14} /> Terug naar groepen
      </Link>

      <div className="bg-zinc-900 p-6 rounded-2xl">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-bold">{group.name}</h1>
            {group.description && (
              <p className="text-zinc-400 mt-1">{group.description}</p>
            )}
            <p className="text-zinc-500 text-sm mt-2">
              {group.members?.length ?? 0} leden
              {group.private && (
                <span className="ml-2 inline-flex items-center gap-1">
                  <Lock size={12} /> Privé
                </span>
              )}
            </p>
          </div>

          {currentUser && !isOwner && (
            <button
              disabled={busy}
              onClick={toggleMembership}
              className="px-4 py-2 rounded-xl bg-white text-black font-semibold disabled:opacity-50"
            >
              {isMember ? "Verlaten" : "Joinen"}
            </button>
          )}

          {isOwner && (
            <span className="text-xs bg-zinc-800 px-3 py-1 rounded-full">
              eigenaar
            </span>
          )}
        </div>
      </div>

      {group.private && !isMember && (
        <div className="mt-6 bg-zinc-900 p-6 rounded-2xl text-center">
          <p className="flex items-center justify-center gap-2">
            <Lock size={16} /> Privé groep
          </p>
          <p className="text-zinc-400 text-sm mt-1">
            Word lid om de posts te zien
          </p>
        </div>
      )}

      {canSeePosts && (
        <div className="mt-6 space-y-4">
          {isMember && (
            <NewPostForm
              groupId={id}
              currentUser={currentUser}
              onPosted={refreshPosts}
            />
          )}

          {posts.length === 0 ? (
            <p className="text-zinc-500 text-center py-8">
              Nog geen posts in deze groep.
            </p>
          ) : (
            posts.map((p) => <PostCard key={p.id} post={p} />)
          )}
        </div>
      )}
    </div>
  );
}
