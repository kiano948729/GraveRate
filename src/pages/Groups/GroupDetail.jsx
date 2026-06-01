import { useEffect, useState, useMemo } from "react";
import { useParams, Link } from "react-router-dom";
import {
  getGroup,
  joinGroup,
  leaveGroup,
} from "../../firebase/groups/groups.service";
import { getGroupPosts } from "../../firebase/posts/posts.service";
import { useAuth } from "../../context/AuthContext";
import StarRating from "../../components/StarRating";
import { calculateAverageRating } from "../../utils/rating";
import {
  Search,
  Users,
  User,
  Lock,
  Globe,
  Plus,
  Heart,
  MessageCircle,
  Star,
  MapPin,
  Crown,
  ArrowLeft,
  Filter,
} from "lucide-react";
function PostCard({ post }) {
  const avg = useMemo(() => calculateAverageRating(post.ratings), [post.ratings]);

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

      <div className="flex gap-4 text-sm text-zinc-400">
        <span><Heart className="text-sm" /> {post.likes?.length ?? 0}</span>
        <span><MessageCircle className="text-sm" /> {post.commentsCount ?? 0}</span>

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

export default function GroupDetail() {
  const { id } = useParams();
  const { currentUser } = useAuth();

  const [group, setGroup] = useState(null);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);

  const isMember = group?.members?.includes(currentUser?.uid);
  const isOwner = group?.ownerId === currentUser?.uid;

  useEffect(() => {
    async function loadData() {
      setLoading(true);

      const [g, p] = await Promise.all([
        getGroup(id),
        getGroupPosts(id),
      ]);

      setGroup(g);
      setPosts(p);
      setLoading(false);
    }

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

  const canSeePosts = !group?.private || isMember;

  if (loading) {
    return <div className="text-white p-6">Laden...</div>;
  }

  if (!group) {
    return (
      <div className="text-white p-6">
        Groep niet gevonden <Link to="/groups">terug</Link>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto p-6 text-white">
      <Link to="/groups" className="text-zinc-500 text-sm">
        <ArrowLeft className="inline mr-2" /> terug
      </Link>

      <div className="bg-zinc-900 p-6 rounded-2xl mt-4">
        <div className="flex justify-between">
          <div>
            <h1 className="text-3xl font-bold">{group.name}</h1>
            <p className="text-zinc-400">{group.description}</p>
            <p className="text-zinc-500 text-sm mt-2">
              {group.members?.length ?? 0} leden
            </p>
          </div>

          {currentUser && !isOwner && (
            <button
              disabled={busy}
              onClick={toggleMembership}
              className="px-4 py-2 rounded-xl bg-white text-black"
            >
              {isMember ? "Verlaten" : "Joinen"}
            </button>
          )}

          {isOwner && (
            <span className="text-xs bg-zinc-800 px-3 py-1 rounded-full">
              owner
            </span>
          )}
        </div>
      </div>

      {group.private && !isMember && (
        <div className="mt-6 bg-zinc-900 p-6 rounded-2xl text-center">
          <p><Lock className="text-sm" /> privé groep</p>
          <p className="text-zinc-400 text-sm">
            Je moet lid zijn om content te zien
          </p>
        </div>
      )}

      {canSeePosts && (
        <div className="mt-6 space-y-4">
          {posts.map((p) => (
            <PostCard key={p.id} post={p} />
          ))}
        </div>
      )}
    </div>
  );
}