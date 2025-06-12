import React, { useState, useEffect } from "react";

function AddBookModal({ isOpen, onClose, onSubmit, bookData, mode }) {
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [description, setDescription] = useState("");
  useEffect(() => {
    setTitle(bookData?.title || "");
    setAuthor(bookData?.author || "");
    setImageUrl(bookData?.imageUrl || "");
    setDescription(bookData?.description || "");
  }, [bookData]);
  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({ id: bookData?.id, title, author, imageUrl, description });
  };
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg w-[90%] max-w-md shadow-lg relative">
        <h2 className="text-xl font-semibold mb-4">
          {mode === "edit" ? "Edit Book" : "Add New Book"}
        </h2>{" "}
        <div className="space-y-3">
          <input
            type="text"
            placeholder="Title"
            className="w-full p-2 border rounded"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          <input
            type="text"
            placeholder="Author"
            className="w-full p-2 border rounded"
            value={author}
            onChange={(e) => setAuthor(e.target.value)}
          />
          <input
            type="text"
            placeholder="Image URL"
            className="w-full p-2 border rounded"
            value={imageUrl}
            onChange={(e) => setImageUrl(e.target.value)}
          />
          <textarea
            placeholder="Description"
            className="w-full p-2 border rounded"
            rows="3"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>
        <div className="flex justify-end gap-2 mt-4">
          <button
            className="bg-gray-300 hover:bg-gray-400 px-3 py-1 rounded"
            onClick={onClose}
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded"
          >
            {mode === "edit" ? "Update Book" : "Add Book"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default AddBookModal;
