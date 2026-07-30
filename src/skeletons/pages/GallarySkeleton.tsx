import { NavigationSkeleton } from "./NavigationSkeleton";
import { FooterSkeleton } from "./FooterSkeleton";
import styles from '../../modules/Gallery.module.css'
import { Skeleton } from "../components/Skeleton";
export const GallerySkeleton = () => {
    return (
        <>
            <NavigationSkeleton/>
            <div className={styles.pageWrapper}>
                <div className={styles.contentContainer}>
                    
                    {/* Header Details */}
                    <div className={styles.header}>
                        <span style={{display:'flex',alignItems:'center',justifyContent:'center'}}>
                            <Skeleton width="300px" height="35px"/>
                        </span>

                        <span style={{display:'flex',alignItems:'center',justifyContent:'center',marginTop:'15px'}}>
                            <Skeleton width="530px" height="22px"/>
                        </span>
                    </div>

                    {/* Image Grid */}
                    <div className={styles.imageGrid}>
                        {[1,2,3,4,5,6,7,8,9,10,11,12].map((i) => (
                            <div key={i} className={styles.imageCard}>
                                <Skeleton width="100%" height="100%"/>
                            </div>
                        ))}
                    </div>

                </div>
            </div>
            <FooterSkeleton/>
        </>
    );
};