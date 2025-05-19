import React from 'react';
import styles from './Input.module.scss';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  hint?: string;
  error?: string;
  fullWidth?: boolean;
  onClear?: () => void;
}

const Input: React.FC<InputProps> = ({
  label,
  hint,
  error,
  fullWidth = false,
  className,
  value,
  onClear,
  ...props
}) => {
  const showClearButton = value && value.toString().length > 0;

  return (
    <div className={`${styles.inputBlock} ${fullWidth ? styles.fullWidth : ''}`}>
      {label && <div className={styles.label}>{label}</div>}
      <div className={styles.inputWrapper}>
        <input
          className={`${styles.input} ${error ? styles.error : ''} ${className || ''}`}
          value={value}
          {...props}
        />
        {showClearButton && (
          <button
            type="button"
            className={styles.clearButton}
            onClick={onClear}
            aria-label="Clear input"
          >
            ×
          </button>
        )}
      </div>
      {hint && !error && <div className={styles.hint}>{hint}</div>}
      {error && <div className={styles.errorText}>{error}</div>}
    </div>
  );
};

export default Input; 