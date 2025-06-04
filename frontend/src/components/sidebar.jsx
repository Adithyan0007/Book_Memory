import { Link, useLocation } from "react-router-dom";

function Sidebar({ isSidebarOpen, mobile, setIsSidebarOpen }) {
  console.log(mobile);
  console.log(isSidebarOpen);

  const location = useLocation();
  console.log(location.pathname);
  const isActive = (path) => location.pathname == path;

  return (
    <div className="relative h-screen w-64 bg-gray-900 text-white flex flex-col p-4 space-y-4">
      <div>
        <h3>Bookbuddy.in</h3>
      </div>

      <Link
        to="/"
        className={`p-2 rounded ${
          isActive("/")
            ? "bg-green-500 font-bold"
            : "hover:bg-green-500 bg-gray-700"
        }`}
      >
        📚 All Books
      </Link>
      <Link
        to="/my-reviews"
        className={`p-2 rounded ${
          isActive("/my-reviews")
            ? "bg-green-500 font-bold"
            : "bg-gray-700 hover:bg-green-500"
        }`}
      >
        📝 Your Reviews
      </Link>

      <Link
        to="/profile"
        className={`p-2 rounded ${
          isActive("/profile")
            ? "bg-green-500 font-bold"
            : "bg-gray-700 font-bold hover:bg-green-500"
        }`}
      >
        👤 My Account
      </Link>
      {mobile && isSidebarOpen && (
        <div className="flex justify-center">
          <Link
            className="bg-red-700 font-bold p-2 rounded"
            onClick={() => setIsSidebarOpen(false)}
          >
            Close
          </Link>
        </div>
      )}

      {/* <div className="mt-auto">
        <button
          onClick={() => {
            localStorage.removeItem("token");
            window.location.href = "/login";
          }}
          className="w-full bg-red-600 hover:bg-red-700 p-2 rounded mt-4"
        >
          🚪 Logout
        </button>
      </div> */}
    </div>
  );
}

export default Sidebar;
