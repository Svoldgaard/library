import './App.css'
import { useEffect, useState } from "react";
import { type AuthorDto, type BookDto, type GenreDto } from "./generated-client.ts";
import { libraryApi } from "./BaseUrl.ts";

interface BookRow {
    book: BookDto;
    authors: AuthorDto[];
    genre: GenreDto | null;
}

function LibraryPage() {
    const [authors, setAuthors] = useState<AuthorDto[]>([]);
    const [books, setBooks] = useState<BookDto[]>([]);
    const [rows, setRows] = useState<BookRow[]>([]);
    const [selectedBookIds, setSelectedBookIds] = useState<Set<string>>(new Set());

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

    const toggleSelect = (bookId: string) => {
        const newSet = new Set(selectedBookIds);
        if (newSet.has(bookId)) newSet.delete(bookId);
        else newSet.add(bookId);
        setSelectedBookIds(newSet);
    };

    const handleUpdate = () => {
        console.log("Selected books for update:", Array.from(selectedBookIds));
        // Call PUT /UpdateBook with the selected books
    };

    const handleDelete = () => {
        console.log("Selected books for delete:", selectedBookIds);
    }

    const handelSearch = () => {
        console.log("Selected books for search:", selectedBookIds);
    }

    return (
        <div className="app-container">
            <div className="library-card">
                <h1>Library</h1>

                <div>
                    <input type="text"/>
                    <button className="button" onClick={handelSearch}>Search</button>
                </div>

                <div>
                    <button className="button" onClick={handleUpdate}>
                        Update
                    </button>

                    <button className="button" onClick={handleDelete}>Delete</button>
                </div>



                <table className="library-table">
                    <thead>
                    <tr>
                        <th>Select</th>
                        <th>Book</th>
                        <th>Authors</th>
                        <th>Genre</th>
                    </tr>
                    </thead>
                    <tbody>
                    {rows.map(row => (
                        <tr
                            key={row.book.id}
                            className={selectedBookIds.has(row.book.id) ? "selected" : ""}
                        >
                            <td className="text-center">
                                <input
                                    type="checkbox"
                                    checked={selectedBookIds.has(row.book.id)}
                                    onChange={() => toggleSelect(row.book.id)}
                                />
                            </td>
                            <td>{row.book.title}</td>
                            <td>{row.authors.map(a => a.name).join(", ")}</td>
                            <td>{row.genre?.name || "Unknown"}</td>
                        </tr>
                    ))}
                    </tbody>
                </table>

                <button className="update-button" onClick={handleUpdate}>
                    Update Selected
                </button>
            </div>
        </div>
    );
}

export default LibraryPage;
