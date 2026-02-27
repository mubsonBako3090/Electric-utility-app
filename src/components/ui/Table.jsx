import React from 'react';
import styles from './Table.module.css';
import clsx from 'clsx';

const Table = ({
  columns,
  data,
  loading = false,
  emptyMessage = 'No data available',
  onRowClick,
  striped = false,
  bordered = false,
  hoverable = false,
  compact = false,
}) => {
  if (loading) {
    return (
      <div className={styles.loadingContainer}>
        <div className={styles.spinner} />
        <p>Loading...</p>
      </div>
    );
  }

  if (!data || data.length === 0) {
    return (
      <div className={styles.emptyContainer}>
        <p className={styles.emptyMessage}>{emptyMessage}</p>
      </div>
    );
  }

  return (
    <div className={styles.tableWrapper}>
      <table className={clsx(
        styles.table,
        striped && styles.striped,
        bordered && styles.bordered,
        hoverable && styles.hoverable,
        compact && styles.compact
      )}>
        <thead className={styles.thead}>
          <tr>
            {columns.map((column, index) => (
              <th
                key={column.key || index}
                className={clsx(
                  styles.th,
                  column.align && styles[`text-${column.align}`]
                )}
                style={{ width: column.width }}
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
              className={clsx(
                styles.tr,
                onRowClick && styles.clickable
              )}
              onClick={() => onRowClick && onRowClick(row)}
            >
              {columns.map((column, colIndex) => (
                <td
                  key={`${rowIndex}-${colIndex}`}
                  className={clsx(
                    styles.td,
                    column.align && styles[`text-${column.align}`]
                  )}
                >
                  {column.render
                    ? column.render(row[column.key], row)
                    : row[column.key]
                  }
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Table;
