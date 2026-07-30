import { FooterSkeleton } from "./FooterSkeleton";
import { NavigationSkeleton } from "./NavigationSkeleton";
import style from '../../modules/CalendarPage.module.css'
import { Skeleton } from "../components/Skeleton";
import { CalendarSkeletonComp } from "../components/CalendarSkeletonComp";
export const CalendarSkeleton = () => {
    return (
        <>
            <NavigationSkeleton />
            <div className={style.pageWrapper}>
                <div className={style.contentContainer}>

                    <div className={style.calendarSection}>
                        <CalendarSkeletonComp/>
                    </div>

                    <div className={style.eventsPanel}>

                        <div className={style.panelHeader}>
                            <h2><Skeleton width="150px" height="30px"/></h2>

                            <Skeleton width="100px" height="35px"/>
                        </div>

                        <Skeleton width="225px" height="22px"/>
                    </div>


                </div>

            </div>
            <FooterSkeleton />
        </>
    );
};