interface PaginationProps {
    currentPage: number;
    totalPages: number;
    startIndex: number;
    endIndex: number;
    totalItems: number;
    onNext: () => void;
    onPrev: () => void;
}

export function PaginationControls({
                                       currentPage,
                                       totalPages,
                                       startIndex,
                                       endIndex,
                                       totalItems,
                                       onNext,
                                       onPrev
                                   }: PaginationProps) {
    return (
        <div className="pagination-controls">
            <button onClick={onPrev} disabled={currentPage === 1}>
                Previous
            </button>

            <span>
        Showing {startIndex + 1}-{endIndex} of {totalItems} books
      </span>

            <button onClick={onNext} disabled={currentPage === totalPages}>
                Next
            </button>
        </div>
    );
}
