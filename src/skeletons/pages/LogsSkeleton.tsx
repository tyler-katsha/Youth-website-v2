import { NavigationSkeleton } from "./NavigationSkeleton";
import { Skeleton } from "../components/Skeleton";
import styles from '../../modules/Logs.module.css'
import { FooterSkeleton } from "./FooterSkeleton";
export const LogsSkeleton = () => {
    return (
        <>
            <NavigationSkeleton />
            <div className={styles.pageWrapper}>
                <div className={styles.dashboardContainer}>
                    <div className={styles.header}>
                        <Skeleton width="150px" height="25px" />


                        <Skeleton width="250px" height="30px" />
                    </div>

                    <div className={styles.tableWrapper}>
                        <table className={styles.logTable}>
                            <thead>
                                <tr>
                                    {[1, 2, 3, 4].map((item) => (
                                        <th key={item}>
                                            <Skeleton width="100px" height="25px" />
                                        </th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>

                                {[1, 2, 3, 4, 5, 6, 7].map((item) => (
                                    <tr key={item}>
                                        <td>
                                            <Skeleton width="150px" height="20px" />
                                        </td>
                                        <td>
                                            <Skeleton width="130px" height="20px" />
                                        </td>
                                        <td>
                                            <Skeleton width="180px" height="20px" />
                                        </td>
                                        <td>
                                            <span className={`${styles.statusBadge}`}>
                                                <Skeleton width="100px" height="20px" />
                                            </span>
                                        </td>

                                    </tr>
                                ))}

                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            <FooterSkeleton/>
        </>
    );
};