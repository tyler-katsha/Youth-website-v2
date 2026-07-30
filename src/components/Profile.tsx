import styles from '../modules/ProfileImage.module.css'
import { useNavigate } from "react-router-dom";
import { ColorUtil } from "../utils/ColorUtils";
import { getInitials } from '../utils/Utils';

interface ProfileProps {
    name: string;
    profileImageUrl: string | undefined;
    link?: boolean;
}
export const Profile: React.FC<ProfileProps> = ({ name, profileImageUrl, link = true }) => {

    const navigate = useNavigate();

    return (

        <>
            {link ? (
                <a onClick={() => navigate("/profile")}>
                    <div className={styles.container} style={{ backgroundColor: ColorUtil() }}>
                        {profileImageUrl ? (
                            <img src={profileImageUrl} alt={`${name} Image`} className={styles.image} />
                        ) : (
                            <span className={styles.initials}>{getInitials(name)}</span>
                        )}
                    </div>
                </a>
            ) : (
                <div className={styles.container} style={{ backgroundColor: ColorUtil(), cursor:'auto' }}>
                    {profileImageUrl ? (<img src={profileImageUrl} alt={`${name} Image`} className={styles.image} />
                    ) : (<span className={styles.initials}>{getInitials(name)}</span>)}
                </div>
            )}
        </>


    )
}