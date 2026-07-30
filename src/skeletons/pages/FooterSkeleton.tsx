import { Skeleton } from "../components/Skeleton"
import styles from '../../modules/Footer.module.css'
export const FooterSkeleton = () => {

    return(
        <footer className={styles.footer}>
            <div className={styles.footerContent}>
                
                {/* Brand & Church Info */}
                <div className={styles.brandSection}>
                    <h3 className={styles.brandName}><Skeleton width="130px" height="25px"/></h3>
                        <Skeleton width="260px" height="22px"/>
                        <br/>
                        <Skeleton width="210px" height="22px"/>
                </div>

                {/* Quick Navigation Links */}
                <div className={styles.linksSection}>
                    <div className={styles.linkGroup}>
                        <h4><Skeleton width="98px" height="21px"/></h4>
                        <Skeleton width="70px" height="17px"/>
                        <Skeleton width="75px" height="17px"/>
                        <Skeleton width="65px" height="17px"/>
                    </div>
                    
                    <div className={styles.linkGroup}>
                        <h4><Skeleton width="98px" height="21px"/></h4>
                        <Skeleton width="84px" height="17px"/>
                        <Skeleton width="77px" height="17px"/>
                        <Skeleton width="73px" height="17px"/>
                    </div>
                </div>
                
            </div>

            {/* Bottom Copyright Bar */}
            <div className={styles.bottomBar}>
                <Skeleton width="330px" height="17px"/>
                <Skeleton width="167px" height="17px"/>
            </div>
        </footer>
    )
}