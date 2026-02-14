'use client';

import styles from './Pagination.module.css';

export default function Pagination({
  currentPage,
  totalPages,
  onPageChange,
  siblingCount = 1,
  showFirstLast = true,
  showPrevNext = true,
  size = 'medium'
}) {
  const generatePages = () => {
    const pages = [];
    const leftSibling = Math.max(currentPage - siblingCount, 1);
    const rightSibling = Math.min(currentPage + siblingCount, totalPages);

    const showLeftDots = leftSibling > 2;
    const showRightDots = rightSibling < totalPages - 1;

    if (!showLeftDots && !showRightDots) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else if (showLeftDots && !showRightDots) {
      for (let i = 1; i <= 2; i++) pages.push(i);
      pages.push('...');
      for (let i = totalPages - 2; i <= totalPages; i++) pages.push(i);
    } else if (!showLeftDots && showRightDots) {
      for (let i = 1; i <= 3; i++) pages.push(i);
      pages.push('...');
      for (let i = totalPages - 1; i <= totalPages; i++) pages.push(i);
    } else {
      pages.push(1);
      pages.push('...');
      for (let i = leftSibling; i <= rightSibling; i++) pages.push(i);
      pages.push('...');
      pages.push(totalPages);
    }

    return pages;
  };

  const pages = generatePages();

  return (
    <div className={`${styles.pagination} ${styles[size]}`}>
      {showFirstLast && (
        <button
          className={styles.pageButton}
          onClick={() => onPageChange(1)}
          disabled={currentPage === 1}
        >
          ⏮️
        </button>
      )}

      {showPrevNext && (
        <button
          className={styles.pageButton}
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
        >
          ←
        </button>
      )}

      {pages.map((page, index) => (
        <button
          key={index}
          className={`${styles.pageButton} ${page === currentPage ? styles.active : ''} ${page === '...' ? styles.dots : ''}`}
          onClick={() => page !== '...' && onPageChange(page)}
          disabled={page === '...'}
        >
          {page}
        </button>
      ))}

      {showPrevNext && (
        <button
          className={styles.pageButton}
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
        >
          →
        </button>
      )}

      {showFirstLast && (
        <button
          className={styles.pageButton}
          onClick={() => onPageChange(totalPages)}
          disabled={currentPage === totalPages}
        >
          ⏭️
        </button>
      )}
    </div>
  );
      }
