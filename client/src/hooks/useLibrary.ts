// src/hooks/useLibrary.ts
import { useEffect, useState } from "react";
import { libraryApi } from '../api/libraryApi';
import type {AuthorDto, BookDto, GenreDto} from "../api/types";

export interface BookRow {
    book: BookDto;
    authors: AuthorDto[];
    genre: GenreDto | null;
}

export function useLibrary() {
    const [rows, setRows] = useState<BookRow[]>([]);
    const [selectedBook, setSelectedBook] = useState<BookRow | null>(null);
    const [searchTerm, setSearchTerm] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const rowsPerPage = 10;

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [authorsRes, booksRes] = await Promise.all([
                    libraryApi.getAuthors(),
                    libraryApi.getBooksDto()
                ]);

                const authors: AuthorDto[] = Array.isArray(authorsRes)
                    ? authorsRes
                    : (authorsRes as any)?.$values ?? [];

                const books: BookDto[] = Array.isArray(booksRes)
                    ? booksRes
                    : (booksRes as any)?.$values ?? [];

                const bookRows: BookRow[] = books.map((book) => {
                    const authorIds: string[] = Array.isArray(book.authorsIds)
                        ? book.authorsIds
                        : (book.authorsIds as any)?.$values ?? [];

                    return {
                        book,
                        authors: authors.filter(a => authorIds.includes(a.id)),
                        genre: book.genre ?? null
                    };
                });

                setRows(bookRows);
            } catch (err) {
                console.error("Error fetching library data", err);
            }
        };

        fetchData();
    }, []);

    // Filter
    const filteredRows = rows.filter(row =>
        row.book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        row.authors.some(a => a.name.toLowerCase().includes(searchTerm.toLowerCase())) ||
        row.genre?.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Pagination
    const totalPages = Math.ceil(filteredRows.length / rowsPerPage);
    const startIndex = (currentPage - 1) * rowsPerPage;
    const endIndex = Math.min(startIndex + rowsPerPage, filteredRows.length);
    const currentRows = filteredRows.slice(startIndex, endIndex);

    return {
        rows,
        currentRows,
        filteredRows,
        selectedBook,
        setSelectedBook,
        searchTerm,
        setSearchTerm,
        currentPage,
        setCurrentPage,
        totalPages,
        startIndex,
        endIndex
    };
}
