import styles from '../../modules/Calendar.module.css'
import { Skeleton } from './Skeleton';
export const CalendarSkeletonComp = () => {
    return (
         <div className={styles.calendarWrapper}>
            <div className={styles.header}>
                <Skeleton width='50px' height='30px'/>
                <Skeleton width='150px' height='35px'/>
                <Skeleton width='50px' height='30px'/>
            </div>

            <div className={styles.grid}>

                {[1,2,3,4,5,6,7].map(i => (
                    <div key={i} className={styles.dayName}><Skeleton width='40px' height='15px'/></div>
                ))}


                {Array.from({ length: 35 }).map((_, index) => (
                    <div className={styles.dayCell} key={index}>
                        <Skeleton width='100%' height='100%' borderRadius='50%'/>
                    </div>
                ))}
            </div>
        </div>
    )
}