'use client';

import { useState, useEffect, useCallback } from 'react';
import styles from './SearchBar.module.css';

export default function SearchBar({
  onSearch,
  placeholder = 'Search...',
  debounceTime = 300,
  initialValue = '',
  filters = [],
  onFilterChange,
  className = ''
}) {
  const [searchTerm, setSearchTerm] = useState(initialValue);
  const [selectedFilter, setSelectedFilter] = useState('all');

  useEffect(() => {
    const handler = setTimeout(() => {
      onSearch(searchTerm);
    }, debounceTime);

    return () => {
      clearTimeout(handler);
    };
  }, [searchTerm, onSearch, debounceTime]);

  const handleFilterChange = (filter) => {
    setSelectedFilter(filter);
    onFilterChange?.(filter);
  };

  return (
    <div className={`${styles.searchContainer} ${className}`}>
      <div className={styles.searchWrapper}>
        <span className={styles.searchIcon}>🔍</span>
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder={placeholder}
          className={styles.searchInput}
        />
        {searchTerm && (
          <button
            className={styles.clearButton}
            onClick={() => setSearchTerm('')}
          >
            ✕
          </button>
        )}
      </div>

      {filters.length > 0 && (
        <div className={styles.filterWrapper}>
          <select
            value={selectedFilter}
            onChange={(e) => handleFilterChange(e.target.value)}
            className={styles.filterSelect}
          >
            {filters.map((filter) => (
              <option key={filter.value} value={filter.value}>
                {filter.label}
              </option>
            ))}
          </select>
        </div>
      )}
    </div>
  );
      }
