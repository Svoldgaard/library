import type {AuthorDto, BookDto} from "./types";

const API_BASE = "https://localhost:5001/api"; // example

export const libraryApi = {
    async getAuthors(): Promise<AuthorDto[]> {
        const res = await fetch(`${API_BASE}/authors`);
        return await res.json();
    },
    async getBooksDto(): Promise<BookDto[]> {
        const res = await fetch(`${API_BASE}/books`);
        return await res.json();
    },
    async deleteBook(id: string): Promise<void> {
        await fetch(`${API_BASE}/books/${id}`, { method: "DELETE" });
    }
};
