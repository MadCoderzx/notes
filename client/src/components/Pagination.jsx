import { FiChevronLeft, FiChevronRight } from 'react-icons/fi';

const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  if (totalPages <= 1) return null;

  const pages = [];
  const maxVisible = 5;
  let start = Math.max(1, currentPage - Math.floor(maxVisible / 2));
  let end = Math.min(totalPages, start + maxVisible - 1);

  if (end - start < maxVisible - 1) {
    start = Math.max(1, end - maxVisible + 1);
  }

  for (let i = start; i <= end; i++) {
    pages.push(i);
  }

  return (
    <div className="pagination">
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="btn-icon"
      >
        <FiChevronLeft />
      </button>
      {start > 1 && (
        <>
          <button onClick={() => onPageChange(1)} className="page-btn">1</button>
          {start > 2 && <span className="page-dots">...</span>}
        </>
      )}
      {pages.map((page) => (
        <button
          key={page}
          onClick={() => onPageChange(page)}
          className={`page-btn ${page === currentPage ? 'active' : ''}`}
        >
          {page}
        </button>
      ))}
      {end < totalPages && (
        <>
          {end < totalPages - 1 && <span className="page-dots">...</span>}
          <button onClick={() => onPageChange(totalPages)} className="page-btn">{totalPages}</button>
        </>
      )}
      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="btn-icon"
      >
        <FiChevronRight />
      </button>
    </div>
  );
};

export default Pagination;
