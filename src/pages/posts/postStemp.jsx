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
  orderBy,
  getDoc,
  increment
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
  // de "normale" likes 
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

  // grafrovertje spelen 
  const handleGraveRobbery = async (post) => {
    if (!currentUser) return;
    if (post.userId === currentUser.uid) {
    alert("Je kunt geen likes van je eigen post stelen.");
    return;
}

    if (!currentUser) return;

    const userRef = doc(db, "users", currentUser.uid);
    const userSnap = await getDoc(userRef);


    if (!userSnap.exists()) return;
    const userData = userSnap.data();
    const robbedPosts = userData.robbedPosts || [];
    const likes = post.likes?.length || 0;

    if (robbedPosts.includes(post.id)) {
    alert("Je hebt deze post al geplunderd.");
    return;
    }

    await updateDoc(userRef, {
    graveRobberyPoints: increment(likes),
    robbedPosts: arrayUnion(post.id)
    });
    

    alert(`${likes} Grave Robbery Points verdiend!`);
  };


  if (loading) return <p>Posts laden...</p>;

  return (
  <div
    style={{
      maxWidth: 720,
      margin: "0 auto",
      padding: "24px 16px",
    }}
  >
    {!userId && (
      <h1
        className="font-display"
        style={{
          fontSize: 24,
          marginBottom: 20,
        }}
      >
        Recente posts
      </h1>
    )}

    {posts.map((post) => {
      const hasLiked = post.likes?.includes(auth.currentUser?.uid);
      const canEdit = currentUser?.uid === post.userId;

      return (
        <div
          key={post.id}
          style={{
            background: "var(--surface)",
            border: "1px solid var(--border)",
            borderRadius: 12,
            padding: 16,
            marginBottom: 16,
          }}
        >
          <h2 className="font-bold">
            <p>Naam begraafplaats:</p>
            <p>{post.cemeteryId}</p>
          </h2>

          <p>Beschrijving:</p>
          <p>{post.description}</p>

          <div
            style={{
              marginTop: 12,
              marginBottom: 12,
            }}
          >
            <p>Omgeving: {post.ratings.environment}/5</p>
            <p>Rust: {post.ratings.peace}/5</p>
            <p>Architectuur: {post.ratings.architecture}/5</p>
            <p>Uniekheid: {post.ratings.uniqueness}/5</p>
          </div>

          <div style={{ marginBottom: 12 }}>
            <button className="btn-ghost">
              Gemiddelde:{" "}
              {(
                (post.ratings?.environment ?? 0) +
                (post.ratings?.peace ?? 0) +
                (post.ratings?.architecture ?? 0) +
                (post.ratings?.uniqueness ?? 0)
              ) / 4}
              /5
            </button>
          </div>

          <p
            style={{
              color: "var(--muted)",
              fontSize: 13,
              marginBottom: 12,
            }}
          >
            Likes: {post.likes?.length || 0}
          </p>

          <div
            style={{
              display: "flex",
              gap: 8,
              flexWrap: "wrap",
              marginBottom: canEdit ? 12 : 0,
            }}
          >
            <button
              className="btn-primary"
              onClick={() => handleLike(post.id)}
            >
              {hasLiked ? "Like verwijderen" : "Like geven"}
            </button>

            <button
              className="btn-ghost"
              onClick={() => handleGraveRobbery(post)}
            >
              Likes stelen
            </button>

            <button className="btn-ghost">Comments</button>

            <button className="btn-ghost">Flag post</button>
          </div>

          {canEdit && (
            <Link
              to={`/posts/edit/${post.id}`}
              className="text-sm"
              style={{
                color: "var(--accent)",
              }}
            >
              Bewerken
            </Link>
          )}
        </div>
      );
    })}
  </div>
);
}