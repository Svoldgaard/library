import type {BookRow} from "../hooks/useLibrary";

interface BookDetailsProps {
    selectedBook: BookRow;
    onUpdate: () => void;
    onDelete: () => void;
}

export function BookDetails({ selectedBook, onUpdate, onDelete }: BookDetailsProps) {
    return (
        <div className="details-panel">
            <div className="book-placeholder">📘</div>
            <h2>{selectedBook.book.title}</h2>
            <p><strong>Authors:</strong> {selectedBook.authors.map(a => a.name).join(", ")}</p>
            <p><strong>Genre:</strong> {selectedBook.genre?.name || "Unknown"}</p>

            <div className="action-buttons">
                <button className="button" onClick={onUpdate}>Update</button>
                <button className="button" onClick={onDelete}>Delete</button>
            </div>
        </div>
    );
}
