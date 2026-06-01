import { averageRating } from "../utils/searchUtils";
import { Star, MapPin } from "lucide-react";
export default function ResultCemeteries({ cemeteries }) {
  return (
    <>
      {cemeteries.map((c) => {
        const avg = averageRating(c.averageRatings);

        return (
          <div key={c.id} className="bg-zinc-900 p-4 rounded-xl">
            <div className="flex justify-between">
              <div>
                <p className="font-semibold">{c.name}</p>
                <p className="text-zinc-500 text-sm">
                  <MapPin />
                  {c.location}
                </p>
              </div>

              {c.averageRatings && (
                <div className="text-right text-sm text-zinc-400">
                  <p>
                    <Star /> {avg.toFixed(1)}
                  </p>
                </div>
              )}
            </div>

            <p className="text-zinc-400 text-sm mt-2">{c.description}</p>
          </div>
        );
      })}
    </>
  );
}
