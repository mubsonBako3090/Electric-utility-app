'use client';

import { useState } from 'react';
import styles from './FormInput.module.css';

export default function FormInput({
  label,
  type = 'text',
  name,
  value,
  onChange,
  onBlur,
  placeholder,
  error,
  touched,
  required = false,
  disabled = false,
  icon,
  helperText,
  className = '',
  ...props
}) {
  const [showPassword, setShowPassword] = useState(false);

  const inputType = type === 'password' && showPassword ? 'text' : type;

  const handleTogglePassword = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className={`${styles.formGroup} ${className}`}>
      {label && (
        <label htmlFor={name} className={styles.label}>
          {label}
          {required && <span className={styles.required}>*</span>}
        </label>
      )}

      <div className={styles.inputWrapper}>
        {icon && <span className={styles.icon}>{icon}</span>}
        
        <input
          type={inputType}
          id={name}
          name={name}
          value={value}
          onChange={onChange}
          onBlur={onBlur}
          placeholder={placeholder}
          disabled={disabled}
          className={`
            ${styles.input}
            ${icon ? styles.withIcon : ''}
            ${error && touched ? styles.error : ''}
            ${disabled ? styles.disabled : ''}
          `}
          {...props}
        />

        {type === 'password' && (
          <button
            type="button"
            onClick={handleTogglePassword}
            className={styles.passwordToggle}
          >
            {showPassword ? '👁️' : '👁️‍🗨️'}
          </button>
        )}
      </div>

      {error && touched && (
        <div className={styles.errorMessage}>{error}</div>
      )}

      {helperText && !error && (
        <div className={styles.helperText}>{helperText}</div>
      )}
    </div>
  );
    }
