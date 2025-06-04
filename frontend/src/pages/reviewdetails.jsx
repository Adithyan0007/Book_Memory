import { useEffect, useState } from "react";
import axios from "axios";
import Sidebar from "../components/sidebar";
import Pagination from "../components/pagination";
import { SquarePen } from "lucide-react";
import { Delete } from "lucide-react";
import ReviewModal from "../components/reviewModal";
function MyReviews() {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [bookId, setBookId] = useState(null);
  const reviewsPerPage = 6;
  const startIndex = (currentPage - 1) * reviewsPerPage; // Corrected calculation
  const endIndex = startIndex + reviewsPerPage; // Corrected calculation
  const pages = Math.ceil(reviews?.length / 6);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const token = localStorage.getItem("token");

        const res = await axios.get("http://localhost:4000/reviews/", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setReviews(res.data);
      } catch (err) {
        console.error("Failed to fetch reviews:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchReviews();
  }, []);
  const handleDelete = async (reviewId) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this review?"
    );
    if (!confirmDelete) return;

    try {
      const token = localStorage.getItem("token");
      const res = await axios.delete(
        `http://localhost:4000/reviews/${reviewId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // Set updated reviews directly from the response
      setReviews(res.data.reviews);

      alert("Review deleted successfully.");
    } catch (error) {
      console.error("Failed to delete review:", error);
      alert("Something went wrong while deleting the review.");
    }
  };

  const handleReviewEdit = async (
    { rating, comment },
    setComment,
    setRating
  ) => {
    const token = localStorage.getItem("token");
    const res = await axios.post(
      `http://localhost:4000/reviews`,
      {
        rating: parseInt(rating),
        comment,
        bookId,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    console.log("res is", res);

    alert("Review submitted!");
    setSelectedBook(null);
    setComment("");
    setRating(0);
  };

  return (
    <div className="min-h-screen bg-gray-950 text-white flex">
      <div className="w-64 h-full fixed">
        <Sidebar />
      </div>
      <div className="flex-1 ml-64 px-6 flex flex-col">
        <h1 className="text-3xl font-bold mb-4 text-center">📖 Your Reviews</h1>
        {loading ? (
          <div className="flex justify-center items-center min-h-40">
            <p className="text-lg text-gray-300 animate-pulse">
              Loading your reviews...
            </p>
          </div>
        ) : reviews.length === 0 ? (
          <p className="text-center text-gray-400">
            You haven't reviewed any books yet.
          </p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mb-2">
            {reviews.slice(startIndex, endIndex).map((review) => (
              <div
                key={review.id}
                className="relative group bg-gray-900 p-3 rounded-2xl shadow-lg hover:shadow-xl transition duration-300 flex flex-col items-center max-w-sm mx-auto w-full"
              >
                <div className="absolute top-2 right-2 flex gap-2 group-hover:flex z-10">
                  <button
                    className="bg-blue-600 hover:bg-blue-700 text-white text-xs p-1 rounded-2xl"
                    onClick={() => {
                      setBookId(review.bookId);
                      setIsModalOpen(true);
                    }}
                  >
                    <SquarePen size={16} />
                  </button>
                  <button
                    className="bg-red-600 hover:bg-red-700 text-white text-xs p-1 rounded-2xl"
                    onClick={() => handleDelete(review.id)}
                  >
                    <Delete size={16} />
                  </button>
                </div>
                <ReviewModal
                  isOpen={isModalOpen}
                  onClose={() => setIsModalOpen(false)}
                  onSubmit={handleReviewEdit}
                  name={"Edit"}
                />

                {/* Book Cover */}
                <img
                  src={review.book.imageUrl}
                  alt={review.book.title}
                  className="w-40 h-48 object-cover rounded-lg shadow-md mb-1"
                />

                {/* Book Title + Author */}
                <h3 className="font-semibold text-white text-center mb-0.5 text-sm truncate overflow-hidden w-full">
                  {review.book.title}
                </h3>
                <p className="text-gray-400 text-xs mb-0.5 truncate">
                  {review.book.author || "Unknown Author"}
                </p>

                {/* Star Rating */}
                <div className="flex justify-center mb-0.5">
                  {[...Array(5)].map((_, i) => (
                    <svg
                      key={i}
                      className={`w-4 h-4 ${
                        i < review.rating ? "text-yellow-400" : "text-gray-600"
                      }`}
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path d="M10 15l-5.878 3.09 1.122-6.545L.487 6.91l6.561-.955L10 0l2.952 5.955 6.561.955-4.757 4.635 1.122 6.545z" />
                    </svg>
                  ))}
                </div>

                {/* Comment */}
                <p className="text-gray-300 text-xs italic text-center px-1 truncate">
                  "{review.comment}"
                </p>
              </div>
            ))}
          </div>
        )}
        <div className="flex justify-center">
          {reviews?.length > 0 &&
            Pagination(pages, currentPage, setCurrentPage)}
        </div>
      </div>
    </div>
  );
}

export default MyReviews;
