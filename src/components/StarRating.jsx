import { Star } from "lucide-react";
export default function StarRating({ value = 0 }) {
  const rounded = Math.round(value);

  return (
    <div className="flex gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => {
        const active = i < rounded;

        return (
          <span
            key={i}
            className={active ? "text-white text-sm" : "text-zinc-600 text-sm"}
          >
            <Star />
          </span>
        );
      })}
    </div>
  );
}
