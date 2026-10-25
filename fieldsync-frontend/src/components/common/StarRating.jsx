import React from 'react';
import { Star } from 'lucide-react';

export default function StarRating({ rating = 0, count, showCount = true, size = 'sm', interactive = false, onRate }) {
  const stars = [1, 2, 3, 4, 5];
  const sizeClasses = {
    xs: 'w-3 h-3',
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-7 h-7'
  };

  return (
    <div className="inline-flex items-center gap-1.5">
      <div className="flex items-center">
        {stars.map((star) => {
          const filled = star <= Math.round(rating);
          return (
            <button
              type="button"
              key={star}
              disabled={!interactive}
              onClick={() => interactive && onRate && onRate(star)}
              className={`${interactive ? 'cursor-pointer hover:scale-110 transition-transform' : 'cursor-default'} p-0.5`}
            >
              <Star
                className={`${sizeClasses[size]} ${
                  filled ? 'fill-amber-400 text-amber-400' : 'fill-slate-100 text-slate-300'
                }`}
              />
            </button>
          );
        })}
      </div>
      <span className="font-semibold text-slate-900 text-sm">
        {Number(rating).toFixed(1)}
      </span>
      {showCount && count !== undefined && (
        <span className="text-xs text-slate-500 font-medium">
          ({count} {count === 1 ? 'review' : 'reviews'})
        </span>
      )}
    </div>
  );
}
