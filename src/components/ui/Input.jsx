import React, { useState } from 'react';
import styles from './Input.module.css';
import clsx from 'clsx';

const Input = ({
  label,
  type = 'text',
  error,
  success,
  helper,
  icon,
  iconPosition = 'left',
  fullWidth = false,
  required = false,
  disabled = false,
  value,
  onChange,
  onBlur,
  name,
  placeholder,
  className,
  ...props
}) => {
  const [focused, setFocused] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleFocus = (e) => {
    setFocused(true);
    if (props.onFocus) props.onFocus(e);
  };

  const handleBlur = (e) => {
    setFocused(false);
    if (onBlur) onBlur(e);
  };

  const inputType = type === 'password' && showPassword ? 'text' : type;

  return (
    <div className={clsx(
      styles.container,
      fullWidth && styles.fullWidth,
      className
    )}>
      {label && (
        <label className={styles.label}>
          {label}
          {required && <span className={styles.required}>*</span>}
        </label>
      )}
      
      <div className={clsx(
        styles.inputWrapper,
        focused && styles.focused,
        error && styles.error,
        success && styles.success,
        disabled && styles.disabled
      )}>
        {icon && iconPosition === 'left' && (
          <span className={styles.iconLeft}>{icon}</span>
        )}
        
        <input
          type={inputType}
          className={styles.input}
          value={value}
          onChange={onChange}
          onFocus={handleFocus}
          onBlur={handleBlur}
          disabled={disabled}
          placeholder={placeholder}
          name={name}
          {...props}
        />
        
        {icon && iconPosition === 'right' && !(type === 'password') && (
          <span className={styles.iconRight}>{icon}</span>
        )}
        
        {type === 'password' && (
          <button
            type="button"
            className={styles.passwordToggle}
            onClick={() => setShowPassword(!showPassword)}
            tabIndex="-1"
          >
            {showPassword ? '👁️' : '👁️‍🗨️'}
          </button>
        )}
      </div>
      
      {(error || success || helper) && (
        <div className={clsx(
          styles.message,
          error && styles.errorMessage,
          success && styles.successMessage
        )}>
          {error || success || helper}
        </div>
      )}
    </div>
  );
};

export default Input;
