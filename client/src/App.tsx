
import './App.css'
import {useEffect, useState} from "react";
import {type AuthorDto, type BookDto, type GenreDto} from "./generated-client.ts";
import {libraryApi} from "./BaseUrl.ts";

function App() {

    const [authors, setAuthors] = useState<AuthorDto[]>([]);
    const [books, setBooks] = useState<BookDto[]>([]);
    const [genres, setGenres] = useState<GenreDto[]>([]);

    useEffect(() => {
        libraryApi.getAuthors()
            .then((r) => setAuthors(r ?? []))
            .catch((err) => console.error("Error fetching authors", err));

        libraryApi.getBooks()
            .then((r) => setBooks(r ?? []))
            .catch((err) => console.error("Error fetching books", err));

        libraryApi.getGenres()
            .then((r) => setGenres(r ?? []))
            .catch((err) => console.error("Error fetching genres", err));
    }, []);


  return (
    <>
        <div>
            <input type="text" />
            <button>Search</button>
        </div>

        <div>
            <button>Create new book</button>
            <button>update book </button>
            <button>Create new author</button>
            <button>Create new genre</button>
            <button>update book</button>
        </div>

        <div className="container">
            <div>
                <h1>Books</h1>
                <ul>
                    {books.map((b) => (
                        <li key={b.id}>
                            {b.title} ({b.pages} pages)
                        </li>
                    ))}
                </ul>
            </div>

            <div>
                <h1>Authors</h1>
                <ul>
                    {authors.map((a) => (
                        <li key={a.id}>{a.name}</li>
                    ))}
                </ul>
            </div>

            <div>
                <h1>Genres</h1>
                <ul>
                    {genres.map((g) => (
                        <li key={g.id}>{g.name}</li>
                    ))}
                </ul>
            </div>
        </div>

    </>
  )
}

export default App
