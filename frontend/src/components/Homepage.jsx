import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import "../../src/css/Homepage.css";

const HomePage = () => {
  const [books, setBooks] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const booksPerPage = 8;

  useEffect(() => {
    axios
      .get("http://localhost:8000/api/books/all")
      .then((response) => setBooks(response.data))
      .catch((error) => console.error("Error fetching books:", error));
  }, []);

  // Filtering books based on search query
  const filteredBooks = books.filter((book) =>
    book.bookName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Pagination logic
  const totalPages = Math.ceil(filteredBooks.length / booksPerPage);
  const displayedBooks = filteredBooks.slice(
    (currentPage - 1) * booksPerPage,
    currentPage * booksPerPage
  );

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
    setCurrentPage(1);
  };

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  return (
    <div className="homepage-container">
      {/* Search Bar */}
      <div className="search-bar">
        <input
          type="text"
          placeholder="Search for books..."
          value={searchQuery}
          onChange={handleSearch}
          className="search-input"
        />
        <button className="search-button">Search</button>
      </div>

      {/* Books Grid */}
      <div className="books-grid">
        {displayedBooks.length > 0 ? (
          displayedBooks.map((book) => (
            <Link key={book._id} to={`/book/${book._id}`} className="book-card">
              <img
                src={`http://localhost:8000/uploads/${book.photos[0]}`}
                alt={book.bookName}
                className="book-image"
              />
              <div className="book-details">
                <h3 className="book-name">{book.bookName}</h3>
                <p className="book-price">₹{book.demandPrice}</p>
                <p>
                  <strong>Condition:</strong> {book.bookCondition}
                </p>
              </div>
            </Link>
          ))
        ) : (
          <p>No books available</p>
        )}
      </div>

      {/* Pagination */}
      <div className="pagination">
        {Array.from({ length: totalPages }, (_, index) => (
          <button
            key={index + 1}
            className={`pagination-button ${
              currentPage === index + 1 ? "active" : ""
            }`}
            onClick={() => handlePageChange(index + 1)}
          >
            {index + 1}
          </button>
        ))}
      </div>
    </div>
  );
};

export default HomePage;
