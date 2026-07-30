import { Skeleton } from "../components/Skeleton"
import styles from '../../modules/Navigation.module.css'
export const NavigationSkeleton = () => {
   
    return (
        <nav className={styles.navbar}>
            <div className={styles.navbarLeft}>
                <Skeleton width="150px" height="40px"/>
            </div>

            <div className={styles.navbarCenter}>
                <ul className={styles.navLinks}>

                    {[1,2,3,4,5].map((item) => (
                        <li key={item}>
                            <Skeleton width="100px" height="20px"/>
                        </li>
                    ))}
                </ul>
            </div>
            <div className={styles.navbarRight}>
                <div style={{display:'flex',alignItems:'center',gap:'10px'}}>
                    <Skeleton width="80px" height="80px" borderRadius="50%"/>
                    <Skeleton width="70px" height="35px"/>
                </div>
            </div>
        </nav>
    )
}