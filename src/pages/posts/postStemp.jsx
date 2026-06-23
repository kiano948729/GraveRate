import { useEffect, useState } from "react";
import {
  collection,
  getDocs,
  doc,
  updateDoc,
  arrayUnion,
  arrayRemove,
  query,
  where,
  orderBy
} from "firebase/firestore";
import { db, auth } from "../../firebase/config";
import { Link } from "react-router-dom";
import { useAuth } from "../../context/authContext";

export default function PostStemp({ userId = null}) {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const { currentUser } = useAuth();

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const postsRef = collection(db, "posts");

        const q = userId
          ? query(
              postsRef,
              where("userId", "==", userId),
              orderBy("createdAt", "desc")
            )
          : query(postsRef, orderBy("createdAt", "desc"));

        const querySnapshot = await getDocs(q);

        const postsData = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data()
        }));

        setPosts(postsData);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, [userId]);

  const handleLike = async (postId) => {
    const user = auth.currentUser;

    if (!user) {
      alert("Log eerst in");
      return;
    }

    const post = posts.find((p) => p.id === postId);
    if (!post) return;

    const hasLiked = post.likes?.includes(user.uid);

    try {
      const postRef = doc(db, "posts", postId);

      if (hasLiked) {
        await updateDoc(postRef, {
          likes: arrayRemove(user.uid)
        });
      } else {
        await updateDoc(postRef, {
          likes: arrayUnion(user.uid)
        });
      }

      setPosts((prev) =>
        prev.map((p) => {
          if (p.id !== postId) return p;

          return {
            ...p,
            likes: hasLiked
              ? p.likes.filter((uid) => uid !== user.uid)
              : [...(p.likes || []), user.uid]
          };
        })
      );
    } catch (error) {
      console.error("Fout bij liken:", error);
    }
  };

  if (loading) return <p>Posts laden...</p>;

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Posts</h1>

      {posts.map((post) => {
        const hasLiked = post.likes?.includes(auth.currentUser?.uid);

        const canEdit = currentUser?.uid === post.userId;
        return (
          <div key={post.id} className="bg-zinc-900 p-4 rounded-lg mb-4">
            <h2 className="font-bold">
              <p>naam begraafplaats:</p>
              <p>{post.cemeteryId}</p>
            </h2>

            <p>beschrijving:</p>
            <p>{post.description}</p>

            <div className="mt-2">
              <p>Omgeving: {post.ratings.environment}/5</p>
              <p>Rust: {post.ratings.peace}/5</p>
              <p>Architectuur: {post.ratings.architecture}/5</p>
              <p>Uniekheid: {post.ratings.uniqueness}/5</p>
            </div>

            <div className="posts-AverageRating">
              <button>
                Gemiddelde:{" "}
                {(
                  (post.ratings?.environment ?? 0) +
                  (post.ratings?.peace ?? 0) +
                  (post.ratings?.architecture ?? 0) +
                  (post.ratings?.uniqueness ?? 0)
                ) / 4
                .toFixed(2)}/5
              </button>
            </div>

            <p className="text-sm text-gray-400 mt-2">
              Likes: {post.likes?.length || 0}
            </p>

            <div className="posts-Ratings">
              <button onClick={() => handleLike(post.id)}>
                {hasLiked ? "like verwijderen" : "Like geven"}
              </button>

              <button>likes stelen</button>
              <button>comments</button>
              <button>flag post</button>
            </div>
                
            {/* edit voor eigen posts. */}
            {canEdit && (
              <Link
                 to={`/posts/edit/${post.id}`}
                className="text-sm text-blue-400 mt-2 inline-block"
              >
                Bewerken
              </Link>
            )}

            <div className="posts-Divider"></div>
          </div>
        );
      })}
    </div>
  );
}