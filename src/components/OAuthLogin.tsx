import styles from '../modules/Auth.module.css'
// import instagramIcon from '../assets/instagram-icon.png';
// import facebookIcon from '../assets/facebook-icon.png';
import googleIcon from '../assets/google-icon.png';
import { useState } from 'react';
import type { ToastResponse } from '../utils/types';
import { API, OAUTH_API } from '../utils/API';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../contexts/UserContext';
import { removeAll } from '../utils/Utils';
export const OAuthLogin = () => {
    const navigate = useNavigate();
    const { continueAsGuest } = useUser();
    const [_isGuestLoading, setIsGuestLoading] = useState(false);
    const [_popupConfig, setPopupConfig] = useState({
        isOpen: false,
        type: 'success' as ToastResponse,
        message: ''
    });

    const handleOAuth2Login = (provider: string) => {
        removeAll();
        try {
            window.location.href = `${OAUTH_API}/${provider}`
        } catch (err) {
            setPopupConfig({
                isOpen: true,
                type: 'error',
                message: 'Resource not found'
            });
        }
    };
    const handleContinueAsGuest = async () => {
        setIsGuestLoading(true);
        try {
            const response = await fetch(`${API}/auth/continue-as-guest`, {
                method: "POST",
                credentials: 'include',
                
            });


            if (!response.ok) {
                setPopupConfig({
                    isOpen: true,
                    type: 'error',
                    message: 'Unable to create continue as guest token'
                });
                return;
            }

            localStorage.setItem('isGuest', 'true');
            
            continueAsGuest();
            navigate('/');

        } catch (err) {
            setPopupConfig({
                isOpen: true,
                type: 'error',
                message: 'Something went wrong. Please try again'
            });
            navigate('/login')
        } finally{
            setIsGuestLoading(false);
        }
    }
    return (
        <>
            <div className={styles.divider}>OR CONTINUE WITH</div>

            <div className={styles.socialGrid}>
                <button className={styles.socialBtn} onClick={() => handleOAuth2Login('google')}><img src={googleIcon} alt='Login with Google' /></button>
                {/* <button className={styles.socialBtn} onClick={() => handleOAuth2Login('facebook')}><img src={facebookIcon} alt='Login with Google' /></button> */}
                {/* <button className={styles.socialBtn} onClick={() => handleOAuth2Login('instagram')}><img src={instagramIcon} alt='Login with Google' /></button> */}
            </div>

            <button className={styles.guestBtn} onClick={handleContinueAsGuest}>Continue as Guest</button>
        </>
    )
}