import { NavigationSkeleton } from "./NavigationSkeleton";
import styles from '../../modules/ContactPage.module.css';
import { Skeleton } from "../components/Skeleton";
import { FooterSkeleton } from "./FooterSkeleton";

export const ContactSkeleton = () => {
    return (
        <>
            <NavigationSkeleton/>

            <div className={styles.pageWrapper}>

                <div className={styles.contactCard}>

                    <div className={styles.infoBox}>
                        <Skeleton width="170px" height="40px"/>
                        <span style={{marginTop:'20px'}}/>
                        <Skeleton width="270px" height="12px"/>
                        <span style={{marginTop:'5px'}}/>
                        <Skeleton width="300px" height="12px"/>
                        <span style={{marginTop:'5px'}}/>
                        <Skeleton width="220px" height="12px"/>

                        <br/>
                        <br/>
                        <br/>
                        <div className={styles.contactDetail}>
                            <div className={styles.detailItem}>
                                <span className={styles.detailLabel}><Skeleton width="75px" height="22px"/></span>
                                <span className={styles.detailValue}><Skeleton width="200px" height="22px"/></span>
                            </div>

                            <div className={styles.detailItem}>
                                <span className={styles.detailLabel}><Skeleton width="60px" height="22px"/></span>
                                <span className={styles.detailValue}><Skeleton width="120px" height="22px"/></span>
                            </div>

                            <div className={styles.detailItem}>
                                <span className={styles.detailLabel}><Skeleton width="130px" height="22px"/></span>
                                <span className={styles.detailValue}>
                                    <Skeleton width="160px" height="22px"/>
                                    <br/>
                                    <Skeleton width="200px" height="22px"/>
                                </span>
                            </div>
                        </div>
                    </div>

                    <div className={styles.formBox}>
                        <Skeleton width="200px" height="40px"/>
                        <br />

                            <form className={styles.contactForm}>

                                <div className={styles.formRow}>
                                    <div className={styles.formGroup}>
                                        <Skeleton width="100px" height="25px"/>
                                        <Skeleton width="250px" height="45px"/>
                                    </div>

                                    <div className={styles.formGroup}>
                                        <Skeleton width="100px" height="25px"/>
                                        <Skeleton width="250px" height="45px"/>
                                    </div>
                                </div>

                                <div className={styles.formGroup}>
                                    <Skeleton width="100px" height="25px"/>
                                    <Skeleton width="500px" height="45px"/>
                                </div>

                                <div className={styles.formGroup}>
                                    <Skeleton width="100px" height="25px"/>
                                    <Skeleton width="500px" height="120px"/>
                                </div>
                                <br />
                                <Skeleton width="525px" height="45px"/>
                            </form>
                       
                    </div>

                </div>
            </div>

            <FooterSkeleton/>
        </>
    );
};