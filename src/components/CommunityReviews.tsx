import React, { useState, useEffect } from 'react';
import { Star, ThumbsUp, ThumbsDown, MessageCircle, User } from 'lucide-react';
import { useUser } from '../contexts/UserContext';

interface Review {
  id: string;
  userId: string;
  userName: string;
  communityId: string;
  rating: number;
  title: string;
  content: string;
  pros: string[];
  cons: string[];
  livedThere: boolean;
  duration: string;
  createdAt: string;
  helpful: number;
  notHelpful: number;
}

interface CommunityReviewsProps {
  communityId: string;
  communityName: string;
}

export const CommunityReviews: React.FC<CommunityReviewsProps> = ({ 
  communityId, 
  communityName 
}) => {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [showWriteReview, setShowWriteReview] = useState(false);
  const [sortBy, setSortBy] = useState<'newest' | 'oldest' | 'rating'>('newest');
  const { user, isAuthenticated } = useUser();

  // Load reviews from localStorage (in real app, this would be from API)
  useEffect(() => {
    const savedReviews = localStorage.getItem(`reviews_${communityId}`);
    if (savedReviews) {
      setReviews(JSON.parse(savedReviews));
    }
  }, [communityId]);

  // Save reviews to localStorage
  useEffect(() => {
    localStorage.setItem(`reviews_${communityId}`, JSON.stringify(reviews));
  }, [reviews, communityId]);

  const addReview = (newReview: Omit<Review, 'id' | 'userId' | 'userName' | 'createdAt' | 'helpful' | 'notHelpful'>) => {
    if (!user) return;

    const review: Review = {
      ...newReview,
      id: Math.random().toString(36).substr(2, 9),
      userId: user.id,
      userName: user.name,
      createdAt: new Date().toISOString(),
      helpful: 0,
      notHelpful: 0
    };

    setReviews(prev => [review, ...prev]);
    setShowWriteReview(false);
  };

  const sortedReviews = [...reviews].sort((a, b) => {
    switch (sortBy) {
      case 'newest':
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      case 'oldest':
        return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
      case 'rating':
        return b.rating - a.rating;
      default:
        return 0;
    }
  });

  const averageRating = reviews.length > 0 
    ? reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length 
    : 0;

  const ratingDistribution = [5, 4, 3, 2, 1].map(rating => ({
    rating,
    count: reviews.filter(r => r.rating === rating).length,
    percentage: reviews.length > 0 ? (reviews.filter(r => r.rating === rating).length / reviews.length) * 100 : 0
  }));

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-semibold text-gray-900">Community Reviews</h3>
        {isAuthenticated && (
          <button
            onClick={() => setShowWriteReview(true)}
            className="bg-blue-900 text-white px-4 py-2 rounded-lg hover:bg-blue-800 transition-colors duration-200 text-sm font-medium"
          >
            Write Review
          </button>
        )}
      </div>

      {/* Rating Summary */}
      <div className="mb-8 p-4 bg-gray-50 rounded-lg">
        <div className="flex items-center space-x-6">
          <div className="text-center">
            <div className="text-3xl font-bold text-gray-900">
              {averageRating.toFixed(1)}
            </div>
            <div className="flex items-center justify-center mb-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star
                  key={star}
                  className={`h-4 w-4 ${
                    star <= averageRating ? 'text-yellow-400 fill-current' : 'text-gray-300'
                  }`}
                />
              ))}
            </div>
            <div className="text-sm text-gray-600">{reviews.length} reviews</div>
          </div>

          <div className="flex-1">
            {ratingDistribution.map(({ rating, count, percentage }) => (
              <div key={rating} className="flex items-center space-x-2 mb-1">
                <span className="text-sm text-gray-600">{rating}</span>
                <Star className="h-3 w-3 text-yellow-400 fill-current" />
                <div className="flex-1 bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-yellow-400 h-2 rounded-full"
                    style={{ width: `${percentage}%` }}
                  />
                </div>
                <span className="text-sm text-gray-600 w-8 text-right">{count}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Sort Options */}
      <div className="flex items-center justify-between mb-4">
        <h4 className="font-medium text-gray-900">
          {reviews.length} Review{reviews.length !== 1 ? 's' : ''}
        </h4>
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value as 'newest' | 'oldest' | 'rating')}
          className="text-sm border border-gray-300 rounded-lg px-3 py-1 focus:ring-2 focus:ring-blue-900 focus:border-transparent outline-none"
        >
          <option value="newest">Newest First</option>
          <option value="oldest">Oldest First</option>
          <option value="rating">Highest Rated</option>
        </select>
      </div>

      {/* Reviews List */}
      <div className="space-y-6">
        {sortedReviews.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <MessageCircle className="h-12 w-12 mx-auto mb-3 text-gray-300" />
            <p>No reviews yet. Be the first to review {communityName}!</p>
          </div>
        ) : (
          sortedReviews.map((review) => (
            <ReviewCard key={review.id} review={review} />
          ))
        )}
      </div>

      {/* Write Review Modal */}
      {showWriteReview && (
        <WriteReviewModal
          communityId={communityId}
          communityName={communityName}
          onSubmit={addReview}
          onClose={() => setShowWriteReview(false)}
        />
      )}
    </div>
  );
};

interface ReviewCardProps {
  review: Review;
}

const ReviewCard: React.FC<ReviewCardProps> = ({ review }) => {
  return (
    <div className="border border-gray-200 rounded-lg p-4">
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center space-x-3">
          <div className="bg-blue-100 rounded-full p-2">
            <User className="h-4 w-4 text-blue-600" />
          </div>
          <div>
            <div className="font-medium text-gray-900">{review.userName}</div>
            <div className="text-sm text-gray-500">
              {review.livedThere ? `Lived there for ${review.duration}` : 'Visited/Researched'}
            </div>
          </div>
        </div>
        <div className="text-right">
          <div className="flex items-center space-x-1 mb-1">
            {[1, 2, 3, 4, 5].map((star) => (
              <Star
                key={star}
                className={`h-4 w-4 ${
                  star <= review.rating ? 'text-yellow-400 fill-current' : 'text-gray-300'
                }`}
              />
            ))}
          </div>
          <div className="text-xs text-gray-500">
            {new Date(review.createdAt).toLocaleDateString()}
          </div>
        </div>
      </div>

      <h5 className="font-medium text-gray-900 mb-2">{review.title}</h5>
      <p className="text-gray-700 mb-4">{review.content}</p>

      {(review.pros.length > 0 || review.cons.length > 0) && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          {review.pros.length > 0 && (
            <div>
              <h6 className="font-medium text-green-700 mb-2 flex items-center">
                <ThumbsUp className="h-4 w-4 mr-1" />
                Pros
              </h6>
              <ul className="text-sm text-gray-600 space-y-1">
                {review.pros.map((pro, index) => (
                  <li key={index} className="flex items-start">
                    <span className="text-green-500 mr-2">•</span>
                    {pro}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {review.cons.length > 0 && (
            <div>
              <h6 className="font-medium text-red-700 mb-2 flex items-center">
                <ThumbsDown className="h-4 w-4 mr-1" />
                Cons
              </h6>
              <ul className="text-sm text-gray-600 space-y-1">
                {review.cons.map((con, index) => (
                  <li key={index} className="flex items-start">
                    <span className="text-red-500 mr-2">•</span>
                    {con}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}

      <div className="flex items-center justify-between pt-3 border-t border-gray-200">
        <div className="text-sm text-gray-500">
          Was this review helpful?
        </div>
        <div className="flex items-center space-x-4">
          <button className="flex items-center space-x-1 text-sm text-gray-600 hover:text-green-600">
            <ThumbsUp className="h-4 w-4" />
            <span>{review.helpful}</span>
          </button>
          <button className="flex items-center space-x-1 text-sm text-gray-600 hover:text-red-600">
            <ThumbsDown className="h-4 w-4" />
            <span>{review.notHelpful}</span>
          </button>
        </div>
      </div>
    </div>
  );
};

interface WriteReviewModalProps {
  communityId: string;
  communityName: string;
  onSubmit: (review: Omit<Review, 'id' | 'userId' | 'userName' | 'createdAt' | 'helpful' | 'notHelpful'>) => void;
  onClose: () => void;
}

const WriteReviewModal: React.FC<WriteReviewModalProps> = ({
  communityId,
  communityName,
  onSubmit,
  onClose
}) => {
  const [formData, setFormData] = useState({
    rating: 5,
    title: '',
    content: '',
    pros: [''],
    cons: [''],
    livedThere: true,
    duration: '1-2 years'
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const review = {
      communityId,
      rating: formData.rating,
      title: formData.title,
      content: formData.content,
      pros: formData.pros.filter(pro => pro.trim()),
      cons: formData.cons.filter(con => con.trim()),
      livedThere: formData.livedThere,
      duration: formData.duration
    };

    onSubmit(review);
  };

  const addPro = () => {
    setFormData(prev => ({ ...prev, pros: [...prev.pros, ''] }));
  };

  const addCon = () => {
    setFormData(prev => ({ ...prev, cons: [...prev.cons, ''] }));
  };

  const updatePro = (index: number, value: string) => {
    const newPros = [...formData.pros];
    newPros[index] = value;
    setFormData(prev => ({ ...prev, pros: newPros }));
  };

  const updateCon = (index: number, value: string) => {
    const newCons = [...formData.cons];
    newCons[index] = value;
    setFormData(prev => ({ ...prev, cons: newCons }));
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-gray-200">
          <h3 className="text-xl font-semibold text-gray-900">
            Write a Review for {communityName}
          </h3>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Rating */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Overall Rating
            </label>
            <div className="flex items-center space-x-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setFormData(prev => ({ ...prev, rating: star }))}
                  className="focus:outline-none"
                >
                  <Star
                    className={`h-6 w-6 ${
                      star <= formData.rating ? 'text-yellow-400 fill-current' : 'text-gray-300'
                    }`}
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Title */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Review Title
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-900 focus:border-transparent outline-none"
              placeholder="Summarize your experience"
              required
            />
          </div>

          {/* Content */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Your Review
            </label>
            <textarea
              value={formData.content}
              onChange={(e) => setFormData(prev => ({ ...prev, content: e.target.value }))}
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-900 focus:border-transparent outline-none"
              placeholder="Share your experience living in or visiting this community"
              required
            />
          </div>

          {/* Experience */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Experience Type
              </label>
              <select
                value={formData.livedThere.toString()}
                onChange={(e) => setFormData(prev => ({ ...prev, livedThere: e.target.value === 'true' }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-900 focus:border-transparent outline-none"
              >
                <option value="true">I lived there</option>
                <option value="false">I visited/researched</option>
              </select>
            </div>

            {formData.livedThere && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  How long?
                </label>
                <select
                  value={formData.duration}
                  onChange={(e) => setFormData(prev => ({ ...prev, duration: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-900 focus:border-transparent outline-none"
                >
                  <option value="Less than 6 months">Less than 6 months</option>
                  <option value="6 months - 1 year">6 months - 1 year</option>
                  <option value="1-2 years">1-2 years</option>
                  <option value="2-5 years">2-5 years</option>
                  <option value="5+ years">5+ years</option>
                </select>
              </div>
            )}
          </div>

          {/* Pros and Cons */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Pros
              </label>
              {formData.pros.map((pro, index) => (
                <input
                  key={index}
                  type="text"
                  value={pro}
                  onChange={(e) => updatePro(index, e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-900 focus:border-transparent outline-none mb-2"
                  placeholder="What did you like?"
                />
              ))}
              <button
                type="button"
                onClick={addPro}
                className="text-sm text-blue-600 hover:text-blue-800"
              >
                + Add another pro
              </button>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Cons
              </label>
              {formData.cons.map((con, index) => (
                <input
                  key={index}
                  type="text"
                  value={con}
                  onChange={(e) => updateCon(index, e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-900 focus:border-transparent outline-none mb-2"
                  placeholder="What could be improved?"
                />
              ))}
              <button
                type="button"
                onClick={addCon}
                className="text-sm text-blue-600 hover:text-blue-800"
              >
                + Add another con
              </button>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end space-x-3 pt-4 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-600 hover:text-gray-800 font-medium"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="bg-blue-900 text-white px-6 py-2 rounded-lg hover:bg-blue-800 transition-colors duration-200 font-medium"
            >
              Submit Review
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
