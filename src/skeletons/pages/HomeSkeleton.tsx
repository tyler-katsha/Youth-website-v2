import { NavigationSkeleton } from "./NavigationSkeleton";
import { FooterSkeleton } from "./FooterSkeleton";
import styles from '../../modules/Home.module.css'
import { Skeleton } from "../components/Skeleton";
export const HomeSkeleton = () => {
    return (
        <>
            <NavigationSkeleton />

            <div className={styles.pageWrapper}>

                <div className={styles.mainContent}>
                    {/* --- Hero Section --- */}
                    <div className={styles.heroSection}>
                        <div className={styles.heroText}>

                            <Skeleton width="350px" height="50px" />
                            <br />
                            <Skeleton width="480px" height="50px" />
                            <br />
                            <Skeleton width="177px" height="50px" />
                            <br />
                            <Skeleton width="443px" height="22px" />
                            <br />
                            <Skeleton width="470px" height="22px" />
                            <br />
                            <Skeleton width="60px" height="25px" />
                            <br />
                            <Skeleton width="212px" height="50px" />
                        </div>

                        <div className={styles.heroImageContainer}>
                            <Skeleton width="100%" height="100%" />
                        </div>
                    </div>

                    <div className={styles.featuresGrid}>

                        <div className={styles.featureCard}>
                            <div className={styles.featureIcon}><Skeleton width="100%" height="100%" /></div>
                            <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', marginTop: '15px' }}>
                                <Skeleton width="107px" height="30px" />
                            </span>

                            <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', marginTop: '15px' }}>
                                <Skeleton width="250px" height="22px" />
                            </span>

                            <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', marginTop: '15px' }}>
                                <Skeleton width="267px" height="22px" />
                            </span>

                            <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', marginTop: '15px' }}>
                                <Skeleton width="80px" height="22px" />
                            </span>
                        </div>

                        <div className={styles.featureCard}>
                            <div className={styles.featureIcon}><Skeleton width="100%" height="100%" /></div>
                            <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', marginTop: '15px' }}>
                                <Skeleton width="170px" height="30px" />
                            </span>
                            <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', marginTop: '15px' }}>
                                <Skeleton width="245px" height="22px" />
                            </span>

                            <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', marginTop: '15px' }}>
                                <Skeleton width="252px" height="22px" />
                            </span>

                            <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', marginTop: '15px' }}>
                                <Skeleton width="50px" height="22px" />
                            </span>
                        </div>

                        <div className={styles.featureCard}>
                            <div className={styles.featureIcon}><Skeleton width="100%" height="100%" /></div>
                            <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', marginTop: '15px' }}>
                                <Skeleton width="125px" height="30px" />
                            </span>
                            <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', marginTop: '15px' }}>
                                <Skeleton width="250px" height="22px" />
                            </span>

                            <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', marginTop: '15px' }}>
                                <Skeleton width="247px" height="22px" />
                            </span>

                            <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', marginTop: '15px' }}>
                                <Skeleton width="120px" height="22px" />
                            </span>
                        </div>

                    </div>

                </div>
            </div>
            <FooterSkeleton />
        </>
    );
};