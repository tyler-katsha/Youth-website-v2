import { FooterSkeleton } from "./FooterSkeleton";
import { NavigationSkeleton } from "./NavigationSkeleton";
import styles from '../../modules/Requests.module.css'
import { Skeleton } from "../components/Skeleton";
export const RequestsSkeleton = () => {
    return (
        <>
            <NavigationSkeleton />
            <div className={styles.container}>
                <Skeleton width="180px" height="27px"/>
                <br/>
                <table className={styles.table}>
                    <thead>
                        <tr>
                            <th><Skeleton width="70px" height="22px"/></th>
                            <th><Skeleton width="70px" height="22px"/></th>
                            <th><Skeleton width="70px" height="22px"/></th>
                            <th><Skeleton width="70px" height="22px"/></th>
                        </tr>
                    </thead>
                    <tbody>
                        {[1, 2, 3, 4, 5].map((item) => (
                            <tr className={styles.row} key={item}>
                                <td><Skeleton width="100px" height="22px"/></td>
                                <td><Skeleton width="100px" height="22px"/></td>
                                <td><Skeleton width="100px" height="22px"/></td>
                                <td>
                                    <Skeleton width="70px" height="33px"/>
                                    <br/>
                                    <Skeleton width="70px" height="33px"/>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>

            </div>
            <FooterSkeleton />
        </>
    );
};