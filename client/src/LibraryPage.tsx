import './App.css';
import { useEffect, useState } from "react";
import { type AuthorDto, type Book, type Genre } from "./generated-client.ts";
import { libraryApi } from "./BaseUrl.ts";
import { useNavigate } from "react-router-dom";

interface BookRow {
    book: Book;
    authors: AuthorDto[];
    genre: Genre | null;
}

function LibraryPage() {
    const [, setAuthors] = useState<AuthorDto[]>([]);
    const [rows, setRows] = useState<BookRow[]>([]);
    const [selectedBook, setSelectedBook] = useState<BookRow | null>(null);
    const [searchTerm, setSearchTerm] = useState("");
    const [currentPage, setCurrentPage] = useState(1);

    const rowsPerPage = 10;
    const navigate = useNavigate();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const skip = (currentPage - 1) * rowsPerPage;
                const take = rowsPerPage;

                const [authorsRes, booksRes] = await Promise.all([
                    libraryApi.getAuthors(),
                    libraryApi.getBooks(skip, take, /* ordering */ 0, /* descending */ false)
                ]);

                setAuthors(authorsRes ?? []);


                const booksArray = Array.isArray(booksRes)
                    ? booksRes
                    : booksRes?.books
                        ? booksRes.books
                        : [];

                const bookRows: BookRow[] = booksArray.map(book => ({
                    book,
                    authors: (authorsRes ?? []).filter(a =>
                        book.authors?.some(author => author.id === a.id)
                    ),
                    genre: book.genre ?? null
                }));

                setRows(bookRows);
            } catch (err) {
                console.error("Error fetching library data", err);
            }
        };

        fetchData();
    }, [currentPage]); // re-fetch when page changes

    const handleUpdate = () => {
        if (selectedBook) {
            navigate(`/edit/${selectedBook.book.id}`);
        } else {
            alert("Please select a book to update");
        }
    };

    const handleDelete = async () => {
        if (!selectedBook) {
            alert("Please select a book first");
            return;
        }

        const confirmed = window.confirm(`Delete "${selectedBook.book.title}"?`);
        if (!confirmed) return;

        try {
            await libraryApi.deleteBook(selectedBook.book.id);
            setRows(rows.filter(r => r.book.id !== selectedBook.book.id));
            setSelectedBook(null);
        } catch (err) {
            console.error("Delete failed", err);
        }
    };

    // Filtering
    const filteredRows = rows.filter(row =>
        row.book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        row.authors.some(a => a.name.toLowerCase().includes(searchTerm.toLowerCase())) ||
        row.genre?.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Pagination (client-side fallback)
    const totalPages = Math.ceil(filteredRows.length / rowsPerPage);
    const indexOfLastRow = currentPage * rowsPerPage;
    const indexOfFirstRow = indexOfLastRow - rowsPerPage;
    const currentRows = filteredRows.slice(indexOfFirstRow, indexOfLastRow);

    const handleNextPage = () => {
        if (currentPage < totalPages) setCurrentPage(currentPage + 1);
    };

    const handlePrevPage = () => {
        if (currentPage > 1) setCurrentPage(currentPage - 1);
    };

    useEffect(() => {
        setCurrentPage(1);
    }, [searchTerm, rows]);

    const handleRowClick = (row: BookRow) => {
        setSelectedBook(row);
    };

    return (
        <div className="app-container">
            <div className="library-card">
                <h1>Library</h1>

                {/* Search Bar */}
                <div className="search-bar">
                    <input
                        type="text"
                        placeholder="Search books..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>

                <div className="content-container">
                    {/* LEFT SIDE - TABLE */}
                    <div className="table-container">
                        <table className="library-table">
                            <thead>
                            <tr>
                                <th>Book</th>
                                <th>Authors</th>
                                <th>Genre</th>
                            </tr>
                            </thead>
                            <tbody>
                            {currentRows.map(row => (
                                <tr
                                    key={row.book.id}
                                    className={selectedBook?.book.id === row.book.id ? "selected" : ""}
                                    onClick={() => handleRowClick(row)}
                                >
                                    <td>{row.book.title}</td>
                                    <td>{row.authors.map(a => a.name).join(", ")}</td>
                                    <td>{row.genre?.name || "Unknown"}</td>
                                </tr>
                            ))}
                            </tbody>
                        </table>

                        {/* PAGINATION CONTROLS */}
                        <div className="pagination-controls">
                            <button onClick={handlePrevPage} disabled={currentPage === 1}>
                                Previous
                            </button>
                            <button onClick={handleNextPage} disabled={currentPage === totalPages}>
                                Next
                            </button>
                        </div>
                    </div>

                    {/* RIGHT SIDE - DETAILS PANEL */}
                    {selectedBook && (
                        <div className="details-panel">
                            <div className="book-placeholder">📘</div>
                            <h2>{selectedBook.book.title}</h2>
                            <p><strong>Authors:</strong> {selectedBook.authors.map(a => a.name).join(", ")}</p>
                            <p><strong>Genre:</strong> {selectedBook.genre?.name || "Unknown"}</p>

                            <div className="action-buttons">
                                <button className="button" onClick={handleUpdate}>Update</button>
                                <button className="button" onClick={handleDelete}>Delete</button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default LibraryPage;
