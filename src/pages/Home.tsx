import { useNavigate } from 'react-router-dom';
import styles from '../modules/Home.module.css';
import { useUser } from '../contexts/UserContext';
import calendarIcon from '../assets/calendar-icon.png';
import gmailIcon from '../assets/gmail-icon.png';
import engediImage from '../assets/engedi-image.png'
import lockIcon from '../assets/lock-icon.png'
import { Profile } from '../components/Profile';
import { HomeSkeleton } from '../skeletons/pages/HomeSkeleton';
import { RedirectUser } from '../components/RedirectUser';

export const Home = () => {
    const navigate = useNavigate();

    const { user, isLoading } = useUser();
    const isGuest = localStorage.getItem('isGuest')
    if (isLoading) {
        return <HomeSkeleton />
    }
    if (!user) {
        return <RedirectUser />
    }


    return (
            <div className={styles.pageWrapper}>

                <div className={styles.mainContent}>
                    <div className={styles.heroSection}>
                        <div className={styles.heroText}>
                            <h1>Make New Friends.<br />Welcome to Our Corner of the Web!</h1>
                            <h2>Built for laughs, memories, and planning our next big adventure. Connect with your small group and stay up to date.</h2>
                            <button className={styles.primaryBtn} onClick={() => navigate(isGuest ? '/login' : '/calendar')}>{isGuest ? "Join the community" : "See Upcoming Events"}</button>
                        </div>

                        <div className={styles.heroImageContainer}>
                            <img src={engediImage} alt="Youth group hanging out" />
                        </div>
                    </div>

                    <div className={styles.featuresGrid}>


                        <div className={`${styles.featureCard} ${isGuest ? styles.lockedCard : ''}`} onClick={() => navigate(isGuest ? '/login' : '/profile')}>
                            <div className={styles.featureIcon}>
                                <Profile name={user.name} profileImageUrl={user.profileImageUrl} />
                                {isGuest && <img src={lockIcon} alt='Locked' className={styles.lockIcon}/>}
                            </div>
                            <h3>My Profile</h3>
                            <p>{isGuest ? "Create an account to customize your profile and connect with the community." : "Update your bio, change your role, and let everyone know what ministries you serve in."}</p>
                        </div>

                        <div className={`${styles.featureCard} ${isGuest ? styles.lockedCard : ''}`} onClick={() => navigate(isGuest ? '/login' : '/calendar')}>
                            <div className={styles.featureIcon}>
                                <img src={calendarIcon} alt='Calendar Icon' />
                                {isGuest && <img src={lockIcon} alt='Locked' className={styles.lockIcon}/>}
                            </div>
                            <h3>Group Calendar</h3>
                            <p>{isGuest ? "Sign in to see upcoming events and RSVP." : "Never miss a worship night. Check out our schedule and add your own events."}</p>
                        </div>

                        <div className={styles.featureCard} onClick={() => navigate('/contact-us')}>
                            <div className={styles.featureIcon}><img src={gmailIcon} alt='Gmail Icon' /></div>
                            <h3>Get in Touch</h3>
                            <p>Have questions about a retreat or need prayer? Send a message to our leadership team.</p>
                        </div>

                    </div>

                </div>
            </div>
    );
};