import './App.css'
import { useEffect, useState } from "react";
import { type AuthorDto, type BookDto, type GenreDto } from "./generated-client.ts";
import { libraryApi } from "./BaseUrl.ts";
import {useNavigate, useParams} from "react-router-dom";

interface BookRow {
    book: BookDto;
    authors: AuthorDto[];
    genre: GenreDto | null;
}

function LibraryPage() {
    const [authors, setAuthors] = useState<AuthorDto[]>([]);
    const [books, setBooks] = useState<BookDto[]>([]);
    const [rows, setRows] = useState<BookRow[]>([]);
    const [selectedBook, setSelectedBook] = useState<BookRow | null>(null);
    const [searchTerm, setSearchTerm] = useState("");
    const navigate = useNavigate();


    useEffect(() => {
        const fetchData = async () => {
            try {
                const [authorsRes, booksRes] = await Promise.all([
                    libraryApi.getAuthors(),
                    libraryApi.getBooks()
                ]);

                setAuthors(authorsRes ?? []);
                setBooks(booksRes ?? []);

                const bookRows: BookRow[] = (booksRes ?? []).map(book => ({
                    book,
                    authors: (authorsRes ?? []).filter(a => book.authorsIds?.includes(a.id) ?? false),
                    genre: book.genre ?? null
                }));

                setRows(bookRows);
            } catch (err) {
                console.error("Error fetching library data", err);
            }
        };

        fetchData();
    }, []);




    const handleUpdate = () => {
        if(selectedBook) {
            navigate(`/edit/${selectedBook.book.id}`)
            console.log("Selected book for update:", selectedBook.book.id);
        }else{
            alert("Please select exactly one book to update")
        }
    };

    const handleDelete = async () => {
        if (selectedBook) {
            const confirmed = window.confirm(`Delete "${selectedBook.book.title}"?`);
            if (!confirmed) return;

            try {
                await libraryApi.deleteBook(selectedBook.book.id);
                setRows(rows.filter(r => r.book.id !== selectedBook.book.id));
                setSelectedBook(null);
            } catch (err) {
                console.error("Delete failed", err);
            }
        } else {
            alert("Please select a book first");
        }
    };

    const filteredRows = rows.filter(row =>
        row.book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        row.authors.some(a => a.name.toLowerCase().includes(searchTerm.toLowerCase())) ||
        row.genre?.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleRowClick = (row: BookRow) => {
        setSelectedBook(row);
        console.log("Selected book:", row.book.id);
    };


    return (
        <div className="app-container">
            <div className="library-card">
                <h1>Library</h1>

                {/* Search Bar */}
                <div className="search-bar">
                    <input type="text"
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
                            {filteredRows.map(row => (
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
