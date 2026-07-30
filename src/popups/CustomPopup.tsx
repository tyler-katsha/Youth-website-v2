import styles from '../modules/Popup.module.css'

interface CustomPopupProps{
    isOpen:boolean;
    type: 'success' | 'error';
    title?:string;
    message:string;
    onClose: () => void;
}

export const CustomPopup: React.FC<CustomPopupProps> = ({isOpen,type,title,message,onClose}) => {

    if(!isOpen) return null;

    const isSuccess = type == 'success';

    return(
        <div className={styles.overlay}>
            <div className={`${styles.popupContainer} ${isSuccess ? styles.successBorder : styles.errorBorder}`}>
                
                <div className={`${styles.iconContainer} ${isSuccess ? styles.successText : styles.errorText}`}>
                    {isSuccess ? (
                        // Checkmark Icon
                        <svg fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" width="48" height="48">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                        </svg>
                    ) : (
                        // X Icon
                        <svg fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" width="48" height="48">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                        </svg>
                    )}
                </div>

                <h2 className={styles.title}>
                    {title || (isSuccess ? 'Success!' : 'Error!')}
                </h2>
                
                <p className={styles.message}>{message}</p>

                <button 
                    className={`${styles.closeBtn} ${isSuccess ? styles.successBg : styles.errorBg}`} 
                    onClick={onClose}
                >
                    Close
                </button>
            </div>
        </div>
    )
}