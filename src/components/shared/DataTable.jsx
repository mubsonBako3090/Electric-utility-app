'use client';

import React, { useState } from 'react';
import styles from './DataTable.module.css';
import Input from '../ui/Input';
import Button from '../ui/Button';
import clsx from 'clsx';

const DataTable = ({
  columns,
  data,
  title,
  searchable = true,
  filterable = true,
  exportable = true,
  pagination = true,
  pageSize = 10,
  onRowSelect,
  onRowClick,
  actions,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedRows, setSelectedRows] = useState([]);
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });

  // Filter data based on search
  const filteredData = data.filter((row) => {
    if (!searchTerm) return true;
    return Object.values(row).some((value) =>
      String(value).toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  // Sort data
  const sortedData = [...filteredData].sort((a, b) => {
    if (!sortConfig.key) return 0;
    
    const aValue = a[sortConfig.key];
    const bValue = b[sortConfig.key];
    
    if (aValue < bValue) return sortConfig.direction === 'asc' ? -1 : 1;
    if (aValue > bValue) return sortConfig.direction === 'asc' ? 1 : -1;
    return 0;
  });

  // Paginate
  const totalPages = Math.ceil(sortedData.length / pageSize);
  const paginatedData = pagination
    ? sortedData.slice((currentPage - 1) * pageSize, currentPage * pageSize)
    : sortedData;

  const handleSort = (key) => {
    setSortConfig({
      key,
      direction:
        sortConfig.key === key && sortConfig.direction === 'asc' ? 'desc' : 'asc',
    });
  };

  const handleSelectAll = () => {
    if (selectedRows.length === paginatedData.length) {
      setSelectedRows([]);
    } else {
      setSelectedRows(paginatedData.map((row) => row.id));
    }
  };

  const handleSelectRow = (id) => {
    if (selectedRows.includes(id)) {
      setSelectedRows(selectedRows.filter((rowId) => rowId !== id));
    } else {
      setSelectedRows([...selectedRows, id]);
    }
  };

  const handleExport = () => {
    const csvContent = [
      columns.map((col) => col.title).join(','),
      ...sortedData.map((row) =>
        columns.map((col) => JSON.stringify(row[col.key])).join(',')
      ),
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${title || 'export'}.csv`;
    a.click();
  };

  return (
    <div className={styles.dataTable}>
      {/* Header */}
      <div className={styles.header}>
        {title && <h3 className={styles.title}>{title}</h3>}
        
        <div className={styles.actions}>
          {searchable && (
            <Input
              type="search"
              placeholder="Search..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              size="small"
              className={styles.searchInput}
            />
          )}
          
          {exportable && (
            <Button
              variant="outline"
              size="small"
              onClick={handleExport}
            >
              📥 Export
            </Button>
          )}
        </div>
      </div>

      {/* Table */}
      <div className={styles.tableWrapper}>
        <table className={styles.table}>
          <thead>
            <tr>
              {onRowSelect && (
                <th className={styles.checkboxCell}>
                  <input
                    type="checkbox"
                    checked={selectedRows.length === paginatedData.length}
                    onChange={handleSelectAll}
                  />
                </th>
              )}
              
              {columns.map((column) => (
                <th
                  key={column.key}
                  className={clsx(
                    styles.th,
                    column.sortable && styles.sortable
                  )}
                  onClick={() => column.sortable && handleSort(column.key)}
                >
                  <div className={styles.thContent}>
                    {column.title}
                    {sortConfig.key === column.key && (
                      <span className={styles.sortIcon}>
                        {sortConfig.direction === 'asc' ? '↑' : '↓'}
                      </span>
                    )}
                  </div>
                </th>
              ))}
              
              {actions && <th className={styles.actionsCell}>Actions</th>}
            </tr>
          </thead>
          
          <tbody>
            {paginatedData.map((row, rowIndex) => (
              <tr
                key={row.id || rowIndex}
                className={clsx(
                  styles.tr,
                  onRowClick && styles.clickable,
                  selectedRows.includes(row.id) && styles.selected
                )}
                onClick={() => onRowClick?.(row)}
              >
                {onRowSelect && (
                  <td className={styles.checkboxCell}>
                    <input
                      type="checkbox"
                      checked={selectedRows.includes(row.id)}
                      onChange={() => handleSelectRow(row.id)}
                      onClick={(e) => e.stopPropagation()}
                    />
                  </td>
                )}
                
                {columns.map((column) => (
                  <td key={column.key} className={styles.td}>
                    {column.render
                      ? column.render(row[column.key], row)
                      : row[column.key]}
                  </td>
                ))}
                
                {actions && (
                  <td className={styles.actionsCell}>
                    {actions(row)}
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>

        {paginatedData.length === 0 && (
          <div className={styles.emptyState}>
            <p>No data available</p>
          </div>
        )}
      </div>

      {/* Pagination */}
      {pagination && totalPages > 1 && (
        <div className={styles.pagination}>
          <Button
            variant="outline"
            size="small"
            onClick={() => setCurrentPage(1)}
            disabled={currentPage === 1}
          >
            ⟪
          </Button>
          
          <Button
            variant="outline"
            size="small"
            onClick={() => setCurrentPage(currentPage - 1)}
            disabled={currentPage === 1}
          >
            ←
          </Button>
          
          <span className={styles.pageInfo}>
            Page {currentPage} of {totalPages}
          </span>
          
          <Button
            variant="outline"
            size="small"
            onClick={() => setCurrentPage(currentPage + 1)}
            disabled={currentPage === totalPages}
          >
            →
          </Button>
          
          <Button
            variant="outline"
            size="small"
            onClick={() => setCurrentPage(totalPages)}
            disabled={currentPage === totalPages}
          >
            ⟫
          </Button>
        </div>
      )}
    </div>
  );
};

export default DataTable;
