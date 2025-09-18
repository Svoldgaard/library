import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { type BookDto, type AuthorDto, type GenreDto, type UpdateBookDtoRequest } from "./generated-client.ts";
import { libraryApi } from "./BaseUrl.ts";

function EditBookPage() {
    const { bookId } = useParams<{ bookId: string }>();
    const navigate = useNavigate();

    const [book, setBook] = useState<BookDto | null>(null);
    const [authors, setAuthors] = useState<AuthorDto[]>([]);
    const [genres, setGenres] = useState<GenreDto[]>([]);
    const [title, setTitle] = useState("");
    const [selectedAuthors, setSelectedAuthors] = useState<string[]>([]);
    const [selectedGenre, setSelectedGenre] = useState<string | null>(null);

    useEffect(() => {
        if (!bookId) return;

        const fetchData = async () => {
            try {
                const [bookRes, authorsRes, genresRes] = await Promise.all([
                    libraryApi.getBooks(),
                    libraryApi.getAuthors(),
                    libraryApi.getGenres(),
                ]);

                const found = (bookRes ?? []).find(b => String(b.id) === String(bookId));
                if (!found) return;

                setBook(found);
                setTitle(found.title);
                setSelectedAuthors(found.authorsIds ?? []);
                setSelectedGenre(found.genre?.id ?? null);
                setAuthors(authorsRes ?? []);
                setGenres(genresRes ?? []);
            } catch (err) {
                console.error("Error fetching book data", err);
            }
        };

        fetchData();
    }, [bookId]);

    const handleSave = async () => {
        if (!book) return;

        const payload: UpdateBookDtoRequest = {
            bookId: book.id,
            pages: book.pages ?? 0,
            title,
            authorsIds: selectedAuthors,
            genreId: selectedGenre ?? ""
        };

        try {
            await libraryApi.updateBook(payload);
            navigate("/");
        } catch (err) {
            console.error("Error updating book", err);
        }
    };

    if (!book) return <div>Loading...</div>;

    return (
        <div className="app-container">
            <div className="library-card">
                <h1>Edit Book</h1>

                <div className="details-panel">
                    <div className="form-row">
                        <label>Title:</label>
                        <input
                            type="text"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                        />
                    </div>

                    <div className="form-row">
                        <label>Authors:</label>
                        <select
                            multiple
                            value={selectedAuthors}
                            onChange={(e) =>
                                setSelectedAuthors(Array.from(e.target.selectedOptions, o => o.value))
                            }
                        >
                            {authors.map(a => (
                                <option key={a.id} value={a.id}>{a.name}</option>
                            ))}
                        </select>
                    </div>

                    <div className="form-row">
                        <label>Genre:</label>
                        <select
                            value={selectedGenre ?? ""}
                            onChange={(e) => setSelectedGenre(e.target.value)}
                        >
                            <option value="">-- Select Genre --</option>
                            {genres.map(g => (
                                <option key={g.id} value={g.id}>{g.name}</option>
                            ))}
                        </select>
                    </div>

                    <div className="action-buttons">
                        <button className="button" onClick={handleSave}>Save</button>
                        <button className="button" onClick={() => navigate("/")}>Cancel</button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default EditBookPage;
