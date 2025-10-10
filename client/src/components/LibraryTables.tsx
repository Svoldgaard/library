import type {BookRow} from "../hooks/useLibrary";

interface LibraryTableProps {
    rows: BookRow[];
    selectedBook: BookRow | null;
    onSelect: (row: BookRow) => void;
}

export function LibraryTable({ rows, selectedBook, onSelect }: LibraryTableProps) {
    return (
        <table className="library-table">
            <thead>
            <tr>
                <th>Book</th>
                <th>Authors</th>
                <th>Genre</th>
            </tr>
            </thead>
            <tbody>
            {rows.map(row => (
                <tr
                    key={row.book.id}
                    className={selectedBook?.book.id === row.book.id ? "selected" : ""}
                    onClick={() => onSelect(row)}
                >
                    <td>{row.book.title}</td>
                    <td>{row.authors.map(a => a.name).join(", ")}</td>
                    <td>{row.genre?.name || "Unknown"}</td>
                </tr>
            ))}
            </tbody>
        </table>
    );
}
