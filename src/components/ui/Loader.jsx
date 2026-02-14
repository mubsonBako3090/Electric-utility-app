'use client';

import styles from './Loader.module.css';

export default function Loader({ 
  size = 'medium', 
  color = 'primary',
  fullScreen = false,
  text = 'Loading...'
}) {
  const loader = (
    <div className={`${styles.loader} ${styles[size]} ${styles[color]}`}>
      <div className={styles.spinner}></div>
      {text && <p className={styles.text}>{text}</p>}
    </div>
  );

  if (fullScreen) {
    return (
      <div className={styles.fullScreen}>
        {loader}
      </div>
    );
  }

  return loader;
}
