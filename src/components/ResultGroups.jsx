import { Link } from "react-router-dom";

export default function ResultGroups({ groups }) {
  return (
    <>
      {groups.map((g) => (
        <Link
          key={g.id}
          to={`/group/${g.id}`}
          className="flex justify-between bg-zinc-900 p-4 rounded-xl hover:bg-zinc-800"
        >
          <div>
            <p className="font-semibold">{g.name}</p>
            <p className="text-zinc-400 text-sm">{g.description}</p>
          </div>

          <div className="text-zinc-500 text-sm">{g.members?.length ?? 0}</div>
        </Link>
      ))}
    </>
  );
}
