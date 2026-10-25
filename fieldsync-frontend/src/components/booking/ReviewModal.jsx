import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import StarRating from '../common/StarRating';
import { X, Star, ThumbsUp, Sparkles, MessageSquare } from 'lucide-react';

export default function ReviewModal() {
  const { reviewTargetBooking, setReviewTargetBooking, submitReview } = useApp();
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');

  if (!reviewTargetBooking) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    submitReview({
      bookingId: reviewTargetBooking.id,
      helperProfileId: reviewTargetBooking.helperId,
      rating,
      comment: comment || 'Work was done promptly with good craftsmanship.'
    });
  };

  const ratingDescriptions = {
    1: 'Poor / Unsatisfactory work',
    2: 'Below expectations',
    3: 'Average performance',
    4: 'Good work & punctual',
    5: 'Outstanding craft & polite service!'
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in-up">
      <div className="bg-white rounded-3xl max-w-md w-full shadow-2xl border border-slate-100 overflow-hidden">
        {/* Header */}
        <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/60">
          <div>
            <h3 className="font-extrabold text-slate-900 text-base font-heading">
              Rate & Review Helper
            </h3>
            <p className="text-xs text-slate-500">
              Booking #{reviewTargetBooking.id} · {reviewTargetBooking.helperName} ({reviewTargetBooking.skillCategoryName})
            </p>
          </div>

          <button
            onClick={() => setReviewTargetBooking(null)}
            className="w-8 h-8 rounded-full hover:bg-slate-200 flex items-center justify-center text-slate-400 hover:text-slate-600 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {/* Interactive Star Picker */}
          <div className="text-center py-2">
            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
              Select Star Rating
            </label>
            <div className="flex justify-center mb-1">
              <StarRating
                rating={rating}
                showCount={false}
                size="lg"
                interactive={true}
                onRate={(val) => setRating(val)}
              />
            </div>
            <p className="text-xs font-semibold text-orange-600">
              {ratingDescriptions[rating]}
            </p>
          </div>

          {/* Written feedback */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
              <MessageSquare className="w-4 h-4 text-orange-500" />
              Written Review
            </label>
            <textarea
              rows={4}
              required
              placeholder="Tell others about their punctuality, cleanliness, craftsmanship, and transparency with quoted daily wage..."
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 text-slate-800"
            />
          </div>

          <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100 text-[11px] text-slate-500 flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-orange-500 flex-shrink-0" />
            <span>Your authentic review helps maintain trust and community ratings on FieldSync.</span>
          </div>

          {/* Actions */}
          <div className="pt-2 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={() => setReviewTargetBooking(null)}
              className="px-4 py-2.5 rounded-full border border-slate-200 text-xs font-bold text-slate-600 hover:bg-slate-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn-accent text-xs font-bold px-6 py-2.5 shadow-md shadow-orange-500/25"
            >
              Publish Review
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
