import { NavigationSkeleton } from "./NavigationSkeleton";
import { FooterSkeleton } from "./FooterSkeleton";
import styleMemberCard from '../../modules/Member.module.css';
import styleMemberList from '../../modules/MemberList.module.css'
import { Skeleton } from "../components/Skeleton";
export const MembersSkeleton = () => {
    return (
        <>
            <NavigationSkeleton />

            <div className={styleMemberList.memberListContainer}>

                <h1 className={styleMemberList.title}>
                    <Skeleton width="260px" height="33px"/>
                </h1>

            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20].map((item) => (
                <div className={styleMemberCard.memberContainer} key={item}>

                    <div className={styleMemberCard.profileWrapper}>
                        <Skeleton width="280px" height="200px"/>   
                    </div>

                    <div className={styleMemberCard.memberLabelAndAttribute}>
                        <Skeleton width="110px" height="22px"/>
                        <Skeleton width="100px" height="17px"/>
                    </div>

                    <div className={styleMemberCard.memberLabelAndAttribute}>
                        <Skeleton width="110px" height="22px"/>
                        <Skeleton width="100px" height="17px"/>
                    </div>
                </div>
            ))}

            
            
        </div>
            <FooterSkeleton />
        </>
    );
};