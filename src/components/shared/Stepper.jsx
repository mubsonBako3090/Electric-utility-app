import React from 'react';
import styles from './Stepper.module.css';
import clsx from 'clsx';

const Stepper = ({
  steps,
  currentStep,
  orientation = 'horizontal',
  size = 'medium',
  variant = 'default',
  onChange,
}) => {
  const getStepStatus = (index) => {
    if (index < currentStep) return 'completed';
    if (index === currentStep) return 'current';
    return 'pending';
  };

  return (
    <div className={clsx(
      styles.stepper,
      styles[orientation],
      styles[size]
    )}>
      {steps.map((step, index) => {
        const status = getStepStatus(index);
        
        return (
          <div key={index} className={styles.stepWrapper}>
            <div
              className={clsx(
                styles.step,
                styles[status],
                styles[variant],
                step.disabled && styles.disabled,
                onChange && !step.disabled && styles.clickable
              )}
              onClick={() => !step.disabled && onChange?.(index)}
            >
              <div className={styles.stepIndicator}>
                {status === 'completed' ? (
                  <span className={styles.completedIcon}>✓</span>
                ) : (
                  <span className={styles.stepNumber}>{index + 1}</span>
                )}
              </div>
              
              <div className={styles.stepContent}>
                <h4 className={styles.stepTitle}>{step.title}</h4>
                {step.description && (
                  <p className={styles.stepDescription}>{step.description}</p>
                )}
              </div>
            </div>
            
            {index < steps.length - 1 && (
              <div className={clsx(
                styles.connector,
                styles[orientation],
                index < currentStep && styles.completed
              )} />
            )}
          </div>
        );
      })}
    </div>
  );
};

export default Stepper;
