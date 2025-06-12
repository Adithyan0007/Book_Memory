// Dashboard.jsx
import { useState, useEffect } from "react";
import axios from "axios";
import ReviewModal from "../components/reviewModal";
import Sidebar from "../components/sidebar";
import Pagination from "../components/pagination";
import Hamburger from "../components/hamburgersidebar";
import useIsMobile from "../hooks/useMobile";
import AddBookModal from "../components/addbookModal";
import { Pencil, Trash2 } from "lucide-react";

function Dashboard() {
  const mobile = useIsMobile();
  const [data, setData] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedBook, setSelectedBook] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [isAddBookModalOpen, setIsAddBookModalOpen] = useState(false);
  const [editBookData, setEditBookData] = useState(null);
  const [isEditMode, setIsEditMode] = useState(false);
  const startIndex = (currentPage - 1) * 10;
  const endIndex = startIndex + 10;

  useEffect(() => {
    const fetchBooks = async () => {
      const token = localStorage.getItem("token");
      try {
        const res = await axios.get("https://book-memory.onrender.com/books/", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        console.log("hello", res.data);

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

  const handleAddBookSubmit = async (bookData) => {
    const token = localStorage.getItem("token");

    try {
      if (isEditMode && bookData.id) {
        await axios.put(
          `https://book-memory.onrender.com/books/${bookData.id}`,
          bookData,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        alert("Book updated successfully!");
      } else {
        await axios.post("https://book-memory.onrender.com/books", bookData, {
          headers: { Authorization: `Bearer ${token}` },
        });
        alert("Book added successfully!");
      }

      setIsAddBookModalOpen(false);
      setEditBookData(null);
      setIsEditMode(false);

      const res = await axios.get("https://book-memory.onrender.com/books/", {
        headers: { Authorization: `Bearer ${token}` },
      });

      setData(res.data);
    } catch (err) {
      console.error("Error saving book:", err);
      alert("Failed to save book.");
    }
  };

  const handleReviewSubmit = async (
    { rating, comment },
    setComment,
    setRating
  ) => {
    const token = localStorage.getItem("token");
    await axios.post(
      `https://book-memory.onrender.com/reviews`,
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
  const handleDeleteBook = async (bookId) => {
    const confirmation = window.prompt(
      "Type 'delete' to confirm deletion of this book:"
    );

    if (confirmation !== "delete") {
      alert("Deletion cancelled.");
      return;
    }
    const token = localStorage.getItem("token");

    try {
      const res = await axios.delete(
        `https://book-memory.onrender.com/books/${bookId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      alert("Book deleted successfully!");
      setData(res.data); // update your state with the new book list
    } catch (error) {
      console.error("Failed to delete book:", error);
      alert("Failed to delete book.");
    }
  };

  const handleEditBook = (book) => {
    setEditBookData(book);
    setIsEditMode(true);
    setIsAddBookModalOpen(true);
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
          <h3 className="text-2xl font-bold">📚 BookBuddy Dashboard</h3>

          <div className="flex items-center gap-4">
            <input
              type="text"
              placeholder="Search books..."
              className="w-40 sm:w-56 md:w-64 p-1.5 px-3 text-sm rounded-md bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500"
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <button
              onClick={() => setIsAddBookModalOpen(true)}
              className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1.5 rounded-md text-sm"
            >
              Add Book
            </button>
          </div>
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
                <div className="flex justify-between items-center gap-2 mt-auto">
                  <button
                    className="bg-green-600 hover:bg-green-700 text-white text-xs py-1 px-2 rounded"
                    onClick={() => handleAddReview(val)}
                  >
                    Add Review
                  </button>
                  <div className="flex gap-2">
                    <button
                      className="text-white hover:text-yellow-400"
                      onClick={() => handleEditBook(val)}
                    >
                      <Pencil size={18} />
                    </button>
                    <button
                      className="text-white hover:text-red-500"
                      onClick={() => handleDeleteBook(val.id)}
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>
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
      <AddBookModal
        isOpen={isAddBookModalOpen}
        onClose={() => {
          setIsAddBookModalOpen(false);
          setIsEditMode(false);
          setEditBookData(null);
        }}
        onSubmit={handleAddBookSubmit}
        bookData={editBookData}
        mode={isEditMode ? "edit" : "add"}
      />
    </div>
  );
}

export default Dashboard;
