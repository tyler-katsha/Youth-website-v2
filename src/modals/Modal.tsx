import React, { useEffect } from "react";
import { createPortal } from "react-dom";
import styles from "../modules/Modal.module.css";

interface ModalProps {
    isOpen: boolean;
    title: string;
    children: React.ReactNode;
    onClose: () => void;
    footer?: React.ReactNode;
}

export const Modal: React.FC<ModalProps> = ({
    isOpen,
    title,
    children,
    onClose,
    footer
}) => {
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === "Escape") onClose();
        };
        if (isOpen) document.addEventListener("keydown", handleKeyDown);
        return () => document.removeEventListener("keydown", handleKeyDown);
    }, [isOpen, onClose]);

    if (!isOpen) return null;

    return createPortal(
        <div className={styles.modalOverlay} onClick={onClose}>

            
            <div 
                className={styles.modalContainer} 
                onClick={(e) => e.stopPropagation()} 
                role="dialog" 
                aria-modal="true"
            >
                <header className={styles.modalHeader}>
                    <h2 className={styles.modalTitle}>{title}</h2>
                    <button className={styles.closeBtn} onClick={onClose} aria-label="Close modal">
                        ✕
                    </button>
                </header>

                <main className={styles.modalBody}>
                    {children}
                </main>

                {footer && <footer className={styles.modalFooter}>{footer}</footer>}
            </div>
        </div>,
        document.body
    );
};