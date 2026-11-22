import { StarIcon } from "lucide-react";

type Cs_StarRatingProps = {
  cs_value: number;
  cs_size?: "sm" | "md";
};

// Read-only stars; partial values fill part of a star (4.5 = four and a half)
const Cs_StarRating = ({ cs_value, cs_size = "sm" }: Cs_StarRatingProps) => {
  const cs_iconSize = cs_size === "sm" ? "size-3.5" : "size-5";
  return (
    <span className="inline-flex items-center gap-0.5" role="img" aria-label={`${cs_value.toFixed(1)} out of 5 stars`}>
      {Array.from({ length: 5 }, (_, cs_index) => {
        const cs_fill = Math.min(Math.max(cs_value - cs_index, 0), 1);
        return (
          <span key={cs_index} className={`relative inline-flex ${cs_iconSize}`}>
            <StarIcon className={`${cs_iconSize} fill-transparent text-(--cs_border_color)`} />
            {cs_fill > 0 && (
              <span className="absolute inset-y-0 left-0 overflow-hidden" style={{ width: `${cs_fill * 100}%` }}>
                <StarIcon className={`${cs_iconSize} max-w-none fill-amber-400 text-amber-400`} />
              </span>
            )}
          </span>
        );
      })}
    </span>
  );
};

export default Cs_StarRating;
