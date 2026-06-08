import { Link } from "react-router-dom";

export default function ResultLocations({ locations }) {
  return (
    <>
      {locations.map((l) => (
        <Link
          key={l.id}
          to={`/location/${l.id}`}
          className="flex justify-between bg-zinc-900 p-4 rounded-xl hover:bg-zinc-800"
        >
          <div>
            <p className="font-semibold">{l.name}</p>
            <p className="text-zinc-400 text-sm">{l.description}</p>
          </div>
        </Link>
      ))}
    </>
  );
}
