
'use client';

import styles from './Table.module.css';

export default function Table({ 
  columns, 
  data, 
  onRowClick,
  loading = false,
  emptyMessage = 'No data available',
  striped = true,
  hoverable = true,
  bordered = true,
  compact = false
}) {
  if (loading) {
    return (
      <div className={styles.loadingContainer}>
        <div className={styles.loader}></div>
        <p>Loading data...</p>
      </div>
    );
  }

  if (!data || data.length === 0) {
    return (
      <div className={styles.emptyState}>
        <div className={styles.emptyIcon}>📊</div>
        <p>{emptyMessage}</p>
      </div>
    );
  }

  return (
    <div className={styles.tableContainer}>
      <table className={`
        ${styles.table} 
        ${striped ? styles.striped : ''} 
        ${hoverable ? styles.hoverable : ''}
        ${bordered ? styles.bordered : ''}
        ${compact ? styles.compact : ''}
      `}>
        <thead>
          <tr>
            {columns.map((column, index) => (
              <th 
                key={column.key || index}
                style={{ width: column.width }}
                className={styles.headerCell}
              >
                {column.title}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((row, rowIndex) => (
            <tr 
              key={row.id || rowIndex}
              onClick={() => onRowClick?.(row)}
              className={onRowClick ? styles.clickableRow : ''}
            >
              {columns.map((column, colIndex) => (
                <td key={`${rowIndex}-${colIndex}`} className={styles.cell}>
                  {column.render ? column.render(row) : row[column.key]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
          }
