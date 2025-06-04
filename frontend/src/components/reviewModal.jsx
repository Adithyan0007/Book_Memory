import { useState } from "react";

function ReviewModal({ isOpen, onClose, onSubmit, name }) {
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);
  const [comment, setComment] = useState("");

  const handleSubmit = () => {
    if (rating === 0 || comment.trim() === "")
      return alert("Please add rating and comment");
    onSubmit({ rating, comment }, setComment, setRating);
    setRating(0);
    setComment("");
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md shadow-lg">
        <h2 className="text-xl font-bold mb-4 text-gray-800">Leave a Review</h2>

        {/* Star rating */}
        <div className="flex items-center mb-4">
          {[...Array(5)].map((_, i) => {
            const starValue = i + 1;
            return (
              <button
                key={i}
                type="button"
                onClick={() => setRating(starValue)}
                onMouseEnter={() => setHover(starValue)}
                onMouseLeave={() => setHover(0)}
              >
                <svg
                  className={`w-8 h-8 ${
                    starValue <= (hover || rating)
                      ? "text-yellow-400"
                      : "text-gray-300"
                  }`}
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M10 15l-5.878 3.09 1.122-6.545L.487 6.91l6.561-.955L10 0l2.952 5.955 6.561.955-4.757 4.635 1.122 6.545z" />
                </svg>
              </button>
            );
          })}
        </div>

        {/* Comment textarea */}
        <textarea
          className="w-full border border-gray-300 rounded-md p-2 mb-4 focus:ring-2 focus:ring-blue-400 text-gray-800"
          placeholder="Write your comment..."
          value={comment}
          onChange={(e) => setComment(e.target.value)}
        ></textarea>

        {/* Action buttons */}
        <div className="flex justify-end space-x-2">
          <button
            className="px-4 py-2 bg-gray-300 text-gray-800 rounded hover:bg-gray-400"
            onClick={onClose}
          >
            Cancel
          </button>
          <button
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            onClick={handleSubmit}
          >
            {name} Review
          </button>
        </div>
      </div>
    </div>
  );
}

export default ReviewModal;
