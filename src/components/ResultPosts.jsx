import { averageRating } from "../utils/searchUtils";
import { Heart, Star } from "lucide-react";
function Stars({ value }) {
  const rounded = Math.round(value);

  return (
    <div className="flex gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <span key={i} className={i < rounded ? "text-white" : "text-zinc-600"}>
          <Star className="text-sm" />
        </span>
      ))}
    </div>
  );
}

export default function ResultPosts({ posts }) {
  return (
    <>
      {posts.map((p) => {
        const avg = averageRating(p.ratings);

        return (
          <div key={p.id} className="bg-zinc-900 p-4 rounded-xl">
            <p className="mb-2">{p.description}</p>

            <div className="flex gap-4 text-sm text-zinc-400">
              <span>
                <Heart className="text-sm" /> {p.likes?.length ?? 0}
              </span>

              {p.ratings && (
                <div className="flex items-center gap-2">
                  <Stars value={avg} />
                  <span>{avg.toFixed(1)}</span>
                </div>
              )}
            </div>
          </div>
        );
      })}
    </>
  );
}
