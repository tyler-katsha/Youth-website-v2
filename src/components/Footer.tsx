import { Link } from 'react-router-dom';
import styles from '../modules/Footer.module.css';
import { validGuest } from '../utils/Utils';

export const Footer = () => {
    const isGuest = localStorage.getItem('isGuest')
    
    return (
        <footer className={styles.footer}>
            <div className={styles.footerContent}>
                
                <div className={styles.brandSection}>
                    <h3 className={styles.brandName}>Engedi Youth</h3>
                    <p className={styles.brandTagline}>
                        Creating a space for students to grow, connect, and serve together.
                    </p>
                </div>

                <div className={styles.linksSection}>
                    <div className={styles.linkGroup}>
                        <h4>Navigation</h4>
                        <Link to='/'>Home</Link>
                        <Link to={validGuest(isGuest,'/profile')}>{isGuest ? "Login to unlock" : "My Profile"}</Link>
                        <Link to={validGuest(isGuest,'/calendar')}>{isGuest ? "Login to unlock" : "Calendar"}</Link>
                    </div>
                    
                    <div className={styles.linkGroup}>
                        <h4>Connect</h4>
                        <Link to='/contact-us' replace>Contact Us</Link>
                        <Link to='https://www.instagram.com/engedi_offical/' replace>Instagram</Link>
                        {/* <Link to='www.youtube.com' replace>YouTube</Link> */}
                    </div>
                </div>
                
            </div>

            <div className={styles.bottomBar}>
                <span>&copy; {new Date().getFullYear()} Engedi Community Church. All rights reserved.</span>
                <span>Built for the Youth Ministry</span>
            </div>
        </footer>
    );
};