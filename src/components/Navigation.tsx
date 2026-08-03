import styles from '../modules/Navigation.module.css';
import { Link, useNavigate } from 'react-router-dom';
import { Profile } from './Profile';
import { useUser } from '../contexts/UserContext';
import { API } from '../utils/API';
import { NotificationInbox } from './NotificationInbox';
import { RedirectUser } from './RedirectUser';
// import { NotificationInbox } from './NotificationInbox';

interface NavigationProps {
    title: string;
}

export const Navigation: React.FC<NavigationProps> = ({ title }) => {
    const navigate = useNavigate();

    const { user, logout } = useUser();


    const isLoggedIn = !user?.roles.includes('GUEST');

    const isAdmin = user?.roles.includes('ADMIN');
    const isLeaderOrAdmin = user?.roles.includes('ADMIN') || user?.roles.includes('YOUTH_LEADER');

    const signout = async () => {
        try {
            await fetch(`${API}/auth/logout`, {
                method: "POST",
                credentials: 'include',
            })
        } catch (error) {
            console.error(`Backend logout failed ${error}`)
        }
    }

    const handleLogout = async () => {
        try {
            await signout();
        } finally {
            logout();
            localStorage.removeItem("isGuest");
            navigate('/')
        }
    }

    const handleLoginRoute = () => {
        try {
            navigate('/login')
        } catch (err) {
            console.error(err);
        } finally {
            localStorage.removeItem("isGuest");
        }
    }

    if (!user) return <RedirectUser/>

    const navigateLink = (route:string,name:string) => (
        (
            <li><Link to={route}>{name}</Link></li>
        ))
    return (
        <nav className={styles.navbar}>
            <div className={styles.navbarLeft}>
                {title}
            </div>

            <div className={styles.navbarCenter}>
                <ul className={styles.navLinks}>
                    {navigateLink('/','Home')}
                    {navigateLink('/contact-us','Contact Us')}
                    {isLoggedIn && (
                        <>
                            {navigateLink('/profile','Profile')}
                            {navigateLink('/calendar','Calendar')}
                            {navigateLink('/gallery','Gallery')}
                        </>
                    )}

                    {isLeaderOrAdmin && (
                        <>
                            {navigateLink('/members','Members')}
                        </>
                    )}

                    {isAdmin && (
                        <>
                            {/* {navigateLink('/request-page','Requests')} */}
                            {navigateLink('/logs','System Logs')}
                            {navigateLink('/performances','System Performances')}
                            {/* {navigateLink('/about','About')} */}
                            {/* {navigateLink('/test-popup','popup')} */}
                            {navigateLink('/test-emails','Test Emails')}
                            {/* {navigateLink('/announcements','Announcements')} */}
                        </>
                    )}
                </ul>
            </div>
            <div className={styles.navbarRight}>
                
                {isLoggedIn ? (
                    <>
                        <Profile name={user.name} profileImageUrl={user.profileImageUrl} />
                        <button onClick={handleLogout}>Sign out</button>
                    </>
                ) : (
                    <>
                        <Profile name={'Guest'} profileImageUrl={undefined} link={false} />
                        <button onClick={handleLoginRoute} className={styles.loginBtn}>
                            Login
                        </button>

                    </>

                )}

                <NotificationInbox/>
            </div>
        </nav>
    )
}