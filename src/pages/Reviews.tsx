import React, { useState } from 'react';
import {
  Star,
  CheckCircle2,
  ThumbsUp,
  Send,
  Filter
} from 'lucide-react';
import { storage } from '../lib/storage';
import { mockApi } from '../lib/mockApi';
import { Review } from '../types';
import { useToast } from '../context/ToastContext';
import { Button } from '../components/common/Button';

export const Reviews: React.FC = () => {
  const { success, error } = useToast();
  const [reviews, setReviews] = useState<Review[]>(() => storage.getReviews());
  const [ratingFilter, setRatingFilter] = useState<number | 'all'>('all');

  const [name, setName] = useState('');
  const [rating, setRating] = useState(5);
  const [dishRecommended, setDishRecommended] = useState('');
  const [comment, setComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const totalCount = reviews.length;
  const avgRating = totalCount > 0
    ? (reviews.reduce((sum, r) => sum + r.rating, 0) / totalCount).toFixed(1)
    : '5.0';

  const countForStar = (stars: number) => reviews.filter(r => r.rating === stars).length;

  const filteredReviews = reviews.filter(r => {
    if (ratingFilter === 'all') return true;
    return r.rating === ratingFilter;
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      error("Name Required", "Please enter your name.");
      return;
    }
    if (!comment.trim()) {
      error("Comment Required", "Please write a few words about your experience.");
      return;
    }

    setIsSubmitting(true);
    try {
      await mockApi.submitReview({
        customerName: name.trim(),
        rating,
        dishRecommended: dishRecommended.trim() || undefined,
        comment: comment.trim(),
      });

      setReviews(storage.getReviews());
      setName('');
      setDishRecommended('');
      setComment('');
      setRating(5);
      success("Review Submitted", "Thank you for sharing your feedback with Purvarang.");
    } catch (err) {
      error("Submission Error", "Unable to save review. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-10 text-espresso">
      
      {/* Reviews Header */}
      <div className="text-center max-w-2xl mx-auto space-y-2">
        <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-white border border-wheat text-palak text-[14px] font-semibold shadow-soft">
          <Star className="w-4 h-4 text-haldi fill-haldi" />
          <span>Guest Experiences & Trust</span>
        </div>
        <h1 className="font-serif text-[clamp(32px,4vw,48px)] font-bold text-espresso">
          Customer Reviews
        </h1>
        <p className="text-[16px] text-clay">
          Authentic feedback from families, banquet hosts, and highway travelers across Vaishali.
        </p>
      </div>

      {/* Rating Breakdown & Summary Card */}
      <div className="bg-white border border-wheat rounded-[16px] p-6 sm:p-8 shadow-soft">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
          {/* Average Rating Big Display */}
          <div className="md:col-span-4 text-center md:border-r md:border-wheat md:pr-8 space-y-2">
            <span className="font-serif text-[clamp(44px,5vw,64px)] font-bold text-mirchi leading-none">
              {avgRating}
            </span>
            <div className="flex items-center justify-center gap-1 text-haldi text-[22px]">
              {Array.from({ length: 5 }).map((_, i) => (
                <span key={i}>★</span>
              ))}
            </div>
            <p className="text-[14px] text-clay font-medium">
              Based on {totalCount} verified diner reviews
            </p>
          </div>

          {/* Star Distribution Bars */}
          <div className="md:col-span-8 space-y-2.5 text-[14px]">
            {[5, 4, 3, 2, 1].map(star => {
              const count = countForStar(star);
              const percentage = totalCount > 0 ? (count / totalCount) * 100 : 0;
              return (
                <div key={star} className="flex items-center gap-3">
                  <span className="w-14 text-espresso font-semibold text-right shrink-0">{star} stars</span>
                  <div className="flex-1 h-3.5 bg-paper rounded-full overflow-hidden border border-wheat">
                    <div
                      className="h-full bg-haldi rounded-full transition-all duration-500"
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                  <span className="w-8 text-clay font-bold text-right shrink-0">{count}</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Review Section Layout: Write Form + Review List */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10">
        {/* Left Column: Submit a Review Form */}
        <div className="lg:col-span-5">
          <div className="bg-white border border-wheat rounded-[16px] p-6 sm:p-8 space-y-6 shadow-soft sticky top-28">
            <div className="space-y-1">
              <h2 className="font-serif text-[22px] font-bold text-espresso">
                Write a Review
              </h2>
              <p className="text-[14px] text-clay">
                Dined with us recently? Tell us about the taste, service, or dining ambiance.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="text-[14px] font-semibold text-espresso block mb-1.5">
                  Your Rating <span className="text-mirchi">*</span>
                </label>
                <div className="flex items-center gap-2">
                  {[1, 2, 3, 4, 5].map(st => (
                    <button
                      key={st}
                      type="button"
                      onClick={() => setRating(st)}
                      className="p-1 text-[26px] transition-transform hover:scale-110"
                      aria-label={`${st} stars`}
                    >
                      <span className={st <= rating ? 'text-haldi' : 'text-wheat'}>
                        ★
                      </span>
                    </button>
                  ))}
                  <span className="text-[14px] text-mirchi font-semibold ml-2">
                    {rating} Star{rating > 1 ? 's' : ''}
                  </span>
                </div>
              </div>

              <div>
                <label className="text-[14px] font-semibold text-espresso block mb-1">
                  Your Full Name <span className="text-mirchi">*</span>
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  placeholder="e.g. Anand Prakash"
                  required
                  className="w-full px-3.5 py-2.5 rounded-[10px] bg-cream/50 border border-wheat text-[15px] text-espresso focus:outline-none focus:ring-2 focus:ring-kesar/40"
                />
              </div>

              <div>
                <label className="text-[14px] font-semibold text-espresso block mb-1">
                  Dish You Recommend (Optional)
                </label>
                <input
                  type="text"
                  value={dishRecommended}
                  onChange={e => setDishRecommended(e.target.value)}
                  placeholder="e.g. Chicken Dehati, Paneer Butter Masala"
                  className="w-full px-3.5 py-2.5 rounded-[10px] bg-cream/50 border border-wheat text-[15px] text-espresso focus:outline-none focus:ring-2 focus:ring-kesar/40"
                />
              </div>

              <div>
                <label className="text-[14px] font-semibold text-espresso block mb-1">
                  Your Review & Comments <span className="text-mirchi">*</span>
                </label>
                <textarea
                  value={comment}
                  onChange={e => setComment(e.target.value)}
                  placeholder="Share details about the food, cleanliness, or hospitality..."
                  rows={3}
                  required
                  className="w-full px-3.5 py-2 rounded-[10px] bg-cream/50 border border-wheat text-[15px] text-espresso focus:outline-none focus:ring-2 focus:ring-kesar/40"
                />
              </div>

              <Button
                type="submit"
                size="md"
                variant="primary"
                fullWidth
                isLoading={isSubmitting}
                rightIcon={<Send className="w-4 h-4" />}
              >
                Submit Review
              </Button>
            </form>
          </div>
        </div>

        {/* Right Column: Review List with Filter */}
        <div className="lg:col-span-7 space-y-5">
          {/* Filter Buttons */}
          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1">
            <span className="text-[14px] text-clay mr-1 flex items-center gap-1 font-semibold">
              <Filter className="w-4 h-4 text-mirchi" strokeWidth={1.75} />
              <span>Filter:</span>
            </span>
            <button
              onClick={() => setRatingFilter('all')}
              className={`px-3.5 py-1.5 rounded-full text-[14px] font-medium transition-all border ${
                ratingFilter === 'all'
                  ? 'bg-mirchi text-white border-mirchi shadow-soft font-semibold'
                  : 'bg-white text-espresso border-wheat hover:bg-paper'
              }`}
            >
              All ({reviews.length})
            </button>
            {[5, 4, 3].map(st => (
              <button
                key={st}
                onClick={() => setRatingFilter(st)}
                className={`px-3.5 py-1.5 rounded-full text-[14px] font-medium transition-all flex items-center gap-1 border ${
                  ratingFilter === st
                    ? 'bg-mirchi text-white border-mirchi shadow-soft font-semibold'
                    : 'bg-white text-espresso border-wheat hover:bg-paper'
                }`}
              >
                <span>{st}</span>
                <span className="text-haldi text-[14px]">★</span>
              </button>
            ))}
          </div>

          {/* Review Cards */}
          <div className="space-y-4">
            {filteredReviews.map(rev => (
              <div
                key={rev.id}
                className="bg-white border border-wheat rounded-[14px] p-5 space-y-3 shadow-soft hover:border-clay/40 transition-all"
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h3 className="font-serif text-[18px] font-bold text-espresso">
                      {rev.customerName}
                    </h3>
                    <div className="flex items-center gap-1 mt-0.5">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <span
                          key={i}
                          className={`text-[16px] ${
                            i < rev.rating
                              ? 'text-haldi'
                              : 'text-wheat'
                          }`}
                        >
                          ★
                        </span>
                      ))}
                      <span className="text-[13px] text-clay ml-2">
                        {rev.date}
                      </span>
                    </div>
                  </div>

                  {rev.verifiedVisit && (
                    <span className="inline-flex items-center gap-1 text-[13px] text-palak bg-palak/10 px-2.5 py-0.5 rounded-full border border-palak/20 font-semibold shrink-0">
                      <CheckCircle2 className="w-3.5 h-3.5 text-palak" strokeWidth={2} />
                      <span>Verified Diner</span>
                    </span>
                  )}
                </div>

                <p className="text-[15px] text-espresso leading-relaxed font-sans">
                  "{rev.comment}"
                </p>

                {rev.dishRecommended && (
                  <div className="pt-2 border-t border-wheat flex items-center gap-1.5 text-[14px] text-mirchi font-semibold">
                    <ThumbsUp className="w-4 h-4" strokeWidth={1.75} />
                    <span>Recommended: {rev.dishRecommended}</span>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

    </div>
  );
};
