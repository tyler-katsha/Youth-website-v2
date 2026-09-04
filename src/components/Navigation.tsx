import { Link, useNavigate } from 'react-router-dom';
import { useUser } from '../contexts/UserContext';
import styles from '../modules/Navigation.module.css';
import { API } from '../utils/API';
import { getToken } from '../utils/Utils';
import { NotificationInbox } from './NotificationInbox';
import { Profile } from './Profile';
import { RedirectUser } from './RedirectUser';
import type { NavigationProps } from '../types/navigation';

export const Navigation: React.FC<NavigationProps> = ({ title }) => {
    const navigate = useNavigate();

    const { user, logout } = useUser();

    const isLoggedIn = !user?.roles.includes('GUEST');

    const isAdmin = user?.roles.includes('ADMIN');
    const isLeaderOrAdmin = user?.roles.includes('ADMIN') || user?.roles.includes('YOUTH_LEADER');

    const handleLogout = async () => {
        logout();
    };

    const GuestLogin = async () => {
        const token = getToken();
        try {

            const response = await fetch(`${API}/auth/guest/redirect?token=${token}`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                }
            });

            if (!response.ok) {
                throw new Error(`Logout failed: ${response.status}`);
            }

            console.log('Success')
        } catch (error) {
            console.error(error);
        }
    }
    const handleLoginRoute = async () => {
        try {
            await GuestLogin();
        } catch (err) {
            console.error(err);
        } finally {
            localStorage.removeItem('isGuest')
            navigate('/login')
        }
    }

    if (!user) return <RedirectUser />

    const navigateLink = (route: string, name: string) => <li><Link to={route}>{name}</Link></li>

    return (
        <nav className={styles.navbar}>
            <div className={styles.navbarLeft}>
                {title}
            </div>

            <div className={styles.navbarCenter}>
                <ul className={styles.navLinks}>
                    {navigateLink('/', 'Home')}
                    {navigateLink('/contact-us', 'Contact Us')}
                    {isLoggedIn && (
                        <>
                            {navigateLink('/profile', 'Profile')}
                            {navigateLink('/calendar', 'Calendar')}
                            {navigateLink('/gallery', 'Gallery')}
                        </>
                    )}

                    {isLeaderOrAdmin && (
                        <>
                            {navigateLink('/members', 'Members')}
                        </>
                    )}

                    {isAdmin && (
                        <>
                            {navigateLink('/logs', 'System Logs')}
                            {navigateLink('/performances', 'System Performances')}
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
                        <button onClick={handleLoginRoute} className={styles.loginBtn}>Login</button>

                    </>

                )}

                {isLoggedIn && <NotificationInbox />}
            </div>
        </nav>
    )
}