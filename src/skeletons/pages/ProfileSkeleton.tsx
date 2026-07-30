import styles from '../../modules/Profile.module.css'
import { FooterSkeleton } from './FooterSkeleton';
import { NavigationSkeleton } from './NavigationSkeleton';
import { Skeleton } from '../components/Skeleton';
export const ProfileSkeleton = () => {
    return (
        <>
            <NavigationSkeleton />
            <div className={styles.pageWrapper}>
                <div className={styles.profileCard}>
                    {/* Header Section */}
                    <div className={styles.coverPhoto}>
                        <div className={styles.avatarContainer}>
                            <Skeleton width="100%" height="100%" borderRadius="50%" />
                        </div>
                    </div>

                    {/* Name & Quick Actions */}
                    <div className={styles.headerInfo}>
                        <div className={styles.nameSection}>
                            <Skeleton width="200px" height="32px" />
                            <br />
                            <Skeleton width="100px" height="20px" />
                        </div>
                        <Skeleton width="120px" height="40px" />
                    </div>

                    {/* Main Profile Info */}
                    <div className={styles.contentGrid}>
                        {/* Left Sidebar */}
                        <div className={styles.statsBox}>
                            <div className={styles.statItem}>
                                <Skeleton width="40px" height="16px" />
                                <br />
                                <Skeleton width="100px" height="24px" />
                            </div>
                        </div>

                        {/* Right Area */}
                        <div className={styles.detailsArea}>
                            <Skeleton width="150px" height="28px" />
                            <br />
                            <Skeleton width="100%" height="100px" />
                        </div>
                    </div>
                </div>
            </div>

            <FooterSkeleton />
        </>

    );
};