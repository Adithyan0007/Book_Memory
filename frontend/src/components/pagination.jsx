function Pagination(pages, currentPage, setCurrentPage) {
  const paginationButtons = [];

  for (let i = 1; i <= pages; i++) {
    if (
      i == 1 ||
      i == currentPage ||
      i == currentPage - 1 ||
      i == currentPage + 1 ||
      i == pages
    ) {
      paginationButtons.push(
        <button
          key={i}
          onClick={() => setCurrentPage(i)}
          className={`px-3 py-1 mx-1 rounded-lg ${
            currentPage === i ? "bg-blue-700" : "bg-blue-600"
          } text-white text-sm`}
        >
          {i}
        </button>
      );
    } else if (i == currentPage - 2 || i == currentPage + 2) {
      paginationButtons.push(
        <span key={`dots-${i}`} className="text-gray-400 px-2">
          ...
        </span>
      );
    }
  }
  return paginationButtons;
}
export default Pagination;
