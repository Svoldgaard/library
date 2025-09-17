import './App.css'
import { useEffect, useState } from "react";
import { type AuthorDto, type BookDto, type GenreDto } from "./generated-client.ts";
import { libraryApi } from "./BaseUrl.ts";

interface BookRow {
    book: BookDto;
    authors: AuthorDto[];
    genre: GenreDto | null;
}

function App() {
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

    return (
        <div className="App">
            <h1>Library</h1>
            <table className="table-auto border-collapse border border-gray-300">
                <thead>
                <tr>
                    <th className="border px-2 py-1">Select</th>
                    <th className="border px-2 py-1">Book</th>
                    <th className="border px-2 py-1">Authors</th>
                    <th className="border px-2 py-1">Genre</th>
                </tr>
                </thead>
                <tbody>
                {rows.map(row => (
                    <tr key={row.book.id} className="hover:bg-gray-100">
                        <td className="border px-2 py-1 text-center">
                            <input
                                type="checkbox"
                                checked={selectedBookIds.has(row.book.id)}
                                onChange={() => toggleSelect(row.book.id)}
                            />
                        </td>
                        <td className="border px-2 py-1">{row.book.title}</td>
                        <td className="border px-2 py-1">{row.authors.map(a => a.name).join(", ")}</td>
                        <td className="border px-2 py-1">{row.genre?.name || "Unknown"}</td>
                    </tr>
                ))}
                </tbody>
            </table>

            <button
                className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                onClick={handleUpdate}
            >
                Update Selected
            </button>
        </div>
    );
}

export default App;
