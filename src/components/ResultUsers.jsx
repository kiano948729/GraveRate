import { Link } from "react-router-dom";

export default function ResultUsers({ users }) {
  return (
    <>
      {users.map((u) => (
        <Link
          key={u.id}
          to={`/user/${u.id}`}
          className="flex items-center gap-4 bg-zinc-900 p-4 rounded-xl hover:bg-zinc-800"
        >
          <div className="w-10 h-10 rounded-full bg-zinc-700 flex items-center justify-center overflow-hidden">
            {u.profilePicture ? (
              <img src={u.profilePicture} className="w-full h-full object-cover" />
            ) : (
              u.username?.[0]?.toUpperCase()
            )}
          </div>

          <div>
            <p className="font-semibold">{u.username}</p>
            <p className="text-zinc-400 text-sm">{u.bio || "Geen bio"}</p>
          </div>

          <div className="ml-auto text-zinc-500 text-sm">{u.upvotes ?? 0}</div>
        </Link>
      ))}
    </>
  );
}
