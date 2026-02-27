'use client';

import React, { useState, useRef, useEffect } from 'react';
import styles from './Dropdown.module.css';
import clsx from 'clsx';

const Dropdown = ({
  trigger,
  children,
  placement = 'bottom-left',
  offset = 8,
  closeOnClick = true,
  closeOnSelect = true,
  disabled = false,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);
  const triggerRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target) &&
        !triggerRef.current?.contains(event.target)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleTriggerClick = () => {
    if (!disabled) {
      setIsOpen(!isOpen);
    }
  };

  const handleItemClick = (onClick) => (e) => {
    if (closeOnSelect) {
      setIsOpen(false);
    }
    onClick?.(e);
  };

  const getPlacementStyles = () => {
    const baseStyles = {
      top: triggerRef.current?.offsetHeight + offset,
    };

    switch (placement) {
      case 'bottom-left':
        return { ...baseStyles, left: 0 };
      case 'bottom-right':
        return { ...baseStyles, right: 0 };
      case 'top-left':
        return { bottom: '100%', marginBottom: offset, left: 0 };
      case 'top-right':
        return { bottom: '100%', marginBottom: offset, right: 0 };
      default:
        return baseStyles;
    }
  };

  return (
    <div className={styles.dropdown}>
      <div
        ref={triggerRef}
        onClick={handleTriggerClick}
        className={clsx(styles.trigger, disabled && styles.disabled)}
      >
        {trigger}
      </div>

      {isOpen && (
        <div
          ref={dropdownRef}
          className={clsx(styles.menu, styles[placement])}
          style={getPlacementStyles()}
        >
          {React.Children.map(children, (child) => {
            if (React.isValidElement(child)) {
              return React.cloneElement(child, {
                onClick: handleItemClick(child.props.onClick),
              });
            }
            return child;
          })}
        </div>
      )}
    </div>
  );
};

export const DropdownItem = ({ children, icon, onClick, danger = false, disabled = false }) => {
  return (
    <button
      className={clsx(
        styles.item,
        danger && styles.danger,
        disabled && styles.disabled
      )}
      onClick={onClick}
      disabled={disabled}
    >
      {icon && <span className={styles.itemIcon}>{icon}</span>}
      <span className={styles.itemLabel}>{children}</span>
    </button>
  );
};

export const DropdownDivider = () => {
  return <div className={styles.divider} />;
};

export const DropdownHeader = ({ children }) => {
  return <div className={styles.header}>{children}</div>;
};

export default Dropdown;
