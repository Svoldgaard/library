// src/pages/LibraryPage.tsx
import './App.css';
import { useNavigate } from "react-router-dom";
import { useLibrary } from "../hooks/useLibrary";
import { LibraryTable } from "../components/LibraryTable";
import { PaginationControls } from "../components/PaginationControls";
import { BookDetails } from "../components/BookDetails";

export function LibraryPage() {
    const {
        currentRows,
        selectedBook,
        setSelectedBook,
        searchTerm,
        setSearchTerm,
        currentPage,
        setCurrentPage,
        totalPages,
        startIndex,
        endIndex,
        filteredRows,
    } = useLibrary();

    const navigate = useNavigate();

    const handleNext = () => {
        if (currentPage < totalPages) setCurrentPage(currentPage + 1);
    };

    const handlePrev = () => {
        if (currentPage > 1) setCurrentPage(currentPage - 1);
    };

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
        if (confirmed) {
            console.log("Deleting:", selectedBook.book.id);
        }
    };

    return (
        <div className="app-container">
            <div className="library-card">
                <h1>Library</h1>

                <div className="search-bar">
                    <input
                        type="text"
                        placeholder="Search books..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>

                <div className="content-container">
                    <div className="table-container">
                        <LibraryTable
                            rows={currentRows}
                            selectedBook={selectedBook}
                            onSelect={setSelectedBook}
                        />

                        <PaginationControls
                            currentPage={currentPage}
                            totalPages={totalPages}
                            startIndex={startIndex}
                            endIndex={endIndex}
                            totalItems={filteredRows.length}
                            onNext={handleNext}
                            onPrev={handlePrev}
                        />
                    </div>

                    {selectedBook && (
                        <BookDetails
                            selectedBook={selectedBook}
                            onUpdate={handleUpdate}
                            onDelete={handleDelete}
                        />
                    )}
                </div>
            </div>
        </div>
    );
}
