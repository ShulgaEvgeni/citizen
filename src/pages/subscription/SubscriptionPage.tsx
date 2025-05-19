import React from 'react';
import styles from './SubscriptionPage.module.scss';
// import { Button } from '../../shared/ui'; // больше не используется
import type { ReactNode } from 'react';

interface SubscriptionModalProps {
  open: boolean;
  onClose: () => void;
  mainContent?: ReactNode;
  bottomContent?: ReactNode;
}

const SubscriptionModal: React.FC<SubscriptionModalProps> = ({ open, onClose, mainContent, bottomContent }) => {
  if (!open) return null;

  return (
    <div className={styles.root}>
      <div className={styles.overlay} onClick={onClose} />
      <div className={styles.modal}>
        <button className={styles.close} onClick={onClose} aria-label="Закрыть">×</button>
        <div className={styles.modalContent}>
          {mainContent}
        </div>
        <div className={styles.modalBottom}>
          {bottomContent}
        </div>
      </div>
    </div>
  );
};

export default SubscriptionModal; 