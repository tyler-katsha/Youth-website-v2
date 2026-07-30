import { useUser } from '../contexts/UserContext';
import styles from '../modules/AnnouncementCard.module.css';
import type { AnnouncementProps, functionalAnnouncementProps } from '../utils/types';
import { isPermitted } from '../utils/Utils';
import { RedirectUser } from './RedirectUser';

export const AnnouncementCard: React.FC<functionalAnnouncementProps> = ({id,type,title,message,createdAt,expiresAt,isUrgent,removeAnnouncement,editAnnouncement}) => {

    const {user} = useUser();
    
    const announcement:AnnouncementProps = {id,type,title,message,createdAt,expiresAt,isUrgent};
    if(!user) return <RedirectUser/>

    return (
        <div className={`${styles.cardContainer} ${styles[type]} ${isUrgent ? styles.urgentCard : ''}`} key={id}>
            <div className={styles.cardHeader}>
                <div className={styles.titleWrapper}>
                    {isUrgent && <span className={styles.urgentBadge}>Urgent</span>}
                    <h3 className={styles.cardTitle}>{title}</h3>
                </div>
                
                <div className={styles.metaData}>
                    <span className={styles.cardTime}>Posted: {createdAt}</span>
                    {isPermitted(user.roles) && expiresAt && (<span className={styles.cardExpires}>Expires: {expiresAt}</span>)}
                </div>
            </div>
            
            <div className={styles.cardBody}>
                <p className={styles.cardMessage}>{message}</p>
            </div>

            {isPermitted(user.roles) && (
                <div className={styles.buttons}>
                    <button className={styles.editBtn} onClick={() => editAnnouncement(announcement)}>Edit</button>
                    <button className={styles.deleteBtn} onClick={() => removeAnnouncement(announcement)}>Delete</button>
                </div>
            )}
        </div>
    )
}