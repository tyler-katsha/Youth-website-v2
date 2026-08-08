import styles from '../modules/About.module.css';
import youthImage from '../assets/engedi-image.png';
import { useNavigate } from 'react-router-dom';

export const About = () => {
    const navigate = useNavigate();
    
    return (
            <div className={styles.pageWrapper}>
                <main className={styles.mainContent}>

                    <section className={styles.heroSection}>
                        <div className={styles.heroText}>
                            <h1>Welcome to Engedi Youth</h1>

                            <h2>
                                We are a vibrant community of young people passionate
                                about growing in our faith, building meaningful
                                friendships, and making a positive impact in our
                                church and community. Whether you're joining us for
                                the first time or have been part of the family for
                                years, there's always a place for you at Engedi Youth.
                            </h2>

                            <button className={styles.primaryBtn} onClick={() => navigate('/login')}>Join Our Community</button>
                        </div>

                        <div className={styles.heroImageContainer}>
                            <img src={youthImage} alt="Engedi Youth"/>
                        </div>
                    </section>

                    <section className={styles.featureGrid}>

                        <div className={styles.featureCard}>

                            <h3>Grow in Faith</h3>

                            <p>
                                Through Bible studies, worship nights, and prayer,
                                we encourage every young person to build a personal
                                relationship with Jesus Christ.
                            </p>
                        </div>

                        <div className={styles.featureCard}>

                            <h3>Build Friendships</h3>

                            <p>
                                Meet new people, connect through small groups,
                                and become part of a welcoming family that supports
                                and encourages one another.
                            </p>
                        </div>

                        <div className={styles.featureCard}>

                            <h3>Serve Together</h3>

                            <p>
                                We believe faith is lived out through service.
                                Join outreach projects, volunteer opportunities,
                                and events that make a difference in our community.
                            </p>
                        </div>

                    </section>

                </main>
            </div>
    );
};