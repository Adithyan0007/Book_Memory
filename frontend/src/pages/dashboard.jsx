// Dashboard.jsx
import { useState, useEffect } from "react";
import axios from "axios";
import ReviewModal from "../components/reviewModal";
import Sidebar from "../components/sidebar";
import Pagination from "../components/pagination";
import Hamburger from "../components/hamburgersidebar";
import useIsMobile from "../hooks/useMobile";
function Dashboard() {
  const mobile = useIsMobile();
  const [data, setData] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedBook, setSelectedBook] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const startIndex = (currentPage - 1) * 10;
  const endIndex = startIndex + 10;

  useEffect(() => {
    const fetchBooks = async () => {
      const token = localStorage.getItem("token");
      try {
        const res = await axios.get("http://localhost:4000/books/", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setData(res.data);
      } catch (err) {
        console.error("Failed to fetch books:", err);
      }
    };
    fetchBooks();
  }, []);

  function handleAddReview(book) {
    setSelectedBook(book);
    setIsModalOpen(true);
  }

  const handleReviewSubmit = async (
    { rating, comment },
    setComment,
    setRating
  ) => {
    const token = localStorage.getItem("token");
    await axios.post(
      `http://localhost:4000/reviews`,
      {
        rating: parseInt(rating),
        comment,
        bookId: selectedBook.id,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    alert("Review submitted!");
    setSelectedBook(null);
    setComment("");
    setRating(0);
  };
  const filteredBooks = data.filter(
    (book) =>
      book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      book.author?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalPages = Math.ceil(filteredBooks.length / 10);
  const paginatedBooks = filteredBooks.slice(startIndex, endIndex);

  return (
    <div className="flex bg-gray-950 min-h-screen relative">
      {/* Desktop Sidebar */}
      <div className="hidden md:block w-64 fixed h-full">
        <Sidebar
          mobile={mobile}
          isSidebarOpen={isSidebarOpen}
          setIsSidebarOpen={setIsSidebarOpen}
        />
      </div>
      {/* Mobile Sidebar Overlay */}
      {mobile && (
        <Hamburger
          isSidebarOpen={isSidebarOpen}
          setIsSidebarOpen={setIsSidebarOpen}
        />
      )}
      {mobile && isSidebarOpen && (
        <div className="fixed inset-0 z-50 flex">
          {/* Sidebar panel */}

          <Sidebar
            mobile={mobile}
            isSidebarOpen={isSidebarOpen}
            setIsSidebarOpen={setIsSidebarOpen}
          />

          {/* Background overlay */}
          <div
            className="flex-1 bg-black bg-opacity-50"
            onClick={() => setIsSidebarOpen(false)}
          ></div>
        </div>
      )}

      {/* Main Content */}
      <div className="flex-1 md:ml-64 w-full">
        <header className="p-4 text-white relative flex items-center justify-between">
          <h3 className="text-2xl font-bold text-center mx-auto">
            📚 BookBuddy Dashboard
          </h3>

          <input
            type="text"
            placeholder="Search books..."
            className="absolute right-4 w-40 sm:w-56 md:w-64 p-1.5 px-3 text-sm rounded-md bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500"
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </header>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-5 gap-4 px-4 pb-6">
          {paginatedBooks.map((val, index) => (
            <div
              key={index}
              className="bg-gray-800 rounded-xl shadow-md overflow-hidden transform hover:scale-105 transition duration-300 flex flex-col"
            >
              <div className="h-44 bg-gray-700 flex items-center justify-center">
                <img
                  src={val.imageUrl}
                  alt={val.title}
                  className="max-h-full max-w-full object-contain p-2 mx-auto"
                />
              </div>
              <div className="p-2 flex flex-col flex-grow">
                <h5 className="font-medium text-white text-sm line-clamp-2">
                  {val.title}
                </h5>
                <p className="text-gray-400 text-xs mb-2">
                  {val.author || "Unknown Author"}
                </p>
                <button
                  className="bg-green-600 hover:bg-green-700 text-white text-xs py-1 px-2 rounded mt-auto"
                  onClick={() => handleAddReview(val)}
                >
                  Add Review
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="flex justify-center mt-2">
          {filteredBooks?.length > 0 &&
            Pagination(totalPages, currentPage, setCurrentPage)}
        </div>
      </div>

      <ReviewModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleReviewSubmit}
        name={"Add"}
      />
    </div>
  );
}

export default Dashboard;
