import { useEffect, useState, useMemo } from "react";
import { useParams, Link } from "react-router-dom";
import {
  getGroup,
  joinGroup,
  leaveGroup,
} from "../../firebase/groups/groups.service";
import { getGroupPosts } from "../../firebase/posts/posts.service";
import { useAuth } from "../../context/authContext";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { db } from "../../firebase/config";

function PostCard({ post }) {
  return (
    <div
      style={{ borderBottom: "1px solid var(--border)", padding: "14px 16px" }}
    >
      <div
        style={{
          display: "flex",
          gap: 10,
          alignItems: "center",
          marginBottom: 10,
        }}
      >
        <div className="avatar" style={{ width: 32, height: 32, fontSize: 13 }}>
          {post.authorId?.charAt(0).toUpperCase() ?? "?"}
        </div>
        <div>
          <p style={{ fontSize: 13, fontWeight: 500 }}>{post.authorId}</p>
          <p style={{ fontSize: 11, color: "var(--muted)" }}>
            {post.createdAt?.toDate?.()?.toLocaleDateString("nl-NL") ?? ""}
          </p>
        </div>
      </div>

      {post.mediaUrl && post.mediaType === "image" && (
        <img
          src={post.mediaUrl}
          alt=""
          style={{
            width: "100%",
            borderRadius: 8,
            marginBottom: 10,
            maxHeight: 300,
            objectFit: "cover",
          }}
        />
      )}

      <p style={{ fontSize: 13, marginBottom: 10 }}>{post.description}</p>

      <div
        style={{
          display: "flex",
          gap: 16,
          color: "var(--muted)",
          fontSize: 12,
        }}
      >
        <span>
          {/* hart icon moet nog komen */}
          {post.likes?.length ?? 0}
        </span>
        <span>
          {/* chat icon moet nog komen */}
          {post.commentsCount ?? 0}
        </span>
      </div>
    </div>
  );
}

function NewPostForm({ groupId, currentUser, onPosted }) {
  const [text, setText] = useState("");
  const [busy, setBusy] = useState(false);

  async function submit() {
    if (!text.trim()) return;
    setBusy(true);
    await addDoc(collection(db, "posts"), {
      groupId,
      authorId: currentUser.uid,
      description: text.trim(),
      likes: [],
      commentsCount: 0,
      ratings: {},
      createdAt: serverTimestamp(),
    });
    setText("");
    onPosted();
    setBusy(false);
  }

  return (
    <div
      style={{
        padding: "12px 16px",
        borderBottom: "1px solid var(--border)",
        display: "flex",
        gap: 10,
      }}
    >
      <div
        className="avatar"
        style={{ width: 32, height: 32, fontSize: 13, flexShrink: 0 }}
      >
        {currentUser.uid.charAt(0).toUpperCase()}
      </div>
      <div style={{ flex: 1 }}>
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Schrijf iets..."
          rows={2}
          style={{ resize: "none", marginBottom: 8 }}
        />
        <button
          className="btn-primary"
          onClick={submit}
          disabled={busy || !text.trim()}
          style={{ padding: "7px 16px", fontSize: 13 }}
        >
          {busy ? "..." : "Plaatsen"}
        </button>
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

  async function loadData() {
    const [g, p] = await Promise.all([getGroup(id), getGroupPosts(id)]);
    setGroup(g);
    setPosts(p);
    setLoading(false);
  }

  useEffect(() => {
    loadData();
  }, [id]);

  const isMember = group?.members?.includes(currentUser?.uid);
  const isOwner = group?.ownerId === currentUser?.uid;
  const canSeePosts = !group?.private || isMember;

  async function toggleMembership() {
    setBusy(true);
    if (isMember) await leaveGroup(id, currentUser.uid);
    else await joinGroup(id, currentUser.uid);
    const updated = await getGroup(id);
    setGroup(updated);
    setBusy(false);
  }

  if (loading)
    return (
      <p style={{ padding: 40, textAlign: "center", color: "var(--muted)" }}>
        Laden...
      </p>
    );
  if (!group)
    return (
      <p style={{ padding: 40, textAlign: "center", color: "var(--muted)" }}>
        Groep niet gevonden.
      </p>
    );

  return (
    <div>
      {/* Groep header */}
      <div
        style={{
          padding: "20px 16px 16px",
          borderBottom: "1px solid var(--border)",
        }}
      >
        <div
          style={{
            display: "flex",
            gap: 16,
            alignItems: "center",
            marginBottom: 14,
          }}
        >
          <div
            className="avatar"
            style={{
              width: 60,
              height: 60,
              fontSize: 24,
              flexShrink: 0,
              color: "var(--accent)",
              border: "1px solid var(--border)",
            }}
          >
            {group.name.charAt(0).toUpperCase()}
          </div>
          <div style={{ flex: 1 }}>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 8,
                marginBottom: 4,
              }}
            >
              <p className="font-display" style={{ fontSize: 16 }}>
                {group.name}
              </p>
              {group.private && (
                <span style={{ fontSize: 10, color: "var(--muted)" }}>
                  privé
                </span>
              )}
            </div>
            <p style={{ color: "var(--muted)", fontSize: 12 }}>
              {group.members?.length ?? 0} leden
            </p>
          </div>
        </div>

        {group.description && (
          <p style={{ fontSize: 13, color: "var(--muted)", marginBottom: 14 }}>
            {group.description}
          </p>
        )}

        {currentUser && !isOwner && (
          <button
            className={isMember ? "btn-ghost" : "btn-primary"}
            onClick={toggleMembership}
            disabled={busy}
            style={{ width: "100%", textAlign: "center" }}
          >
            {isMember ? "Groep verlaten" : "Lid worden"}
          </button>
        )}
        {isOwner && (
          <p
            style={{
              fontSize: 12,
              color: "var(--accent)",
              textAlign: "center",
            }}
          >
            Jij bent eigenaar
          </p>
        )}
      </div>

      {group.private && !isMember && (
        <div style={{ padding: 40, textAlign: "center" }}>
          <p style={{ fontSize: 24, marginBottom: 8 }}>🔒</p>
          <p style={{ color: "var(--muted)", fontSize: 13 }}>
            Word lid om de posts te zien
          </p>
        </div>
      )}

      {canSeePosts && (
        <>
          {isMember && (
            <NewPostForm
              groupId={id}
              currentUser={currentUser}
              onPosted={() => getGroupPosts(id).then(setPosts)}
            />
          )}
          {posts.length === 0 ? (
            <p
              style={{
                padding: 40,
                textAlign: "center",
                color: "var(--muted)",
                fontSize: 13,
              }}
            >
              Nog geen posts.
            </p>
          ) : (
            posts.map((p) => <PostCard key={p.id} post={p} />)
          )}
        </>
      )}
    </div>
  );
}
