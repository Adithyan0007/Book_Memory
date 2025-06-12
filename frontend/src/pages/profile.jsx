import { useEffect, useState } from "react";
import axios from "axios";
import { Star } from "lucide-react";

function Profile() {
  const [user, setUser] = useState(null);
  const [selectedRating, setSelectedRating] = useState(4);
  const [filteredBooks, setFilteredBooks] = useState([]);

  useEffect(() => {
    const fetchProfile = async () => {
      const token = localStorage.getItem("token");
      try {
        const res = await axios.get(
          "https://book-memory.onrender.com/users/profile",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setUser(res.data);
      } catch (err) {
        console.error("Error fetching profile:", err);
      }
    };
    fetchProfile();
  }, []);

  useEffect(() => {
    if (user && selectedRating !== null) {
      const filtered = user.reviews
        .filter((rev) => rev.rating === selectedRating)
        .map((rev) => rev.book);
      setFilteredBooks(filtered);
    }
  }, [selectedRating, user]);

  if (!user)
    return (
      <div className="bg-gray-950 min-h-screen text-white p-4 flex justify-center">
        <h3>Loading profile...</h3>
      </div>
    );

  return (
    <div className="bg-gray-950 min-h-screen text-white px-2 sm:px-4 py-6 sm:py-8">
      {/* Profile Header */}
      <div className="bg-gray-900 p-4 sm:p-6 rounded-2xl shadow-lg mb-6 sm:mb-8 flex flex-col sm:flex-row justify-between items-center sm:items-start gap-4">
        {/* User Info */}
        <div className="text-center sm:text-left">
          <h2 className="text-3xl font-bold">{user.name}</h2>
          <p className="text-gray-400">{user.email}</p>
          <p className="text-sm mt-1 text-gray-500">
            Member since {new Date(user.createdAt).toLocaleDateString()}
          </p>
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-2 sm:gap-4 sm:items-start items-center">
          <button
            onClick={() => (window.location.href = "/")}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition shadow text-sm"
          >
            ← Back to Dashboard
          </button>
          <button
            onClick={() => {
              localStorage.removeItem("token");
              window.location.href = "/login";
            }}
            className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg transition shadow text-sm"
          >
            Logout
          </button>
          <button
            onClick={() => {
              const confirmation = window.prompt(
                'Type "delete" to confirm account deletion:'
              );
              if (confirmation?.toLowerCase() === "delete") {
                console.log("account deleted");
              }
            }}
            className="bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded-lg transition shadow text-sm"
          >
            Delete Account
          </button>
        </div>
      </div>

      {/* Stats + Filter */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6 sm:mb-8">
        <div className="bg-gray-800 p-4 rounded-xl text-center shadow">
          <h4 className="text-xl font-semibold">{user.stats.totalReviews}</h4>
          <p className="text-gray-400 text-sm">Total Reviews</p>
        </div>
        <div className="bg-gray-800 p-4 rounded-xl text-center shadow">
          <h4 className="text-xl font-semibold flex items-center justify-center gap-1">
            {user.stats.avgRating}
            <Star size={16} className="text-yellow-400" />
          </h4>
          <p className="text-gray-400 text-sm">Avg. Rating</p>
        </div>
        <div className="bg-gray-800 p-4 rounded-xl text-center shadow">
          <p className="text-gray-300 mb-2 text-sm font-semibold">
            Filter by Rating
          </p>
          <div className="flex justify-center gap-1">
            <div className="flex justify-center gap-2 sm:gap-3">
              {[5, 4, 3, 2, 1].map((star) => (
                <button
                  key={star}
                  onClick={() =>
                    setSelectedRating((prev) => (prev === star ? null : star))
                  }
                  className={`bg-green-500 rounded-full text-white text-sm px-3 py-1 transition transform ${
                    selectedRating === star ? "scale-110" : "opacity-70"
                  }`}
                >
                  {star} ★
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Filtered Book List */}
      {selectedRating !== null && (
        <div>
          <h3 className="text-xl font-bold mb-4">
            Books you rated {selectedRating}★
          </h3>

          {filteredBooks.length === 0 ? (
            <p className="text-gray-400">No books with this rating.</p>
          ) : (
            <div className="relative w-full">
              <button
                onClick={() => {
                  const container = document.getElementById("bookScroll");
                  container.scrollBy({ left: -300, behavior: "smooth" });
                }}
                className="hidden sm:block absolute left-0 top-1/2 transform -translate-y-1/2 bg-gray-700 hover:bg-gray-600 text-white px-2 py-1 z-10 rounded-l"
              >
                ◀
              </button>

              <ul
                id="bookScroll"
                className="flex overflow-x-auto space-x-3 sm:space-x-4 scroll-smooth px-2 sm:px-10 mx-1 sm:mx-5"
              >
                {filteredBooks.map((book, i) => (
                  <li
                    key={i}
                    className="min-w-[180px] sm:min-w-[220px] max-w-[220px] flex-shrink-0 bg-gray-800 p-3 sm:p-4 rounded-xl shadow"
                  >
                    <img
                      src={book.imageUrl}
                      alt={book.title}
                      className="h-32 sm:h-40 w-full object-contain bg-gray-700 p-1 rounded mb-2"
                    />
                    <div>
                      <h4 className="font-semibold text-white text-sm line-clamp-2">
                        {book.title}
                      </h4>
                      <p className="text-gray-400 text-xs">
                        {book.author || "Unknown Author"}
                      </p>
                    </div>
                  </li>
                ))}
              </ul>

              <button
                onClick={() => {
                  const container = document.getElementById("bookScroll");
                  container.scrollBy({ left: 300, behavior: "smooth" });
                }}
                className="hidden sm:block absolute right-0 top-1/2 transform -translate-y-1/2 bg-gray-700 hover:bg-gray-600 text-white px-2 py-1 z-10 rounded-r"
              >
                ▶
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default Profile;
