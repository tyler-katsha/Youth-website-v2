import style from "../modules/Member.module.css";
import type { AppRole } from "../utils/types";
import { getInitials } from "../utils/Utils";

export interface Member {
    profileImageUrl?: string;
    name: string;
    roles:AppRole[]
    dateOfBirth: string;
    email?: string;
    enabled:boolean;
}

export const MemberCard: React.FC<Member> = ({name, dateOfBirth, profileImageUrl,email}) => {
    const formattedDate = dateOfBirth && !isNaN(new Date(dateOfBirth).getTime()) ? new Date(dateOfBirth).toLocaleDateString("en-US", { day: "numeric", month: "long", year: "numeric"}): "No birthday found";

    const initials = getInitials(name);

    return (
        <div className={style.memberContainer}>
            {profileImageUrl ? (
                <img src={profileImageUrl} alt={`${name} Member`} className={style.image}/>
            ) : (
                <div className={style.profilePlaceHolder}>
                    <div className={style.avatar}>{initials}</div>
                </div>
            )}

            <div className={style.memberLabelAndAttribute}>
                <span className={style.label}>Member Name:</span>
                <span className={style.value}>{name}</span>
            </div>

            <div className={style.memberLabelAndAttribute}>
                <span className={style.label}>Birthday:</span>
                <span className={style.value}>{formattedDate}</span>
            </div>

            <div className={style.memberLabelAndAttribute}>
                <span className={style.label}>Email:</span>
                <span className={style.value}>{email}</span>
            </div>
        </div>
    );
};